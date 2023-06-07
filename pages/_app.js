import '@/styles/globals.css'
import { ChakraProvider, Flex, Spinner } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import NextNProgress from "nextjs-progressbar";
import NavigationLoader from '@/Components/Global/NavLoader';

export default function App({ Component, pageProps: { session, ...pageProps }}) {
    return (
        <SessionProvider session = { session }>
            <NavigationLoader />
            <NextNProgress options={{ showSpinner: false }} color='#ff8563' />
            { Component.auth ? (
                <Auth>
                    <ChakraProvider>
                        <Component {...pageProps} />
                    </ChakraProvider>
                </Auth>
            ) : (
                <ChakraProvider>
                    <Component {...pageProps} />
                </ChakraProvider>
            )}
            <ToastContainer />
        </SessionProvider>
    );
}

function Auth({ children }) {
    const { data: session, status, loading } = useSession({required: true});
    if(status === "loading") return (
        <Flex w={"100%"} h={"100vh"} justifyContent={'center'} alignItems={'center'}>
            <Spinner w={30} h={30} size={"xl"} />
        </Flex>
    );
    return children;
}
