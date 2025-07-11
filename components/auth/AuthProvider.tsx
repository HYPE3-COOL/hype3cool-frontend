'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePrivy, useToken, useLogout, useLogin } from '@privy-io/react-auth';
import { jwtDecode } from 'jwt-decode';

// redux
import { dispatch, IRootState, useSelector } from '@/store';
import { getMe } from '@/store/slices/auth';
import { setMainDialog } from '@/store/slices/menu';
import { closeSidebar } from '@/store/slices/themeConfigSlice';
import { DIALOG_NAMES } from '@/constants/constants';

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextValue {
    login: () => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const { data: session, status } = useSession(); // next-auth

    // privy
    const { ready, authenticated, user } = usePrivy();
    const { getAccessToken } = useToken();

    const { authUser, getMeStatus } = useSelector((state: IRootState) => state.auth);

    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (status == 'unauthenticated') {
            if (ready && authenticated) {
                signUp();
            }
        }
    }, [ready, status, authenticated]);

    // // if session is authenticated, but privy is not authenticated, sign out
    // useEffect(() => {
    //     if (status === 'authenticated' && !authenticated) {
    //         signOut();
    //     }
    // }, [session, status, authenticated]);

    // nextauth signup with privy token to backend
    const signUp = async () => {
        try {
            const access_token = await getAccessToken();
            await signIn('privy', {
                token: access_token,
                // callbackUrl: '/',
                redirect: false,
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Check if the token is expired
    const isTokenExpired = (token: string) => {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    };

    // Function to handle token refresh with backoff
    const refreshTokenWithBackoff = async () => {
        try {
            const access_token = (await getAccessToken()) || '';
            if (isTokenExpired(access_token)) {
                throw new Error('Token expired');
            }
            setRetryCount(0); // Reset retry count on success
            return access_token;
        } catch (error) {
            console.error('Error refreshing token:', error);
            if (retryCount < 5) {
                setRetryCount(retryCount + 1);
                setTimeout(refreshTokenWithBackoff, 2 ** retryCount * 1000); // Exponential backoff
            } else {
                console.error('Max retry attempts reached. Logging out.');
                // Log the user out if max retry attempts are reached
                await signOut();
            }
        }
    };

    // Check token expiration and redo login if necessary
    useEffect(() => {
        const checkTokenExpiration = async () => {
            try {
                const access_token = (await getAccessToken()) || '';
                if (isTokenExpired(access_token)) {
                    await refreshTokenWithBackoff();
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
            }
        };

        if (ready && authenticated) {
            checkTokenExpiration();
        }
    }, [ready, authenticated]);

    useEffect(() => {
        if (session?.user?.id && status === 'authenticated') {
            dispatch(getMe());
            dispatch(closeSidebar());
        }
    }, [session?.user?.id, status]);

    // logout
    const { logout } = useLogout({
        onSuccess: () => {
            signOut({
                redirect: true,
                callbackUrl: '/',
            });
        },
    });

    useEffect(() => {
        // check if user is new user and not sign up by twitter through privy
        if (status === 'authenticated' && authUser?.isNewUser && !user?.twitter?.subject) {
            // if new user , show new user dialog to ask for username
            router.push('/');
            dispatch(setMainDialog({ open: true, type: DIALOG_NAMES.NEW_USER, data: authUser }));
        }
    }, [authUser, status, user]);

    // privy
    const { login } = useLogin({
        onComplete(isNewUser) {
        // onComplete(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount) {
            // console.log('login', { user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount });
            if (isNewUser) {
                signUp();
            }
            // router.push('/');
        },
    });

    const value: AuthContextValue = {
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
