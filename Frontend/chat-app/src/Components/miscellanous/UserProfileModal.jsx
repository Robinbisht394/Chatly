import React from "react";
import {
  Box,
  Image,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
} from "@chakra-ui/react";

const UserProfileModal = ({ userProfileModal, user }) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={userProfileModal.isOpen}
      onClose={userProfileModal.onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        bg="#202c33"
        color="#e9edef"
        textAlign="center"
        border="1px solid #2f3b42"
        boxShadow="lg"
      >
        <ModalHeader
          borderBottom="1px solid #2f3b42"
          color="#00a884"
          fontWeight="bold"
        >
          User Profile
        </ModalHeader>
        <ModalCloseButton color="#e9edef" />
        <ModalBody py="6">
          <Box textAlign="center">
            <Image
              src={user.pic}
              alt={user.name}
              borderRadius="full"
              mx="auto"
              boxSize="120px"
              border="3px solid #00a884"
              mb="4"
              objectFit="cover"
            />
            <Text fontWeight="bold" fontSize="lg" mb="1" color="#e9edef">
              {user.name}
            </Text>
            <Text color="gray.400">{user.email}</Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserProfileModal;
