import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { auth } from "@/src/lib/firebase";
import {measurePageLoadTime} from "@/src/lib/performance";
import "@/src/styles/globals.css";
const Auth = dynamic(() => import("@/src/components/Auth"), { ssr: false });

function MyApp({ Component, pageProps }) {
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        measurePageLoadTime('app');
    }, []);


    if (loading) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <ChakraProvider>
            {user ? <Component {...pageProps} /> : <Auth />}
        </ChakraProvider>
    );
}

export default MyApp;
