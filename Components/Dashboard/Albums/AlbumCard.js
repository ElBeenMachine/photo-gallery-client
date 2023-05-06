import Image from 'next/image';
import { Box, Center, Heading, Text, Stack, Avatar, useColorModeValue } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import moment from 'moment/moment';

export default function AlbumCard({ album }) {
    function openAlbum(e) {
        toast.warn(`This feature is not currently available. However, the album ID is ${e.currentTarget.id}`);
    }

    return (
        <Center py={6}>
            <Box onClick={openAlbum} id={album._id} maxW={'445px'} w={'full'} bg={useColorModeValue('white', 'gray.900')} boxShadow={'2xl'} rounded={'md'} p={6} overflow={'hidden'} transitionDuration={"0.3s"} transitionTimingFunction={"ease-in-out"} _hover={{ transform: 'scale(1.05)', filter: "brightness(98%)" }} cursor={'pointer'}>
                <Box h={'210px'} bg={'gray.100'} mt={-6} mx={-6} mb={6} pos={'relative'}>
                    <Image src={ 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' } fill />
                </Box>
                <Stack>
                    <Text color={'green.500'} minW={"300px"} textTransform={'uppercase'} fontWeight={800} fontSize={'sm'} letterSpacing={1.1}>
                        Album
                    </Text>
                    <Heading color={useColorModeValue('gray.700', 'white')} fontSize={'2xl'} fontFamily={'body'}>
                        { album.name }
                    </Heading>
                    <Text color={'gray.500'}>
                        { album.description }
                    </Text>
                </Stack>
                <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
                    <Avatar src={ album.author.avatar} alt={'Author'} />
                    <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                        <Text fontWeight={600}>{ album.author.fname + " " + album.author.lname}</Text>
                        <Text color={'gray.500'}> {moment(album.createdAt).format("LL")}</Text>
                    </Stack>
                </Stack>
            </Box>
        </Center>
    );
}