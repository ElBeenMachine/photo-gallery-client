import Layout from "@/Components/Dashboard/DashLayout";
import { isAdmin, hasToken } from "@/utils/checkUser";
import UserCard from "@/Components/Dashboard/Users/UserCard";
import { Menu, MenuButton, MenuList, MenuItem, Wrap, WrapItem, Button, Spinner, Flex, Select, Stack, FormControl, Input, FormLabel, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import dbConnect from "@/utils/dcConnect";
import AdminBar from "@/Components/Dashboard/AdminBar";
import Group from "@/models/Group";

export default function DashGroups({ groups }) {
    return (
        <Layout pageTitle = "Photo Gallery | Manage Groups">
            <AdminBar>
                <Menu>
                    <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                        <HamburgerIcon boxSize={25} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => {}}>Create a new group</MenuItem>
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