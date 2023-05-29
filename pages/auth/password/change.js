import Layout from "@/Components/Global/Layout";
import PasswordForm from "@/Components/Authentication/PasswordForm";
import { hasToken } from "@/utils/checkUser";

export default function ChangePassword() {
    return (
        <Layout pageTitle = "Photo Gallery | Change Password">
            <PasswordForm />
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

    return { props: { users: JSON.parse(JSON.stringify({})) } };
}