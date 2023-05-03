import Layout from "@/Components/Dashboard/DashLayout";
import { useSession } from 'next-auth/react';
import { hasToken } from "@/utils/checkUser";

export default function Home() {
    const { data: session } = useSession();
    return (
        <Layout pageTitle = "Photo Gallery | My Dashboard">
            
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const token = await hasToken(context.req);
    if(!token) {
        return {
            redirect: {
                destination: context.resolvedUrl ? `/auth/login?referer=${context.req.headers["x-forwarded-proto"] + '://' + context.req.headers.host + context.resolvedUrl}` : "/auth/login",
                permanent: false
            }
        }
    }

    return { props: {} }
}