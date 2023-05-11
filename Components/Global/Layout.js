import Head from "next/head";
import Navbar from "./Navigation/Navbar";
import { Box } from "@chakra-ui/layout";
import Footer from "./Footer";
import { useRouter } from "next/router";

const Layout = (props) => {
    const router = useRouter();
    const pageDescription = "A photo gallery allowing our group to share 4K images without the compression of modern social media platforms.";
    const pageImage = "https://gallery.beenhamow.co.uk/img/metadata.png";
    const pageURL = `https://gallery.beenhamow.co.uk${router.pathname}`;

    return (
        <div>
            <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>{props.pageTitle}</title>
                <meta name="description" content={pageDescription} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp="name" content={props.pageTitle} />
                <meta itemProp="description" content={pageDescription} />
                <meta itemProp="image" content={pageImage} />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={pageURL} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={props.pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={pageImage} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={props.pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={pageImage} />

                <meta name="theme-color" content="#ff8563"></meta>

                <meta charSet="UFT-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link ref="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
            </Head>
            <div>
                <Navbar />
                <Box>
                    {props.children}
                </Box>
                <Footer />
            </div>
        </div>
    )
}

export default Layout;