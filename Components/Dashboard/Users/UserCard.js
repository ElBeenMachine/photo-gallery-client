import { Heading, Avatar, Box, Image, Flex, Text, Stack, Button, useColorModeValue } from '@chakra-ui/react';
  
const UserCard = ({ name, role, avatar, id}) => {
    return (
        <Box minW={'250px'} maxW={'300px'} w={'full'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'2xl'} rounded={'md'} overflow={'hidden'} m={3}>
            <Image h={'120px'} w={'full'} src={'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'} objectFit={'cover'} />
            <Flex justify={'center'} mt={-12}>
                <Avatar size={'xl'} src={ avatar } alt={'Author'} css={{border: '2px solid white',}} />
            </Flex>

            <Box p={6}>
                <Stack spacing={0} align={'center'} mb={5}>
                    <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                        { name }
                    </Heading>
                    <Text color={'gray.500'}>{ role.charAt(0).toUpperCase() + role.slice(1) }</Text>
                </Stack>

                {/* <Stack direction={'row'} justify={'center'} spacing={6}>
                    <Stack spacing={0} align={'center'}>
                        <Text fontWeight={600}>23k</Text>
                        <Text fontSize={'sm'} color={'gray.500'}>
                            Followers
                        </Text>
                    </Stack>
                    <Stack spacing={0} align={'center'}>
                        <Text fontWeight={600}>23k</Text>
                        <Text fontSize={'sm'} color={'gray.500'}>
                            Followers
                        </Text>
                    </Stack>
                </Stack> */}

                <Button w={'full'} mt={8} bg={useColorModeValue('#151f21', 'gray.900')} color={'white'} rounded={'md'} _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}>
                    Edit User
                </Button>
            </Box>
        </Box>
    );
}

export default UserCard;