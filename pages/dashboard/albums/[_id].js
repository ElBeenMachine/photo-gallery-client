import Layout from "@/Components/Dashboard/DashLayout";
import { hasToken } from "@/utils/checkUser";

import { Modal, ModalContent, ModalOverlay, ModalFooter, ModalHeader, ModalBody, ModalCloseButton, Box, WrapItem, Button, Text, useDisclosure, Menu, MenuButton, MenuList, MenuItem, Heading, Stack, Skeleton, Input, FormControl, Flex, Spinner, Progress, Image, MenuDivider } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

import Album from "@/models/Album";
import User from "@/models/User";
import DBImage from "@/models/Image";

import dbConnect from "@/utils/dcConnect";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import AdminBar from "@/Components/Dashboard/AdminBar";
import { HamburgerIcon } from "@chakra-ui/icons";
import { AiOutlineRight, AiOutlineLeft, AiOutlineArrowLeft } from "react-icons/ai"
import { BsDownload } from "react-icons/bs";

import handleError from "@/utils/fetchHandler";

import { toast } from "react-toastify";
import ImageCard from "@/Components/Dashboard/Albums/ImageCard";

import { useEffect, useState } from "react";

import JSZIP from "jszip";

export default function DashAlbums({ album }) {
    const router = useRouter();
    const { data: session } = useSession();
    let [isUploading, setIsUploading] = useState(false);
    let [uploadProgress, setUploadProgress] = useState(0);
    let [uploadCount, setUploadCount] = useState(0);
    let [fileCount, setFileCount] = useState(0);
    const { isOpen: isOpenConfirm, onOpen: onOpenDelete, onClose: onCloseConfirm } = useDisclosure();
    const { isOpen: isOpenUpload, onOpen: onOpenUpload, onClose: onCloseUpload } = useDisclosure();
    const [lightboxDisplay, setLightboxDisplay] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [downloadImage, setDownloadImage] = useState("");
    const [lightboxLoaded, setLightboxLoaded] = useState(false);
    const [imageString, setImageString] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    function updateSelectedCount(selected) {
        if(selected.length == 0) return toast.dismiss("selected-count");

        if(toast.isActive("selected-count")) {
            toast.update("selected-count", {
                render: `${selected.length} image(s) selected`
            });
        } else {
            toast.info(`${selected.length} image(s) selected`, {
                autoClose: false,
                toastId: "selected-count",
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
    }

    function addSelectedImage(image) {
        const filename = image.original.split("/")[image.original.split("/").length - 1];
        const url = image.original;

        const temp = [
            ...selectedImages,
            {
                url,
                filename
            }
        ];

        setSelectedImages(temp);        

        updateSelectedCount(temp);
    }

    function removeSelectedImage(image) {
        const url = image.original;

        const temp = selectedImages.filter(x => { return x.url != url });

        setSelectedImages(temp);

        updateSelectedCount(temp);
    }

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

    function createZip(files) {
        const zip = new JSZIP()

        toast.info(`Zipping ${files.length} image(s)`, { autoClose: false, toastId: "zip-progress", closeButton: false });

        const request = async () => {
            let counter = 1;
            for (const { filename, url } of files) {
                const response = await fetch(url);
                const buffer = await response.arrayBuffer();
                zip.file(filename, buffer);
                if(toast.isActive("zip-progress")) {
                    toast.update("zip-progress", {
                        render: `Zipped ${counter} of ${files.length} image(s)`,
                        progress: counter / files.length
                    });
                } else {
                    toast.info(`Zipped ${counter} of ${files.length} image(s)`, { autoClose: false, toastId: "zip-progress", progress: counter / files.length, closeButton: false });
                }
                counter++;
            }
        }

        request().then(async () => {
            zip.generateAsync({ type: 'blob' }).then((blob) => {
                // Create an object URL for the blob object
                const url = URL.createObjectURL(blob);

                // Create a new anchor element
                const a = document.createElement('a');

                // Set the href and download attributes for the anchor element
                // You can optionally set other attributes like `title`, etc
                // Especially, if the anchor element will be attached to the DOM
                a.href = url;
                a.download = "photo_gallery_download";

                // Click handler that releases the object URL after the element has been clicked
                // This is required for one-off downloads of the blob content
                const clickHandler = () => {
                    setTimeout(() => {
                    URL.revokeObjectURL(url);
                    removeEventListener('click', clickHandler);
                    }, 150);
                };

                // Add the click event listener on the anchor element
                // Comment out this line if you don't want a one-off download of the blob content
                a.addEventListener('click', clickHandler, false);

                // Programmatically trigger a click on the anchor element
                // Useful if you want the download to happen automatically
                // Without attaching the anchor element to the DOM
                // Comment out this line if you don't want an automatic download of the blob content
                a.click();

                // Return the anchor element
                // Useful if you want a reference to the element
                // in order to attach it to the DOM or use it in some other way
                if(toast.isActive("zip-progress")) {
                    toast.update("zip-progress", {
                        render: `${files.length} file(s) downloaded`,
                        type: toast.TYPE.SUCCESS,
                        autoClose: true,
                        closeButton: true
                    });
                } else {
                    toast.success(`${files.length} file(s) downloaded`);
                }
            });
        });
    }

    const downloadSelected = () => {
        createZip(selectedImages);
    }

    const downloadAll = () => {
        let files = [];
        for(let image of album.images) {
            const filename = image.original.split("/")[image.original.split("/").length - 1];
            const url = image.original;

            files.push({
                url,
                filename
            });
        };
        createZip(files);
    }

    return (
        <Layout pageTitle = { `Photo Gallery | ${album.name}` }>
            <AdminBar>
                <Menu>
                    <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                        <HamburgerIcon boxsize={25} />
                    </MenuButton>
                    <MenuList>
                        { session.user.role == "admin" ? (
                            <>
                                <MenuItem onClick={onOpenUpload}>Upload Images</MenuItem>
                                <MenuItem onClick={onOpenDelete}>Delete Album</MenuItem>
                                <MenuDivider />
                            </>
                        ) : (null) }
                        <MenuItem onClick={downloadAll}>Download Entire Album</MenuItem>
                        <MenuItem onClick={downloadSelected}>Download Selected Images</MenuItem>
                    </MenuList>
                </Menu>
            </AdminBar>
            <Stack flexGrow={1} py={10}>
                <Stack direction={"column"} px={10} >
                    <Heading>{album.name}</Heading>
                    <Text>{ album.description }</Text>
                    <Text fontSize={"sm"} opacity={0.8} ><em>Click an image to download it</em></Text>
                </Stack>
                { album.images.length > 0 ? (
                    <Box padding={10} w="100%" sx={{ columnCount: [1, 2, 3, 4], columnGap: "10px" }}>
                        {album.images.map((image) => (
                            <ImageCard addFunction={addSelectedImage} removeFunction={removeSelectedImage} onclick={() => showImage(image)} image={image} />
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
                <Flex zIndex={2} id="lightbox" w={"100%"} h={"100%"} direction={"column"} justifyContent={"space-between"} alignItems={"center"}>
                    <LightBoxRow alignment={"space-between"}>
                        <Button color={"white"} bg={"none"} _hover={{ bg: "none" }} onClick={hideLightBox}>
                            <AiOutlineArrowLeft boxsize={5} />
                        </Button>
                        <Link px={4} as={Button} download href={downloadImage} cursor={"pointer"} color={"white"}>
                            <BsDownload />
                        </Link>
                    </LightBoxRow>

                    <Skeleton m={5} mx={"60px"} isLoaded={lightboxLoaded} overflow={"hidden"} flexGrow={1}>
                        <Image h={"100%"} onLoad={() => setLightboxLoaded(true)} src={lightboxImage.thumbs["2048"].url} objectFit={"contain"} />
                    </Skeleton>

                    <Text mb={4} color={"white"}>{imageString}</Text>

                    <Box pos={"absolute"} top={"50%"} mt={"-15px"} left={"10px"}>
                        <LightBoxNavigation onClick={previousImage}>
                            <AiOutlineLeft color="white" />
                        </LightBoxNavigation>
                    </Box>

                    <Box pos={"absolute"} top={"50%"} mt={"-15px"} right={"10px"}>
                        <LightBoxNavigation onClick={nextImage}>
                            <AiOutlineRight color="white" />
                        </LightBoxNavigation>
                    </Box>
                </Flex>
            : '' }
        </Layout>
    );
}

const LightBoxNavigation = ({ children, onClick }) => {
    return (
        <Button onClick={onClick} h={"40px"} w={"40px"} p={0} borderRadius={"100%"} bg={"rgba(0, 0, 0, 0.5)"} _hover={{ bg: "rgba(255, 255, 255, 0.15)" }}>
            {children}
        </Button>
    )
}

const LightBoxRow = ({ children, alignment }) => {
    return (
        <Stack direction={"row"} w={"100%"} justifyContent={alignment} alignItems={"center"} p={2} bg={"black"}>
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