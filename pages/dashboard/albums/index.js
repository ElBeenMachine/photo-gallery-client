import Layout from "@/Components/Dashboard/DashLayout";
import { hasToken } from "@/utils/checkUser";
import AlbumCard from "@/Components/Dashboard/Albums/AlbumCard";
import { Wrap, WrapItem, Button, Spinner, Flex, Stack, FormControl, Input, FormLabel, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Textarea, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import Album from "@/models/Album";
import User from "@/models/User";
import dbConnect from "@/utils/dcConnect";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import handleError from "@/utils/fetchHandler";
import { useRouter } from "next/router";
import AdminBar from "@/Components/Dashboard/AdminBar";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function DashAlbums({ albums }) {
    const router = useRouter();
    const { data: session } = useSession();
    const { isOpen: isOpenNew, onOpen: onOpenNew, onClose: onCloseNew } = useDisclosure();
    const [loadingNewAlbum, setLoadingNewAlbum] = useState(false);

    // Post request to create album
    async function createUser(e) {
        setLoadingNewAlbum(true);
        e.preventDefault();
        const userData = {
            name: e.target.name.value,
            description: e.target.description.value
        }

        fetch(`${process.env.API_URL}/albums/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(userData)
        }).then(handleError).then(data => {
            toast.success(data.message);
            router.replace(router.asPath);
            setLoadingNewAlbum(false);
            return onCloseNew();
        }).catch(err => {
            toast.error("Error: " + err.message);
            setLoadingNewAlbum(false);
            return onCloseNew();
        });
    }

    return (
        <Layout pageTitle = "Photo Gallery | Manage Albums">
            { session.user.role == "admin" ? (
                <AdminBar>
                    <Menu>
                        <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                            <HamburgerIcon boxSize={25} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={onOpenNew}>Create a new album</MenuItem>
                        </MenuList>
                    </Menu>
                </AdminBar>
            ) : (null) }

            <Wrap p={6} align={"center"} w={"100%"} justify={"center"} spacing='30px' flexGrow={1}>
                { albums.length > 0 ? (
                    albums.map(album => (
                        <WrapItem w={"100%"} maxW={{ base: "90%", md: "445px" }} key={album._id}>
                            <AlbumCard album={album} />
                        </WrapItem>
                    ))
                ) : (
                    <WrapItem as={"div"} minH={300} justifyContent={"center"} alignItems={"center"}>
                        <Text>No Albums Exist</Text>
                    </WrapItem>
                )}
            </Wrap>

            {/* New Album Modal */}
            <Modal isOpen={isOpenNew} onClose={onCloseNew}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Album</ModalHeader>
                    <ModalCloseButton />

                    { loadingNewAlbum ? (
                        <Flex justifyContent={"center"} alignItems={"center"} w={"100%"} minH={150}>
                            <Spinner size='xl' />
                        </Flex>
                    ) : (
                        <Stack as={"form"} onSubmit={createUser}>
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>Album Name</FormLabel>
                                    <Input name="name" placeholder='Enter a name' required />
                                </FormControl>
                                
                                <FormControl>
                                    <FormLabel>Album Description</FormLabel>
                                    <Textarea resize={"vertical"} h={100} maxH={150} maxLength={200} name="description" placeholder='Enter a description' required />
                                </FormControl>
                            </ModalBody>
            
                            <ModalFooter>
                                <Button type={"submit"} colorScheme='green' mr={3}>
                                    Create Album
                                </Button>
                                <Button onClick={onCloseNew}>Cancel</Button>
                            </ModalFooter>
                        </Stack>
                    )}
                </ModalContent>
            </Modal>
        </Layout>
    );
}

// Require authentication
DashAlbums.auth = true;

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

    dbConnect();
    let albums = await Album.find()
    let data = albums.map(album => {
        return { _id: album._id, name: album.name, description: album.description, cover: album.cover, createdBy: album.createdBy }
    });

    for(let album of data) {
        await User.findOne({ _id: album.createdBy }).select({ password: 0, role: 0, email: 0, createdAt: 0, username: 0, __v: 0 }).then((user) => {
            album.author = user;
        });
    }

    return { props: { albums: JSON.parse(JSON.stringify(data)) } }
}