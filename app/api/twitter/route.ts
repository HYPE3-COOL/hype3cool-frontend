import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';
import { getServerSession } from 'next-auth/next';
import { generateCodeChallenge } from '@/utils/twitter';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { codeVerifier, codeChallenge } = generateCodeChallenge();
    const rootUrl = 'https://twitter.com/i/oauth2/authorize';
    const agentId = request.nextUrl.searchParams.get('agentId'); // Get the agentId from the query parameters
    const options = {
        redirect_uri: process.env.TWITTER_CALLBACK_URL!,
        client_id: process.env.TWITTER_CLIENT_ID!,
        state: encodeURIComponent(JSON.stringify({ agentId })),
        response_type: 'code',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        scope: ['users.read', 'tweet.read', 'tweet.write', 'follows.write', 'offline.access'].join(' '),
    };

    const qs = new URLSearchParams(options).toString();
    const response = NextResponse.redirect(`${rootUrl}?${qs}`);

    // Store the code verifier in a cookie
    response.cookies.set('code_verifier', codeVerifier, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 5 * 60, // 5 minutes
    });
    
    return response;
}
