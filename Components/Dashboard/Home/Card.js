import { Box, Stack, Flex, Heading, Text, useColorModeValue, Icon } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

const HomeCard = ({ heading, description, icon, href }) => {
    return (
        <Box  bg={"white"} w={'100%'} borderWidth="1px" borderRadius="lg" overflow="hidden" p={5}>
            <Stack align={'start'} spacing={2}>
                <Flex w={16} h={16} align={'center'} justify={'center'} color={'white'} rounded={'full'} bg={useColorModeValue('gray.100', 'gray.700')}> 
                <Icon as={icon} w={10} h={10} />
                </Flex>
                <Box mt={2}>
                    <Heading size="lg">{heading}</Heading>
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
}

export default HomeCard;