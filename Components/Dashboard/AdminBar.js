const { Stack, useColorModeValue } = require("@chakra-ui/react");

const AdminBar = ({ children }) => {
    return (
        <Stack zIndex={1} style={{ "box-shadow": "0 5px 4px -2px rgba(0, 0, 0, 0.25)"}} direction={"row"} w={"100%"} sx={{ position: '-webkit-sticky', /* Safari */ position: 'sticky', top: '0', }} justifyContent={"end"} p={5} borderBottomWidth={1} borderStyle={"solid"} borderColor={useColorModeValue("gray.200", "gray.700")} bg={useColorModeValue("gray.50", "gray.900")}>
            {children}
        </Stack>
    )
}

export default AdminBar;