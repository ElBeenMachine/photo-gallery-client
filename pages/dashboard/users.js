import Layout from "@/Components/Dashboard/DashLayout";
import { useSession } from 'next-auth/react';
import { isAdmin } from "@/utils/checkUser";

export default function DashUsers() {
    return (
        <Layout pageTitle = "Photo Gallery | Manage Users">
            
        </Layout>
    );
}

// Require authentication
DashUsers.auth = true;

export async function getServerSideProps(context) {
    const token = await isAdmin(context.req);
    if(!token) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        }
    }

    return { props: {} }
}