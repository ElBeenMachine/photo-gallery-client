import Layout from "@/Components/Dashboard/DashLayout";
import { isAdmin, hasToken } from "@/utils/checkUser";
import UserCard from "@/Components/Dashboard/Users/UserCard";
import { Menu, MenuButton, MenuList, MenuItem, Wrap, WrapItem, Button, Spinner, Flex, Select, Stack, FormControl, Input, FormLabel, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { PlusSquareIcon, HamburgerIcon } from "@chakra-ui/icons";
import User from "@/models/User";
import dbConnect from "@/utils/dcConnect";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import handleError from "@/utils/fetchHandler";
import { useRouter } from "next/router";
import AdminBar from "@/Components/Dashboard/AdminBar";

export default function DashUsers({ users }) {
    const router = useRouter();
    const { data: session } = useSession();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenNew, onOpen: onOpenNew, onClose: onCloseNew } = useDisclosure();
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingNewUser, setLoadingNewUser] = useState(false);
    const [userData, setUserData] = useState({});

    // Open Edit modal when user is clicked
    async function handleEditButton(e) {
        onOpen();
        setLoadingUser(true);
        
        fetch(`/api/users/${e.target.id}`).then(handleError).then(data => {
            setUserData(data.user);
            setLoadingUser(false);
        }).catch(err => {
            toast.error("Error: " + err.message);
            return onClose();
        });
    }

    // Post request to edit user
    async function editUser(e) {
        e.preventDefault();
        setLoadingUser(true);
        fetch(`/api/users/update/${userData._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        }).then(handleError).then(data => {
            toast.success(data.message);
            router.replace(router.asPath);
            setLoadingUser(false);
            return onClose();
        }).catch(err => {
            toast.error("Error: " + err.message);
            setLoadingUser(false);
            return onClose();
        });
    }

    // Post request to create user
    async function createUser(e) {
        setLoadingNewUser(true);
        e.preventDefault();
        const userData = {
            fname: e.target.fname.value,
            lname: e.target.lname.value,
            email: e.target.email.value,
            username: e.target.username.value,
            role: e.target.role.value
        }

        fetch(`${process.env.API_URL}/users/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(userData)
        }).then(handleError).then(data => {
            toast.success(data.message);
            router.replace(router.asPath);
            setLoadingNewUser(false);
            return onCloseNew();
        }).catch(err => {
            toast.error("Error: " + err.message);
            setLoadingNewUser(false);
            return onCloseNew();
        });
    }

    // Delete request to delete user
    async function deleteUser(e) {
        e.preventDefault();
        setLoadingUser(true);
        fetch(`${process.env.API_URL}/users/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ _id: userData._id })
        }).then(handleError).then(data => {
            toast.success(data.message);
            router.replace(router.asPath);
            setLoadingUser(false);
            return onClose();
        }).catch(err => {
            toast.error("Error: " + err.message);
            setLoadingUser(false);
            return onClose();
        });
    }

    // On Input Change (Edits)
    function inputChangedHandler (e) {
        const updatedKeyword = e.currentTarget.value;
        const field = e.target.dataset.field;
        userData[field] = updatedKeyword;
    }

    return (
        <Layout pageTitle = "Photo Gallery | Manage Users">
            <AdminBar>
                <Menu>
                    <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                        <Button onClick={onOpenNew}>
                            <HamburgerIcon boxSize={25} />
                        </Button>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={onOpenNew}>Create a new user</MenuItem>
                    </MenuList>
                </Menu>
            </AdminBar>

            <Wrap p={6} align={"center"} justify={"center"} spacing='30px' flexGrow={1}>
                { users.length > 1 ? (
                    users.map(user => (
                        ( user._id != session.user._id ? (
                            <WrapItem w={"100%"} maxW={{ base: "90%", md: "350px" }} key={user._id}>
                                <UserCard handleFunction={handleEditButton} name={user.fname + " " + user.lname} role={user.role} avatar={user.avatar} _id={user._id}/>
                            </WrapItem>
                        ) : (null)) 
                    ))
                ) : (
                    <WrapItem as={"div"} minH={300} justifyContent={"center"} alignItems={"center"}>
                        <Text>No Users Exist</Text>
                    </WrapItem>
                )}
            </Wrap>

            {/* New User Modal */}
            <Modal isOpen={isOpenNew} onClose={onCloseNew}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create User</ModalHeader>
                    <ModalCloseButton />

                    { loadingNewUser ? (
                        <Flex justifyContent={"center"} alignItems={"center"} w={"100%"} minH={150}>
                            <Spinner size='xl' />
                        </Flex>
                    ) : (
                        <Stack as={"form"} onSubmit={createUser}>
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>First name</FormLabel>
                                    <Input name="fname" placeholder='First name' required />
                                </FormControl>
            
                                <FormControl mt={4}>
                                    <FormLabel>Last name</FormLabel>
                                    <Input name="lname" placeholder='Last name' required />
                                </FormControl>
            
                                <FormControl mt={4}>
                                    <FormLabel>Email</FormLabel>
                                    <Input name="email" type="email" placeholder='Email' required />
                                </FormControl>
                                
                                <FormControl mt={4}>
                                    <FormLabel>Username</FormLabel>
                                    <Input name="username" placeholder='Username' required />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Role</FormLabel>
                                    <Select name="role" required>
                                        <option value='user'>User</option>
                                        <option value='admin'>Admin</option>
                                    </Select>
                                </FormControl>
                            </ModalBody>
            
                            <ModalFooter>
                                <Button type={"submit"} colorScheme='green' mr={3}>
                                    Create User
                                </Button>
                                <Button onClick={onCloseNew}>Cancel</Button>
                            </ModalFooter>
                        </Stack>
                    )}
                </ModalContent>
            </Modal>

            {/* Edit User Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalCloseButton />
                    
                    { loadingUser ? (
                        <Flex justifyContent={"center"} alignItems={"center"} w={"100%"} minH={150}>
                            <Spinner size='xl' />
                        </Flex>
                    ) : (
                        <Stack as={"form"} onSubmit={editUser}>
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>First name</FormLabel>
                                    <Input id={"firstName"} onChange={inputChangedHandler} data-field={"fname"} placeholder='First name' defaultValue={userData.fname || ""} required />
                                </FormControl>
            
                                <FormControl mt={4}>
                                    <FormLabel>Last name</FormLabel>
                                    <Input id={"lastName"} onChange={inputChangedHandler} data-field={"lname"} placeholder='Last name' defaultValue={userData.lname || ""} required />
                                </FormControl>
            
                                <FormControl mt={4}>
                                    <FormLabel>Email</FormLabel>
                                    <Input id={"email"} type="email" onChange={inputChangedHandler} data-field={"email"} placeholder='Email' defaultValue={userData.email || ""} required />
                                </FormControl>
                                
                                <FormControl mt={4}>
                                    <FormLabel>Username</FormLabel>
                                    <Input id={"username"} onChange={inputChangedHandler} data-field={"username"} placeholder='Username' defaultValue={userData.username || ""} required />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Role</FormLabel>
                                    <Select onChange={inputChangedHandler} data-field={"role"} defaultValue={userData.role} required>
                                        <option value='user'>User</option>
                                        <option value='admin'>Admin</option>
                                    </Select>
                                </FormControl>
                            </ModalBody>
            
                            <ModalFooter>
                                <Button type={"submit"} colorScheme='blue' mr={3}>
                                    Save
                                </Button>
                                <Button onClick={deleteUser} colorScheme='red' mr={3}>
                                    Delete User
                                </Button>
                                <Button onClick={onClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Stack>
                    )}
                </ModalContent>
            </Modal>
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
    const users = await User.find();
    const data = users.map(user => {
        return { _id: user._id, fname: user.fname, lname: user.lname, role: user.role, avatar: user.avatar }
    });

    return { props: { users: JSON.parse(JSON.stringify(data)) } }
}