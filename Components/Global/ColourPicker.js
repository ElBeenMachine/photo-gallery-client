import { Popover,  PopoverTrigger,  Button,  PopoverContent,  PopoverArrow,  PopoverCloseButton,  PopoverHeader,  PopoverBody,  Center, SimpleGrid } from "@chakra-ui/react";

const ColourPicker = ({ color, colors, setColor }) => {
    return (
        <Center marginTop={5}>
            <Popover variant="picker">
                <PopoverTrigger>
                    <Button aria-label={color.name} background={color.value} height="30px" width="30px" padding={0} minWidth="unset" borderRadius={3}></Button>
                </PopoverTrigger>
                <PopoverContent width="170px">
                    <PopoverArrow bg={color.value} />
                    <PopoverCloseButton color="white" />
                    <PopoverHeader height="100px" backgroundColor={color.value} borderTopLeftRadius={5} borderTopRightRadius={5} color="white">
                        <Center height="100%">{color.name}</Center>
                    </PopoverHeader>
                    <PopoverBody height="max-content">
                        <SimpleGrid columns={5} spacing={2}>
                            {colors.map((c) => (
                                <Button key={c.value} aria-label={c.name} background={c.value} height="22px" width="22px" padding={0} minWidth="unset" borderRadius={3} _hover={{ background: c.value }} onClick={() => { setColor(c); }}></Button>
                            ))}
                        </SimpleGrid>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Center>
    );
}

export default ColourPicker;