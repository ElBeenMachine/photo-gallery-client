const { Stack, useColorModeValue } = require("@chakra-ui/react");

const AdminBar = ({ children }) => {
    return (
        <Stack direction={"row"} w={"100%"} justifyContent={"end"} p={5} borderBottomWidth={1} borderStyle={"solid"} borderColor={useColorModeValue("gray.200", "gray.700")} bg={useColorModeValue("gray.50", "gray.900")}>
            {children}
        </Stack>
    )
}

export default AdminBar;