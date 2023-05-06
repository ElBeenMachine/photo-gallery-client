import Layout from "@/Components/Dashboard/DashLayout";
import { Flex, Button, Text, Heading, Stack, Box, Wrap, WrapItem, Icon, useColorModeValue } from "@chakra-ui/react";
import { hasToken } from "@/utils/checkUser";
import {
    FcAbout,
    FcAssistant,
    FcCollaboration,
    FcDonate,
    FcManager,
  } from 'react-icons/fc';
import { Link } from "@chakra-ui/next-js";

const Card = ({ heading, description, icon, href }) => {
    return (
        <Box  bg={"white"} w={'100%'} borderWidth="1px" borderRadius="lg" overflow="hidden" p={5}>
            <Stack align={'start'} spacing={2}>
                <Flex w={16} h={16} align={'center'} justify={'center'} color={'white'} rounded={'full'} bg={useColorModeValue('gray.100', 'gray.700')}> 
                    {icon}
                </Flex>
                <Box mt={2}>
                    <Heading size="md">{heading}</Heading>
                    <Text mt={1} fontSize={'sm'}>
                        {description}
                    </Text>
                </Box>
                <Link href={href} fontWeight={"bold"} color={"blue.600"} size={'sm'}>
                    Learn more
                </Link>
            </Stack>
        </Box>
    );
};

export default function DashHome() {
    return (
        <Layout pageTitle = "Photo Gallery | My Dashboard">
            <Wrap p={6} align={"center"} justify={"center"} spacing='30px'w={"100%"}>
                <WrapItem maxW={{ base: '100%', md: '50%' }}>
                    <Card heading={'Heading'} icon={<Icon as={FcAssistant} w={10} h={10} />} description={ 'Lorem ipsum dolor sit amet catetur, adipisicing elit.' } href={'#'} />
                </WrapItem>
            </Wrap>
        </Layout>
    )
}

// Require authentication
DashHome.auth = true;

export async function getServerSideProps(context) {
    const token = await hasToken(context.req);
    if(!token) {
        return {
            redirect: {
                destination: context.resolvedUrl ? `/auth/login?referer=${context.req.headers["x-forwarded-proto"] + '://' + context.req.headers.host + context.resolvedUrl}` : "/auth/login",
                permanent: false
            }
        }
    }

    return { props: {} }
}