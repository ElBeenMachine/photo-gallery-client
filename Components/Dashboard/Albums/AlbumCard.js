import { Box, Image, Heading, Text, Stack, Avatar, useColorModeValue, Skeleton } from '@chakra-ui/react';
import moment from 'moment/moment';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function AlbumCard({ album }) {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    function openAlbum(e) {
        router.push(`/dashboard/albums/${e.currentTarget.id}`);
    }

    function finishLoading() {
        setIsLoaded(true);
    }

    return (
        <Box onClick={openAlbum} id={album._id} w='100%' bg={useColorModeValue('white', 'gray.900')} boxShadow={'2xl'} rounded={'md'} p={6} overflow={'hidden'} transitionDuration={"0.3s"} transitionTimingFunction={"ease-in-out"} _hover={{ transform: 'scale(1.05)', filter: "brightness(98%)" }} cursor={'pointer'}>
            <Box h={'210px'} bg={'gray.100'} mt={-6} mx={-6} mb={6} pos={'relative'}>
                <Skeleton isLoaded={isLoaded} >
                    <Image onLoad={finishLoading} loading='lazy' h={210} w={"100%"}  style={{ objectFit: "cover", objectPosition: "center" }} src={ album.cover } fill />
                </Skeleton>
            </Box>
            <Stack>
                <Text color={'#ff8563'} minW={"300px"} textTransform={'uppercase'} fontWeight={800} fontSize={'sm'} letterSpacing={1.1}>
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
    );
}