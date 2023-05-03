import Layout from "@/Components/Global/Layout";
import LoginForm from "@/Components/Authentication/LoginForm";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getSession } from "next-auth/react";

export default function Home() {
    const router = useRouter();
    const redirect = router.query.referer ? router.query.referer : "/";

    // Check if logged in and redirect to homepage if so
    useEffect(() => {
        getSession().then((session) => {
            if(session) router.replace(redirect)
        });
    }, [router]);
    return (
        <Layout pageTitle = "Photo Gallery | Login">
            <LoginForm />
        </Layout>
    );
}
