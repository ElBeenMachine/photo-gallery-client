import Layout from "@/Components/Dashboard/DashLayout";
import { isAdmin, hasToken } from "@/utils/checkUser";
import UserCard from "@/Components/Dashboard/Users/UserCard";
import { Wrap, WrapItem } from "@chakra-ui/react";
import UserSchema from "@/models/User";
import dbConnect from "@/utils/dcConnect";

export default function DashUsers({ users }) {
    return (
        <Layout pageTitle = "Photo Gallery | Manage Users">
            <Wrap p={6} align={"center"} justify={"center"} spacing='30px'>
                { users.map(user => (    
                    <WrapItem>
                        <UserCard name={user.fname + " " + user.lname} role={user.role} avatar={user.avatar} _id={user._id}/>
                    </WrapItem>
                ))}
            </Wrap>
        </Layout>
    );
}

// Require authentication
DashUsers.auth = true;

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

    const admin = await isAdmin(context.req);
    if(!admin) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        }
    }

    dbConnect();
    const users = await UserSchema.find();
    const data = users.map(user => {
        return { _id: user._id, fname: user.fname, lname: user.lname, role: user.role, avatar: user.avatar }
    });

    return { props: { users: JSON.parse(JSON.stringify(data)) } }
}