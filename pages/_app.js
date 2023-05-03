import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps: { session, ...pageProps }}) {
    return (
        <SessionProvider session = { session }>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
            <ToastContainer />
        </SessionProvider>
    );
}
