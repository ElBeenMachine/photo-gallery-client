const { Stack } = require("@chakra-ui/react");

const AdminBar = ({ children }) => {
    return (
        <Stack direction={"row"} w={"100%"} justifyContent={"end"} p={5}>
            {children}
        </Stack>
    )
}

export default AdminBar;