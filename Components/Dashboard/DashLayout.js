import Head from "next/head";
import DashContent from "./DashContent";
import Footer from "../Global/Footer";
import { Flex } from "@chakra-ui/react";

const Layout = (props) => {
    const pageDescription = "A photo gallery allowing our group to share 4k images without the compression of modern social media platforms.";
    const pageImage = "https://gallery.beenhamow.co.uk/img/metadata.png";

    return (
        <div>
            <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>{props.pageTitle}</title>
                <meta name="description" content={pageDescription} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content={props.pageTitle} />
                <meta itemprop="description" content={pageDescription} />
                <meta itemprop="image" content={pageImage} />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content="https://gallery.beenhamow.co.uk" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={props.pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={pageImage} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={props.pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={pageImage} />

                <meta charSet="UFT-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <link ref="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
            </Head>
            <div>  
                <DashContent>
                    <Flex flexDirection={"column"} justifyContent={"space-between"} minH={"calc(100vh - 80px)"} h={"auto"}>
                        {props.children}
                        <Footer />
                    </Flex>
                </DashContent>
            </div>
        </div>
    )
}

export default Layout;