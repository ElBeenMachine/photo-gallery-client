import { Heading, Avatar, Box, Image, Flex, Text, Stack, Button, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const UserCard = ({ name, cover, _id }) => {
    const router = useRouter();

    function redirectAlbum(e) {
        router.push(`/dashboard/albums/${_id}`);
    }

    return (
        <Box onClick={redirectAlbum} minW={'250px'} maxW={'300px'} w={'full'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'2xl'} rounded={'md'} overflow={'hidden'} m={3}>
            <Image h={'120px'} w={'full'} src={ cover || "https://placehold.co/300x120?text=No+Cover" } objectFit={'cover'} />

            <Box p={6}>
                <Stack spacing={0} align={'center'}>
                    <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                        { name }
                    </Heading>
                </Stack>
            </Box>
        </Box>
    );
}

export default UserCard;