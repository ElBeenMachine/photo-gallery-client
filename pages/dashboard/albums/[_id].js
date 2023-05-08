import Layout from "@/Components/Dashboard/DashLayout";
import { hasToken } from "@/utils/checkUser";

import { Modal, ModalContent, ModalOverlay, ModalFooter, ModalHeader, ModalBody, ModalCloseButton, Box, WrapItem, Button, Text, useDisclosure, Menu, MenuButton, MenuList, MenuItem, Heading, Stack, Skeleton, Input, FormControl, Flex, Spinner } from "@chakra-ui/react";
import Album from "@/models/Album";
import User from "@/models/User";
import DBImage from "@/models/Image";

import dbConnect from "@/utils/dcConnect";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import AdminBar from "@/Components/Dashboard/AdminBar";
import { HamburgerIcon } from "@chakra-ui/icons";

import { Image } from "@chakra-ui/react";

import handleError from "@/utils/fetchHandler";

import { toast } from "react-toastify";
import ImageCard from "@/Components/Dashboard/Albums/ImageCard";

import { useState } from "react";

export default function DashAlbums({ album }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isUploading, setIsUploading] = useState(false);
    const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();
    const { isOpen: isOpenUpload, onOpen: onOpenUpload, onClose: onCloseUpload } = useDisclosure();

    function uploadImages(e) {
        e.preventDefault();
        setIsUploading(true);
        const files = e.currentTarget.files.files;

        let i = 0;
        for(let file of files) {
            const formData = new FormData();
            formData.append("files", file);
            formData.append("albumId", album._id);
            fetch(`${process.env.API_URL}/images/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session.accessToken}`
                },
                body: formData
            }).then(handleError).then(async data => {
                console.log(data.message); 
                i++;
                if(i == files.length) {
                    setIsUploading(false);
                    toast.success(`${files.length} file(s) have been successfully uploaded. They are now being processed and will be available shortly.`)
                    onCloseUpload();
                    return router.push(router.asPath);
                }
            }).catch(err => {
                toast.error("Error: " + err.message);
                return onCloseUpload();
            });
        }
    }

    async function deleteAlbum(e) {
        e.preventDefault();
        const albumData = {
            albumId: album._id
        }

        fetch(`${process.env.API_URL}/albums/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(albumData)
        }).then(handleError).then(data => {
            toast.success(data.message);
            return router.push("/dashboard/albums");
        }).catch(err => {
            toast.error("Error: " + err.message);
            return onCloseNew();
        });
    }

    return (
        <Layout pageTitle = { `Photo Gallery | ${album.name}` }>
            { session.user.role == "admin" ? (
                <AdminBar>
                    <Menu>
                        <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                            <HamburgerIcon boxSize={25} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={onOpenUpload}>Upload Images</MenuItem>
                            <MenuItem onClick={onOpenConfirm}>Delete Album</MenuItem>
                        </MenuList>
                    </Menu>
                </AdminBar>
            ) : (null) }
            <Stack flexGrow={1} py={10}>
                <Stack direction={"column"} px={10} >
                    <Heading>{album.name}</Heading>
                    <Text>{ album.description }</Text>
                    <Text fontSize={"sm"} opacity={0.8} ><em>Click an image to download it</em></Text>
                </Stack>
                { album.images.length > 0 ? (
                    <Box padding={10} w="100%" sx={{ columnCount: [1, 2, 3, 4], columnGap: "8px" }}>
                        {album.images.map((image) => (
                            <ImageCard image={image} />
                        ))}
                    </Box>
                ) : (
                    <WrapItem as={"div"} minH={300} justifyContent={"center"} alignItems={"center"}>
                        <Text>No Images Uploaded Yet</Text>
                    </WrapItem>
                )}
            </Stack>
            

            {/* Confirm Deletion Modal */}
            <Modal isOpen={isOpenConfirm} onClose={onCloseConfirm}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Are You Sure?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Deleting this album will also delete all images associated with it. This action cannot be undone.</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={deleteAlbum}>
                            Yes
                        </Button>
                        <Button onClick={onCloseConfirm}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            
            {/* File Upload Form */}
            <Modal isOpen={isOpenUpload} onClose={onCloseUpload}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload files</ModalHeader>
                    <ModalCloseButton />
                    { !isUploading ? (
                        <ModalBody>
                            <Text pb={5}>Select the files that you would like to upload to the album.</Text>

                            <Stack as={"form"} onSubmit={uploadImages}>
                                <FormControl>
                                    <Input name="files" accept="image/jpeg" multiple type="file" required />
                                </FormControl>
                                <ModalFooter>
                                    <Button colorScheme='green' mr={3} type="submit">
                                        Upload
                                    </Button>
                                    <Button onClick={onCloseUpload}>Cancel</Button>
                                </ModalFooter>
                            </Stack>
                        </ModalBody>
                    ) : (
                        <ModalBody>
                            <Text pb={5}>Uploading images, please do not close this window.</Text>
                            
                            <Flex justifyContent={"center"} alignItems={"center"} p={20}>
                                <Spinner size={"lg"} />
                            </Flex>
                        </ModalBody>
                    )}
                    
                </ModalContent>
            </Modal>
        </Layout>
    );
}

// Require authentication
DashAlbums.auth = true;

export async function getServerSideProps(context) {
    const { _id } = context.query;
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
    let album = await Album.findOne({ _id });
    if(!album) return {
        redirect: {
            destination: "/dashboard/albums",
            permanent: false
        }
    }

    let data = {
        _id: album._id,
        name: album.name,
        description: album.description,
        cover: album.cover,
        createdAt: album.createdAt,
        images: [],
        author: null
    }


    await DBImage.find({ albumId: album._id.toString() }).then((images => {
        for(let image of images) {
            data.images.push({
                _id: image._id,
                url: image.url,
                fileSize: image.fileSize,
                uploadedAt: image.uploadedAt,
                uploadedBy: image.uploadedBy || null
            });
        }
    }));

    await User.findOne({ _id: album.createdBy }).select({ password: 0, __v: 0, email: 0 }).then((user) => {
        data.author = {
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            username: user.username,
            avatar: user.avatar
        }
    });

    return { props: { album: JSON.parse(JSON.stringify(data)) } }
}