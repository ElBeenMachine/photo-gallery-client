import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Button, Heading, Text, useColorModeValue, } from '@chakra-ui/react';
import { Link } from "@chakra-ui/next-js";
  
export default function SimpleCard() {
    function handleLogin() {
        console.log()
    }

    return (
        <Flex m={0} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>to see all of our <Text as={"span"} color={'green.400'}>pictures</Text> ✌️</Text>
                </Stack>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                                <Link href={"#"} color={'green.400'}>Forgot password?</Link>
                            </Stack>
                            <Button bg={'green.400'} color={'white'} _hover={{ bg: 'green.500' }}>
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}