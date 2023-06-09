import { Box, Flex, Avatar, HStack, IconButton, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, useColorModeValue, Stack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Links from "../Links";
import { useSession } from "next-auth/react";
import UserDropdown from "./UserDropdown";

const NavLink = ({ children, href }) => {
    return (
        <Link px={2} py={1} rounded={"md"} _hover={{ textDecoration: "none", bg: useColorModeValue("gray.200", "gray.700")}} href={href}>
            {children}
        </Link>
    )
}

const Navbar = () => {
    const { data: session } = useSession();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                <IconButton size={"md"} icon={ isOpen ? <CloseIcon /> : <HamburgerIcon />} aria-label={"Open Menu"} display={{md: "none"}} onClick={isOpen ? onClose : onOpen} />
                <HStack spacing={0} alignItems={"center"}>
                    <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
                        {Links.map((link) => (
                            <NavLink href={link.path} key={link.name}>{link.name}</NavLink>
                        ))}
                    </HStack>
                </HStack>
                { session ? (
                    <UserDropdown />
                ) : (
                    <></>
                )}
                
            </Flex>
            { isOpen ? (
                <Box pb={4} display={{ md: "none"}}>
                    <Stack as={"nav"} spacing={4}>
                        {Links.map((link) => (
                            <NavLink href={link.path} key={link.name}>{link.name}</NavLink>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
}

export default Navbar;