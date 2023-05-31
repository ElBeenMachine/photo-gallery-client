import Layout from "@/Components/Dashboard/DashLayout";
import { isAdmin, hasToken } from "@/utils/checkUser";
import UserCard from "@/Components/Dashboard/Users/UserCard";
import { Menu, MenuButton, MenuList, MenuItem, Wrap, WrapItem, Button, Spinner, Flex, Select, Stack, FormControl, Input, FormLabel, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, HStack } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import dbConnect from "@/utils/dcConnect";
import AdminBar from "@/Components/Dashboard/AdminBar";
import Group from "@/models/Group";
import { useState } from "react";
import ColourPicker from "@/Components/Global/ColourPicker";

export default function DashGroups({ groups }) {
    const { isOpen: isOpenNew, onOpen: onOpenNew, onClose: onCloseNew } = useDisclosure();
    const [loadingNewGroup, setLoadingNewGroup] = useState(false);

    const [color, setColor] = useState({ name: "Grey", value: "gray.500"});

    const colors = [
        { name: "Light Grey", value: "gray.500" },
        { name: "Red", value: "red.500" },
        { name: "Dark Grey", value: "gray.700" },
        { name: "Green", value: "green.500" },
        { name: "Light Blue", value: "blue.500" },
        { name: "Dark Blue", value: "blue.800" },
        { name: "Yellow", value: "yellow.500" },
        { name: "Orange", value: "orange.500" },
        { name: "Purple", value: "purple.500" },
        { name: "Pink", value: "pink.500" }
    ];

    async function createGroup(e) {
        e.preventDefault();
        const body = {
            name: e.target.name.value,
            colour: color.value
        }
        onCloseNew();
        alert(`Group of name '${body.name} to be made with the colour ${body.colour}`);
    }

    return (
        <Layout pageTitle = "Photo Gallery | Manage Groups">
            <AdminBar>
                <Menu>
                    <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                        <HamburgerIcon boxSize={25} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={onOpenNew}>Create a new group</MenuItem>
                    </MenuList>
                </Menu>
            </AdminBar>

            <Wrap p={6} align={"center"} justify={"center"} spacing='30px' flexGrow={1}>
                { groups.length > 1 ? (
                    groups.map(group => (
                        <WrapItem w={"100%"} maxW={{ base: "90%", md: "350px" }} key={group._id}>
                            <UserCard handleFunction={handleEditButton} name={group.fname + " " + group.lname} role={group.role} avatar={group.avatar} _id={group._id}/>
                        </WrapItem>
                    ))
                ) : (
                    <WrapItem as={"div"} minH={300} justifyContent={"center"} alignItems={"center"}>
                        <Text>No Groups Exist</Text>
                    </WrapItem>
                )}
            </Wrap>
            
            {/* New User Modal */}
            <Modal isOpen={isOpenNew} onClose={onCloseNew}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Group</ModalHeader>
                    <ModalCloseButton />

                    { loadingNewGroup ? (
                        <Flex justifyContent={"center"} alignItems={"center"} w={"100%"} minH={150}>
                            <Spinner size='xl' />
                        </Flex>
                    ) : (
                        <Stack as={"form"} onSubmit={createGroup}>
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>Group Name</FormLabel>
                                    <Input name="name" placeholder='Group Name' required />
                                </FormControl>

                                <FormControl mt={4}>
                                    <HStack alignItems={"center"}>
                                        <FormLabel m={0} mr={4}>Group Colour</FormLabel>
                                        <ColourPicker color={color} colors={colors} setColor={setColor} />
                                    </HStack>
                                </FormControl>
                            </ModalBody>
            
                            <ModalFooter>
                                <Button type={"submit"} color={'white'} bg={'#ff8563'} _hover={{ bg: "#cc6a4f" }} mr={3}>
                                    Create Group
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
DashGroups.auth = true;

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
    const groups = await Group.find();
    const data = groups.map(group => {
        return { _id: group._id, name: group.name, colour: group.colour }
    });

    return { props: { groups: JSON.parse(JSON.stringify(data)) } }
}