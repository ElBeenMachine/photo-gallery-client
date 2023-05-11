import { Box, Heading, Container, Text, Button, Stack, Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const CTAButton = ({ children, href }) => {
    const router = useRouter();
    function redirect() {
        router.push(href);
    }
    return (
        <Button onClick={redirect} color={'white'} bg={"#ff8563"} rounded={"full"} px={6} _hover={{ bg: "#cc6a4f" }}>{children}</Button>
    )
}

const Hero = () => {
    const { data: session } = useSession();
    return (
        <Container  maxW={"3xl"}>
            <Flex minH={"calc(100vh - 180px)"} justifyContent={"center"} alignItems={"center"}>
                <Stack as={Box} textAlign={"center"} spacing={{ base: 8, md: 14 }} py={{ base: 8, md: 14 }}>
                    <Heading fontWeight={600} fontSize={{ base: "2xl", sm: "4xl", md: "6xl"}} lineHeight={"110%"}>
                        Welcome To My <br />
                        <Text as={"span"} color={"#ff8563"}>Photo Gallery</Text>
                    </Heading>
                    <Text color={'gray.500'}>
                        Access photos from our trips, days out, events, everything. { session ? "Simply visit your dashboard" : "Simply log in"}, and you will receive access to all of your photos.
                    </Text>
                    { session ? (
                        <Stack direction={"column"} spacing={3} align={"center"} alignSelf={"center"} position={"relative"}>
                            <CTAButton href={"/dashboard"}>My Dashboard</CTAButton>
                        </Stack>
                    ) : (
                        <Stack direction={"column"} spacing={3} align={"center"} alignSelf={"center"} position={"relative"}>
                            <CTAButton href={"/dashboard"}>Log In</CTAButton>
                        </Stack>
                    )}
                    
                </Stack>
            </Flex>
        </Container>
    )
}

export default Hero;