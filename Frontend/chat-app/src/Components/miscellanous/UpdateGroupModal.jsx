import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  useDisclosure,
  useToast,
  Spinner,
  IconButton,
  Button,
  Box,
  Input,
  FormControl,
  Flex, // Used for cleaner layout
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons"; // 1. ✅ FIX: Missing icon import

import UserListItem from "./UserListItem";
import { chatState } from "../../context/chatProvider";
import UserCard from "./UserCard";
import axios from "axios";

const UpdateGroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [renameGroup, setRenameGroup] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const {
    user,
    selectedChat,
    setSelectedChat,
    setChatStateList,
    chatStateList,
  } = chatState();

  if (!selectedChat) return null;

  const getConfig = () => ({
    headers: {
      authorization: `Bearer ${user?.token}`,
      "Content-Type": "application/json",
    },
  });

  const handleRemove = async (userToRemove) => {
    // Check if the current user is the admin AND not removing themselves
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Permission Denied",
        description: "Only group admin can remove users.",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        "/api/chat/dropuser", // ✅ FIX: Use leading slash for API path
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        getConfig()
      );

      // Update the selected chat state immediately
      setSelectedChat(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Failed to Remove User",
        description: err.response?.data?.message || "Server error.",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  const handleRenameGroup = async () => {
    if (!renameGroup || renameGroup === selectedChat.chatName) {
      toast({
        title: "Invalid Name",
        description: "Provide a new name.",
        status: "warning",
      });
      return;
    }

    setRenameLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/chat/renamegroupchat",
        {
          chatId: selectedChat._id,
          chatName: renameGroup,
        },
        getConfig()
      );
      console.log(response);

      setSelectedChat(response?.data);
      setChatStateList([
        (prev) =>
          prev.filter((chat) => {
            return chat._id != response.data._id;
          }),
        response.data,
      ]);
      console.log(chatStateList);

      setRenameGroup("");
      setRenameLoading(false);
    } catch (err) {
      console.log(err);

      setRenameLoading(false);
      toast({
        title: "Failed to Rename",
        description: err.response?.data?.message || "Server error.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User Exist",
        description: "User already in group",
        status: "warning",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Permission Denied",
        description: "Only group admin can add users",
        status: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        "/api/chat/addusers", // ✅ FIX: Use leading slash for API path
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        getConfig()
      );

      setSelectedChat(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Failed to Add User",
        description: err.response?.data?.message || "Server error.",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    if (!query) return setSearchResults([]);

    setLoading(true);
    try {
      // 🛑 CRITICAL BUG FIX: Corrected malformed URL and used template literal
      const { data } = await axios.get(
        `/api/user?search=${query}`,
        getConfig()
      );
      setSearchResults(data);
    } catch (err) {
      toast({
        title: "Search Failed",
        description: "Could not fetch users.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    try {
      // Use the dropuser endpoint, passing the current user's ID
      const { data } = await axios.put(
        "/api/chat/dropuser",
        {
          chatId: selectedChat._id,
          userId: user._id, // User removing THEMSELF
        },
        getConfig()
      );

      toast({
        title: `Left ${selectedChat.chatName}`,
        status: "success",
        duration: 3000,
      });
      setSelectedChat(null); // Clear selected chat after leaving
      onClose();
    } catch (err) {
      setLoading(false);
      toast({
        title: "Failed to Leave",
        description: err.response?.data?.message || "Server error.",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  return (
    <>
      {children ? (
        <Box onClick={onOpen}>{children}</Box>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          bg="#00a884"
          color="white"
          size="sm"
          _hover={{ bg: "#029e78" }}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="#202c33" // 🎨 THEME: Dark background
          color="#e9edef"
          border="1px solid #2f3b42"
        >
          <ModalHeader
            borderBottom="1px solid #2f3b42"
            textAlign="center"
            fontSize="2xl"
          >
            {selectedChat.chatName.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {/* Current Users */}
            <Flex
              flexWrap="wrap"
              gap={2}
              p={2}
              mb={4}
              bg="#2a3942"
              borderRadius="md"
            >
              {selectedChat.users.map((u) => (
                // ✅ CRITICAL FIX: Add explicit return inside map
                <UserListItem
                  key={u._id}
                  user={u}
                  // Only show remove button if current user is admin AND the user is not the admin
                  handleFunction={
                    selectedChat.groupAdmin._id === user._id &&
                    u._id !== selectedChat.groupAdmin._id
                      ? () => handleRemove(u)
                      : null
                  }
                  bg={
                    u._id === selectedChat.groupAdmin._id
                      ? "#00a884"
                      : "#005c4b"
                  }
                  isSelf={u._id === user._id}
                />
              ))}
            </Flex>

            {/* Rename Input */}
            <FormControl display="flex" mb={4}>
              <Input
                type="text"
                placeholder="New Group Name"
                value={renameGroup}
                onChange={(e) => setRenameGroup(e.target.value)}
                bg="#2a3942"
                color="#e9edef"
                border="none"
                mr={2}
              />
              <Button
                onClick={handleRenameGroup}
                colorScheme="blue" // ✅ FIX: Correct prop name
                bg="#00a884"
                color="white"
                isLoading={renameLoading}
                _hover={{ bg: "#029e78" }}
              >
                Update
              </Button>
            </FormControl>

            {/* Add User Search */}
            <FormControl>
              <Input
                type="text"
                placeholder="Add User to Group (e.g., John)"
                onChange={handleSearch} // ✅ FIX: Pass the event to handler
                bg="#2a3942"
                color="#e9edef"
                border="none"
                mb={2}
              />
            </FormControl>

            {/* Search Results */}
            <Box maxH="150px" overflowY="auto">
              {loading ? (
                <Spinner size="sm" color="#00a884" />
              ) : (
                searchResults?.slice(0, 4).map((u) => (
                  // ✅ CRITICAL FIX: Add explicit return inside map
                  <UserCard
                    key={u._id}
                    username={u.name}
                    useremail={u.email}
                    profilePic={u.pic}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter borderTop="1px solid #2f3b42" justifyContent="flex-end">
            <Button
              onClick={handleLeave}
              bg="red.600" // 🎨 THEME: Use Chakra red for danger
              color="white"
              isLoading={loading}
              _hover={{ bg: "red.700" }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
