import Head from "next/head";
import Navbar from "./Navbar";
import { Box } from "@chakra-ui/layout";

const Layout = (props) => {
    return (
        <div>
            <Head>
                <title>{props.pageTitle}</title>
                <meta charSet="UFT-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <link ref="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
            </Head>
            <div>
                <Navbar />
                <Box p={4}>
                    {props.children}
                </Box>
            </div>
        </div>
    )
}

export default Layout;