import Layout from "@/Components/Dashboard/DashLayout";
import { hasToken } from "@/utils/checkUser";

import { useColorModeValue, Modal, ModalContent, ModalOverlay, ModalFooter, ModalHeader, ModalBody, ModalCloseButton, Box, WrapItem, Button, Text, useDisclosure, Menu, MenuButton, MenuList, MenuItem, Heading, Stack, Skeleton, Input, FormControl, Flex, Spinner, Progress, Image } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

import Album from "@/models/Album";
import User from "@/models/User";
import DBImage from "@/models/Image";

import dbConnect from "@/utils/dcConnect";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import AdminBar from "@/Components/Dashboard/AdminBar";
import { CloseIcon, DownloadIcon, HamburgerIcon } from "@chakra-ui/icons";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai"
import { BsDownload } from "react-icons/bs";

import handleError from "@/utils/fetchHandler";

import { toast } from "react-toastify";
import ImageCard from "@/Components/Dashboard/Albums/ImageCard";

import { useState } from "react";

export default function DashAlbums({ album }) {
    const router = useRouter();
    const { data: session } = useSession();
    let [isUploading, setIsUploading] = useState(false);
    let [uploadProgress, setUploadProgress] = useState(0);
    let [uploadCount, setUploadCount] = useState(0);
    let [fileCount, setFileCount] = useState(0);
    const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();
    const { isOpen: isOpenUpload, onOpen: onOpenUpload, onClose: onCloseUpload } = useDisclosure();
    const [lightboxDisplay, setLightboxDisplay] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [downloadImage, setDownloadImage] = useState("");
    const [lightboxLoaded, setLightboxLoaded] = useState(false);
    const [imageString, setImageString] = useState(false);

    function uploadImages(e) {
        let _fileCount = 0;
        let _uploadCount = 0;
        let _uploadProgress = 0;

        e.preventDefault();
        setIsUploading(true);
        const files = e.currentTarget.files.files;

        _fileCount = files.length;
        setFileCount(_fileCount);

        // Task Executor
        const addTask = (() => {
            let pending = Promise.resolve();
        
            const run = async (url, options) => {
                try {
                    await pending;
                } finally {
                    return fetch(url, options).then(handleError).then(async data => {
                        _uploadCount ++;
                        setUploadCount(_uploadCount);
                        
                        _uploadProgress = Math.round((_uploadCount / _fileCount) * 100);
                        setUploadProgress(_uploadProgress);
        
                        i++;
                        if(i == files.length) {
                            toast.success(`${files.length} file(s) have been successfully uploaded. They are now being processed and will be available shortly.`)
                            onCloseUpload();
                            setIsUploading(false);
                            setUploadCount(0);
                            setFileCount(0);
                            setUploadProgress(0);
        
                            setTimeout(() => {
                                return router.push(router.asPath);
                            }, 2000);
                        }
                    }).catch(err => {
                        toast.error(err.message);
                        setIsUploading(false);
                        setUploadCount(0);
                        setFileCount(0);
                        setUploadProgress(0);
                        return onCloseUpload();
                    });
                }
            }

            // update pending promise so that next task could await for it
            return (url, options) => (pending = run(url, options))
        })();

        let i = 0;
        for(let file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("albumId", album._id);

            const uploadOps = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session.accessToken}`
                },
                body: formData
            }

            addTask(`${process.env.API_URL}/images/upload`, uploadOps).then((result) => {
                console.log(result);
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
            toast.error(err.message);
            return onCloseNew();
        });
    }

    const showImage = (image) => {
        setLightboxLoaded(false);
        setImageString(`${image.index + 1} / ${album.images.length}`)

        //set imageToShow to be the one that's been clicked on    
        setLightboxImage(image);
        setDownloadImage(image.original);

        //set lightbox visibility to true
        setLightboxDisplay(true);


    };

    const previousImage = () => {
        let index = lightboxImage.index - 1;
        if(index == -1) index = album.images.length - 1;
        showImage(album.images[index]);
    }

    const nextImage = () => {
        let index = lightboxImage.index + 1;
        if(index == album.images.length) index = 0;
        showImage(album.images[index]);
    }

    const hideLightBox = () => {
        setLightboxDisplay(false);
        setLightboxLoaded(false);
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
                            <ImageCard onclick={() => showImage(image)} image={image} />
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
                                    <Input name="files" accept="image/*" multiple type="file" required />
                                </FormControl>
                                <ModalFooter>
                                    <Button bg={'#ff8563'} color={'white'} mr={3} type="submit">
                                        Upload
                                    </Button>
                                    <Button onClick={onCloseUpload}>Cancel</Button>
                                </ModalFooter>
                            </Stack>
                        </ModalBody>
                    ) : (
                        <ModalBody>
                            <Text pb={5}>Uploading {fileCount} image(s), please do not close this tab.</Text>
                            <Progress value={uploadProgress} colorScheme='orange'></Progress>
                            <Text pt={5}>Uploading image {uploadCount + 1} of {fileCount}</Text>
                            
                            <Flex justifyContent={"center"} alignItems={"center"} p={20}>
                                <Spinner size={"lg"} />
                            </Flex>
                        </ModalBody>
                    )}
                    
                </ModalContent>
            </Modal>

            {/* Image Lightbox */}
            { lightboxDisplay ?
                <Flex id="lightbox" w={"100%"} h={"100%"} direction={"column"} justifyContent={"space-between"} alignItems={"center"}>
                    <LightBoxRow alignment={"end"}>
                        <Button color={"white"} bg={"none"} _hover={{ bg: "none" }} onClick={hideLightBox}>
                            <CloseIcon boxSize={3} />
                        </Button>
                    </LightBoxRow>
                    <Skeleton m={5} isLoaded={lightboxLoaded} overflow={"hidden"} flexGrow={1}>
                        <Image h={"100%"} onLoad={() => setLightboxLoaded(true)} src={lightboxImage.thumbs["2048"].url} objectFit={"contain"} />
                    </Skeleton>
                    <Text mb={4}>{imageString}</Text>
                    <LightBoxRow alignment="center">
                        <Button w={"100%"} color={"white"} bg={"none"} _hover={{ bg: "none" }} onClick={previousImage}>
                            <AiOutlineLeft /> <Text ml={4} display={{ base: "none", md: "inline-block" }}>Previous Image</Text>
                        </Button>
                        <Link as={Button} download href={downloadImage} display={"flex"} justifyContent={"center"} alignItems={"center"} w={"max-content"} whiteSpace={"nowrap"} cursor={"pointer"} color={"white"} bg={"none"} _hover={{ bg: "none" }}>
                            <BsDownload /> <Text ml={4} display={{ base: "none", md: "inline-block" }}>Download Image</Text>
                        </Link>
                        <Button w={"100%"} color={"white"} bg={"none"} _hover={{ bg: "none" }} onClick={nextImage}>
                        <Text mr={4} display={{ base: "none", md: "inline-block" }}>Next Image</Text> <AiOutlineRight />
                        </Button>
                    </LightBoxRow>
                </Flex>
            : '' }
        </Layout>
    );
}

const LightBoxRow = ({ children, alignment }) => {
    return (
        <Stack direction={"row"} w={"100%"} justifyContent={alignment} alignItems={"center"} p={2} bg={useColorModeValue("gray.700", "gray.900")}>
            {children}
        </Stack>
    )
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
        let counter = 0;
        for(let image of images) {
            data.images.push({
                index: counter,
                _id: image._id,
                url: image.thumbs["512"].url,
                original: image.url,
                thumbs: image.thumbs,
                fileSize: image.fileSize,
                uploadedAt: image.uploadedAt,
                uploadedBy: image.uploadedBy || null
            });
            counter++;
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