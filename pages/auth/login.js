import Layout from "@/Components/Global/Layout";
import LoginForm from "@/Components/Authentication/LoginForm";

export default function Home() {
    return (
        <Layout pageTitle = "Photo Gallery | Home">
            <LoginForm />
        </Layout>
    );
}
