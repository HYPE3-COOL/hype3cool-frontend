import axios from 'axios';
import { getSession, signIn } from 'next-auth/react';

// special treatment for privy jwt token
import { getAccessToken } from '@privy-io/react-auth';
import { signOut } from 'next-auth/react';
import { jwtDecode } from 'jwt-decode';
import { showMessage } from '@/utils/toast';

const apiUrl = process.env.NEXT_PUBLIC_API_HOST!;

const apiClient = axios.create({
    baseURL: apiUrl,
});

// Interceptor to add JWT token
apiClient.interceptors.request.use(
    async (config) => {
        // Check if the request requires an access token
        if (config.headers['Requires-Auth']) {
            const session = await getSession();

            // check expiry
            if (session && session?.backendTokens?.accessToken) {
                const decoded = jwtDecode(session.backendTokens.accessToken);
                const expiry = decoded.exp;
                const currentTime = Date.now() / 1000;
                
                // if token is expired, refresh it
                if (expiry && expiry < currentTime) {
                    const access_token = await getAccessToken();
                    console.log({access_token})
                    if (access_token) {
                        await signIn('privy', {
                            token: access_token,
                            redirect: false,
                        });

                        config.headers.Authorization = `Bearer ${access_token}`;
                    } else {
                        showMessage('Session expired, please sign in again', 'error');
                        signOut();
                    }
                } else {
                    // console.log(session.backendTokens.accessToken)
                    // console.log(`Token is still valid, expiry: ${expiry}, current time: ${currentTime}`);
                    config.headers.Authorization = `Bearer ${session.backendTokens.accessToken}`;
                }
            }
        }

        return config;

        // const session = await getSession();
        // if (session && session.accessToken) {
        //     config.headers.Authorization = `Bearer ${session.accessToken}`;
        // }
        // return config;
    },
    (error) => {
        console.error('Request interceptor error:', error.message);
        return Promise.reject(error);
    },
);

export default apiClient;

apiClient.interceptors.response.use(
    (response) => {
        // httpstatus 202 is specially for file upload
        if (response.data.status === 'success' || response.status === 202) {
            return response.data;
        }
    },
    (error) => {
        console.error('Response interceptor error:', error.message);
        return Promise.reject(error);
    },
);
