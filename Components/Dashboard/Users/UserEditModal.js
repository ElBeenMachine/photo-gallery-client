import { Button, FormControl, Input, FormLabel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react';
import { useRef } from 'react';

const UserEditModal = ({ isOpen, onOpen, onClose, user }) => {
    const initialRef = useRef(null);
    const finalRef = useRef(null);

    function editUser(e) {
        e.preventDefault();
        console.log(e);
        console.log(user);
        onClose();
    }
  
    return (
        <>  
            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalCloseButton />
                    <Stack as={"form"} onSubmit={editUser}>
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>First name</FormLabel>
                                <Input id={"firstName"} ref={initialRef} placeholder='First name' />
                            </FormControl>
        
                            <FormControl mt={4}>
                                <FormLabel>Last name</FormLabel>
                                <Input id={"lastName"} placeholder='Last name' />
                            </FormControl>
                        </ModalBody>
        
                        <ModalFooter>
                            <Button type={"submit"} colorScheme='blue' mr={3}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </Stack>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserEditModal;