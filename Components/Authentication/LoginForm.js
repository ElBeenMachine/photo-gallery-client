import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Button, Heading, Text, useColorModeValue, } from '@chakra-ui/react';
import { Link } from "@chakra-ui/next-js";
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react";
import { toast } from 'react-toastify';
  
export default function SimpleCard() {
    const router = useRouter();
    const redirect = router.query.referer ? router.query.referer : "/";

    async function handleLogin(e) {
        e.preventDefault();

        const creds = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        await signIn("credentials", {
            redirect: false,
            email: creds.email,
            password: creds.password
        }).then(({ok, error}) => {
            if(ok) {
                toast.success("Login Successful");
                router.push(redirect);
            } else {
                console.error(error);
                toast.error(error);
            }
        });
    }

    return (
        <Flex minH={"calc(100vh - 180px)"} m={0} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>to see all of our <Text as={"span"} color={'#ff8563'}>pictures</Text> ✌️</Text>
                </Stack>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <Stack as={"form"} onSubmit={handleLogin} spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" required />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" required />
                        </FormControl>
                        <Stack spacing={10}>
                            <Button type='submit' bg={'#ff8563'} color={'white'} _hover={{ bg: '#cc6a4f' }}>
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}