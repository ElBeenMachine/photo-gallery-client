import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Text, useColorModeValue, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react";
import { toast } from 'react-toastify';
import { useState } from 'react';
  
export default function SimpleCard() {
    const router = useRouter();
    const redirect = router.query.referer ? router.query.referer : "/";
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        if(loading == true) return;

        loadButton();

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
                resetButton();
                console.error(error);
                toast.error(error);
            }
        });
    }

    function resetButton() {
        const loginButton = document.getElementById("loginBtn");
        loginButton.style.borderRadius = "5px";
        loginButton.style.width = "100%";
        setLoading(false);
    }

    function loadButton() {
        const loginButton = document.getElementById("loginBtn");
        setLoading(true);
        loginButton.style.borderRadius = "50%";
        loginButton.style.width = "50px";
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
                        <Flex spacing={10} justify={'center'}>
                            <Button type='submit' id='loginBtn' h={"50px"} borderRadius={"5px"} style={{ transition: "width 0.2s ease-in-out, border-radius 0.3s linear" }} bg={'#ff8563'} color={'white'} _hover={{ bg: '#cc6a4f' }} w={"100%"} >
                                { loading ? (
                                    <Spinner size={"sm"} />
                                ) : (
                                    <Text>Log In</Text>
                                )}
                            </Button>
                        </Flex>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}