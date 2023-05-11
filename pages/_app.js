import '@/styles/globals.css'
import { ChakraProvider, Flex, Spinner } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import NextNProgress from "nextjs-progressbar";

export default function App({ Component, pageProps: { session, ...pageProps }}) {
    return (
        <SessionProvider session = { session }>
            { Component.auth ? (
                <Auth>
                    <ChakraProvider>
                        <NextNProgress color='#ff8563' />
                        <Component {...pageProps} />
                        <ToastContainer />
                    </ChakraProvider>
                </Auth>
            ) : (
                <ChakraProvider>
                    <NextNProgress />
                    <Component {...pageProps} />
                    <ToastContainer />
                </ChakraProvider>
            )}
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
