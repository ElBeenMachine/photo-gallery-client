import { Flex, Box, Stack, Heading, useColorModeValue, Text, Button } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
  
export default function PasswordSuccess() {

    function redirect() {
        window.location="/dashboard";
    }
    return (
        <Flex minH={"calc(100vh - 180px)"} m={0} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} textAlign="center" py={10} px={6}>
                    <CheckCircleIcon boxSize={'50px'} color={'#ff8563'} />
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        Password Changed
                    </Heading>
                    <Text color={'gray.500'}>
                        Your password has now been changed. Click the button below to be returned to your dashboard.
                    </Text>
                    <Button onClick={redirect} color={'white'} bg={"#ff8563"} rounded={"full"} px={6} _hover={{ bg: "#cc6a4f" }} mt={6}>My Dashboard</Button>
                </Box>
            </Stack>
        </Flex>
    );
}