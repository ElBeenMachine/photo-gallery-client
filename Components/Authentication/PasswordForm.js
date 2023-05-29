import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Text, useColorModeValue, } from '@chakra-ui/react';
import { Link } from "@chakra-ui/next-js";
import { useRouter } from 'next/router';
import handleError from "@/utils/fetchHandler";
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
  
export default function SimpleCard() {
    const router = useRouter();
    const { data: session } = useSession();

    async function changePassword(e) {
        e.preventDefault();
        const passwords = {
            current: e.target.current.value,
            new: e.target.new.value,
            confirm: e.target.confirm.value
        }

        let match = false;

        await fetch(`${process.env.API_URL}/@me/password/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ password: passwords.current })
        }).then(handleError).then(data => {
            match = false;
            if(!data.valid) return toast.error("Current password does not match");
            match = true;
        }).catch(err => {
            toast.error(err.message);
        });

        console.log(match);
        if(!match) return;

        if(passwords.new != passwords.confirm) return toast.error("New passwords do not match");
        await fetch(`${process.env.API_URL}/@me/password/change`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ passwords })
        }).then(handleError).then(data => {
            toast.success("Password changed");
            setTimeout(() => {
                router.replace("/auth/password/success");
            }, 1000);
        }).catch(err => {
            toast.error(err.message);
        });
    }

    return (
        <Flex minH={"calc(100vh - 180px)"} m={0} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Change Your Password</Heading>
                </Stack>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <Stack as={"form"} onSubmit={changePassword} spacing={4}>
                        <FormControl id="current">
                            <FormLabel>Current Password</FormLabel>
                            <Input type="password" required/>
                        </FormControl>
                        <Box opacity={0.8}>
                            <Text as={"h2"} mb={2}>Password Requirements</Text>
                            <ul style={{ listStylePosition: 'inside', fontSize: "12px" }}>
                                <li>At least 8 characters long</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One symbol</li>
                            </ul>
                        </Box>
                        <FormControl id="new">
                            <FormLabel>New Password</FormLabel>
                            <Input type="password" required/>
                        </FormControl>
                        <FormControl id="confirm">
                            <FormLabel>New Password</FormLabel>
                            <Input type="password" required/>
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