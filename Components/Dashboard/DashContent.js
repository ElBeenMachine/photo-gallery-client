import { IconButton, Box, CloseButton, Flex, HStack, Icon, useColorModeValue, Drawer, DrawerContent, Text, useDisclosure } from '@chakra-ui/react';
import { Link } from "@chakra-ui/next-js";
import { FiMenu } from 'react-icons/fi';
import UserDropdown from '../Global/Navigation/UserDropdown';
import Links from "./DashLinks";
import { useSession } from 'next-auth/react';

const DashContent = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer autoFocus={false} isOpen={isOpen} placement="left" onClose={onClose} returnFocusOnClose={false} onOverlayClick={onClose} size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
      
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }}>
                {/* Dashboard Content */}
                {children}
            </Box>
        </Box>
    );
}

const SidebarContent = ({ onClose, ...rest }) => {
    const { data: session } = useSession();
    return (
        <Box transition="3s ease" bg={useColorModeValue('white', 'gray.900')} borderRight="1px" borderRightColor={useColorModeValue('gray.200', 'gray.700')} w={{ base: 'full', md: 60 }} pos="fixed" h="full" {...rest}> 
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Dashboard
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {Links.map((link) => (
                (link.roles.includes(session.user.role) ? (
                    <NavItem key={link.name} href={link.path} icon={link.icon}>
                        {link.name}
                    </NavItem>
                ) : (
                    null
                ))
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children, href, ...rest }) => {
    return (
        <Link href={ href || "#"} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex align="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: 'green.400', color: 'white' }} {...rest}>
                {icon && (
                    <Icon mr="4" fontSize="16" _groupHover={{ color: 'white' }} as={icon} />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({ onOpen, ...rest }) => {
    return (
        <Flex ml={{ base: 0, md: 60 }} px={{ base: 4, md: 4 }} height="20" alignItems="center" bg={useColorModeValue('white', 'gray.900')} borderBottomWidth="1px" borderBottomColor={useColorModeValue('gray.200', 'gray.700')} justifyContent={{ base: 'space-between', md: 'flex-end' }} {...rest}>
            <IconButton display={{ base: 'flex', md: 'none' }} onClick={onOpen} variant="outline" aria-label="open menu" icon={<FiMenu />} />

            <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                Dashboard
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <UserDropdown />
            </HStack>
        </Flex>
    );
};

export default DashContent;