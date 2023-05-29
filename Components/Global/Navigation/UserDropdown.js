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
    const { data: session } = useSession();
    return (
        <Flex alignItems={"center"}>
            <Menu>
                <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                    <Avatar size={"sm"} src={ session.user.avatar } />
                </MenuButton>
                <MenuList>
                    <MenuItem>Hi, { session.user.fname }!</MenuItem>
                    <MenuDivider />
                    <ProfileLink href={"/dashboard"}>My Dashboard</ProfileLink>
                    <ProfileLink href={"/auth/password/change"}>Change Password</ProfileLink>
                    <MenuDivider />
                    <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}

export default UserDropdown;