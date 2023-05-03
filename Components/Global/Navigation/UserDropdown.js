import { Flex, Avatar, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const ProfileLink = ({ children, href }) => {
    return (
        <MenuItem>
            <Link _hover={{ textDecoration: "none"}} href={href}>
                {children}
            </Link>
        </MenuItem>
    )
}

const UserDropdown = () => {
    const { data: session } = useSession()
    return (
        <Flex alignItems={"center"}>
            <Menu>
                <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                    <Avatar size={"sm"} src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9" />
                </MenuButton>
                <MenuList>
                    <MenuItem>Hi, { session.user.fname }!</MenuItem>
                    <MenuDivider />
                    <ProfileLink href={"/dashboard"}>My Dashboard</ProfileLink>
                    <MenuItem>Link 2</MenuItem>
                    <MenuItem>Link 3</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}

export default UserDropdown;