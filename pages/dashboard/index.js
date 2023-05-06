import Layout from "@/Components/Dashboard/DashLayout";
import { Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { hasToken } from "@/utils/checkUser";
import { FcAddImage, FcCamera, FcConferenceCall, FcDataBackup, FcFolder } from 'react-icons/fc';
import { useSession } from "next-auth/react";
import HomeCard from "@/Components/Dashboard/Home/Card";

import User from "@/models/User";
import Album from "@/models/Album";
import Image from "@/models/Image";

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};

export default function DashHome({ userCount, albumCount, imageCount, storageUsed }) {
    const { data: session } = useSession();
    return (
        <Layout pageTitle = "Photo Gallery | My Dashboard">
            <Heading p={6} pb={0} as={"h1"}>Welcome back, {session.user.fname}!</Heading>
            <Wrap p={6} align={"center"} justify={"start"} spacing='30px'w={"100%"} style={{ flexGrow: 1 }}>
                <WrapItem maxW={{ base: '100%', lg: 'calc(50% - 30px)' }} w={"100%"}>
                    <HomeCard heading={`${userCount} Users`} icon={FcConferenceCall} description={ 'Registered on the platform.' } href={"/dashboard/users"} />
                </WrapItem>
                <WrapItem maxW={{ base: '100%', lg: 'calc(50% - 30px)' }} w={"100%"}>
                    <HomeCard heading={`${albumCount} Albums`} icon={FcFolder} description={ 'Shared on the platform.' } href={"/dashboard/albums"} />
                </WrapItem>
                <WrapItem maxW={{ base: '100%', lg: 'calc(50% - 30px)' }} w={"100%"}>
                    <HomeCard heading={`${imageCount} ${ imageCount == 1 ? 'Image' : 'Images'}`} icon={FcAddImage} description={ `Stored on the platform.` } href={"/dashboard/albums"} />
                </WrapItem>
                <WrapItem maxW={{ base: '100%', lg: 'calc(50% - 30px)' }} w={"100%"}>
                    <HomeCard heading={`${humanFileSize(storageUsed, 1)}`} icon={FcDataBackup} description={ 'Storage used on the platform.' } href={"/dashboard/albums"} />
                </WrapItem>
            </Wrap>
        </Layout>
    )
}

// Require authentication
DashHome.auth = true;

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

    const users = await User.find().select({ password: 0 });
    const userCount = users.length;

    const albums = await Album.find();
    const albumCount = await albums.length;

    let storageUsed = 0;

    const images = await Image.find().select({ fileSize: 1 });
    for(let image of images) {
        storageUsed += image.fileSize;
    }
    const imageCount = images.length;

    return { props: { albumCount, userCount, imageCount, storageUsed } }
}