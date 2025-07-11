import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import axios from 'axios';

import { authOptions } from '@/lib/auth-options';
// import { generateCodeChallenge } from '@/utils/twitter';

async function getTwitterOAuthToken(code: string, codeVerifier: string) {
    const tokenResponse = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            client_id: process.env.TWITTER_CLIENT_ID!,
            redirect_uri: process.env.TWITTER_CALLBACK_URL!,
            code_verifier: codeVerifier,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID!}:${process.env.TWITTER_CLIENT_SECRET!}`).toString('base64')}`,
            },
        },
    );

    return tokenResponse.data;
}

async function getTwitterUser(accessToken: string) {
    try {
        // const profileResponse = await axios.get(
        //     'https://api.twitter.com/2/users/me?user.fields=affiliation,connection_status,created_at,description,entities,id,location,most_recent_tweet_id,name,pinned_tweet_id,profile_banner_url,profile_image_url,protected,public_metrics,receives_your_dm,subscription_type,url,username,verified,verified_followers_count,verified_type,withheld',
        //     {
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`,
        //         },
        //     },
        // );

        const profileResponse = await axios.get('https://api.twitter.com/2/users/me', {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return profileResponse.data.data;
    } catch (error) {
        console.error('Error getting Twitter user:', error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the code, error, and state from Twitter callback
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error) {
        // Log the error and redirect to the homepage
        console.error('Error from Twitter callback:', error);
        const response = NextResponse.redirect(
            new URL(`${process.env.NEXT_PUBLIC_HOST}/user/${session.user.username}?twitter-oauth=false`, request.url)
        );
        response.cookies.delete('code_verifier'); // Clean up the cookie
        return response;
    }

    if (!code || !state) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        // Decode the state parameter
        const decodedState = decodeURIComponent(state);
        const stateObj = JSON.parse(decodedState); // Parse the agentId from the state parameter

        const codeVerifier = request.cookies.get('code_verifier')?.value;
        const agentId = stateObj.agentId;

        if (!codeVerifier || !agentId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Exchange the code for an OAuth token
        const oAuthToken = await getTwitterOAuthToken(code, codeVerifier);
        if (!oAuthToken) {
            console.error('Failed to retrieve Twitter OAuth token');
            const response = NextResponse.redirect(new URL('/', request.url));
            response.cookies.delete('code_verifier');
            return response;
        }

        const { refresh_token, access_token, scope, token_type, expires_in } = oAuthToken;
        const user = await getTwitterUser(access_token);

        if (!user) {
            console.error('Failed to retrieve Twitter user');
            const response = NextResponse.redirect(new URL('/', request.url));
            response.cookies.delete('code_verifier');
            return response;
        }

        // Update the user's access tokens in your API
        const updateRes = await axios.put(
            `${process.env.NEXT_PUBLIC_API_HOST}/agents/${agentId}/access-tokens`,
            {
                id: user.id, // Twitter user ID
                accessToken: access_token,
                refreshToken: refresh_token,
                scope: scope,
                tokenType: token_type,
                expiresIn: expires_in,
            },
            { headers: { Authorization: `Bearer ${session?.backendTokens?.accessToken}` } }
        );

        if (updateRes.data.status === 'success') {
            console.log("Redirecting to user's profile page");
            const response = NextResponse.redirect(
                new URL(`${process.env.NEXT_PUBLIC_HOST}/user/${session.user.username}?twitter-oauth=true`, request.url)
            );
            response.cookies.delete('code_verifier'); // Clean up the cookie
            return response;
        } else {
            console.error('Failed to update Twitter profile');
            const response = NextResponse.redirect(new URL('/404', request.url));
            response.cookies.delete('code_verifier'); // Clean up the cookie
            return response;
        }
    } catch (error) {
        console.error('Error in Twitter callback:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// export async function GET(request: NextRequest) {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // get the code which return from the twitter callback
//     const searchParams = request.nextUrl.searchParams;
//     const code = searchParams.get('code');
//     const error = searchParams.get('error');
//     const state = searchParams.get('state');

//     if (error) {
//         // Handle error case (e.g., user denied access)
//         // return NextResponse.json({ error }, { status: 400 });
//         console.error('Error from Twitter callback:', error);
//         redirect('/');
//     }

//     if (!code || !state) {
//         return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
//     }

//     try {
//         const decodedState = decodeURIComponent(state);
//         const stateObj = JSON.parse(decodedState); // Parse the agentId from the state parameter

//         const codeVerifier = request.cookies.get('code_verifier')?.value;
//         const agentId = stateObj.agentId;

//         if (!codeVerifier || !agentId) {
//             return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
//         }

//         const oAuthToken = await getTwitterOAuthToken(code, codeVerifier);
//         if (!oAuthToken) {
//             // return redirect('/');
//             redirect('/');
//         }

//         const { refresh_token, access_token } = oAuthToken;
//         const user = await getTwitterUser(access_token);

//         if (!user) {
//             // return redirect('/');
//             redirect('/');
//         }

//         const updateRes = await axios.put(
//             process.env.NEXT_PUBLIC_API_HOST! + `/agents/${agentId}/access-tokens`,
//             {
//                 id: user.id,        // twitter id
//                 accessToken: access_token,
//                 refreshToken: refresh_token,
//             },
//             { headers: { Authorization: `Bearer ${session?.backendTokens?.accessToken}` } },
//         );

//         if (updateRes.data.status === 'success') {
//             console.log("redirecting to user's profile page");
//             const response = NextResponse.redirect(new URL(`/user/${session.user.username}`, request.url));
//             response.cookies.delete('code_verifier');
//             return response;
//         } else {
//             // 404
//             console.error('Failed to update Twitter profile');
//             const response = NextResponse.redirect('/404');
//             response.cookies.delete('code_verifier');
//             return response;
//         }
//     } catch (error) {
//         console.error('Error in Twitter callback:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }
