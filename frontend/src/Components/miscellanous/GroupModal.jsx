import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Box,
  FormControl,
  VStack,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserCard from "./UserCard";

import { chatState } from "../../context/chatProvider";

function GroupModal(props) {
  const { groupModalDisclosure } = props;
  const [groupchatName, setGroupchatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chatStateList, setChatStateList } = chatState();
  const toast = useToast();

  // handle Submit
  const handleSubmit = async () => {
    // group must have two users + current user
    if (!groupchatName || selectedUsers.length < 2) {
      toast({
        title: "Missing Info",
        description:
          "Please provide a group name and select at least two users.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (!user || !user.token) {
      toast({
        title: "Auth Error",
        description: "User token is missing.",
        status: "error",
      });
      return;
    }

    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const userIds = selectedUsers.map((u) => u._id);

      const response = await axios.post(
        "http://localhost:4000/api/v1/chat/groupChat",
        {
          name: groupchatName,
          users: JSON.stringify(userIds),
        },
        config
      );

      // setChatStateList([data, ...chatStateList]);
      groupModalDisclosure.onClose();
      toast({
        title: "Group Created!",
        description: `${groupchatName} created successfully!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to create group",
        description: err.response?.data?.message || "Server Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    if (!query) return setSearchResults([]);

    setLoading(true);

    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      // Use the query string instead of the state variable 'search' which might be stale
      const response = await axios.get(
        `http://localhost:4000/api/v1/user/search?search=${query}`,
        config
      );
      console.log(response);

      setSearchResults(
        response?.data?.data.filter((u) => {
          return user._id != u._id;
        })
      );
    } catch (err) {
      console.log(err);

      toast({
        title: "Failed to load users",
        description: "User fetching failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // handle user add to group
  const handleUserAdd = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      // Check by unique ID
      toast({
        title: "User Already Added",
        status: "warning",
        isClosable: true,
        duration: 1500,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // handle remove
  const handleRemoveUser = (userToRemove) => {
    console.log(userToRemove);

    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToRemove._id) // ✅ FIX: Use sel._id !== userToRemove._id
    );
  };

  return (
    <>
      <Modal
        isOpen={groupModalDisclosure.isOpen}
        onClose={groupModalDisclosure.onClose}
        isCentered // Center the modal
      >
        <ModalOverlay />
        <ModalContent
          bg="#202c33" // 🎨 THEME: Dark background
          color="#e9edef" // 🎨 THEME: Light text
          border="1px solid #2f3b42"
        >
          <ModalHeader borderBottom="1px solid #2f3b42">
            Create New Group Chat
          </ModalHeader>
          <ModalCloseButton color="#e9edef" />

          <ModalBody pb={6}>
            <VStack spacing={4}>
              {/* Group Name Input */}
              <FormControl isRequired>
                <Input
                  type="text"
                  placeholder="Group Name"
                  onChange={(e) => setGroupchatName(e.target.value)}
                  bg="#2a3942"
                  border="none"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>

              {/* Search Users Input */}
              <FormControl>
                <Input
                  type="text"
                  placeholder="Search and Add Users (e.g., John, Jane)"
                  onChange={handleSearch}
                  bg="#2a3942"
                  border="none"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>

              {/* Selected Users Display (UserListItem) */}
              <Box d="flex" w="100%" flexWrap="wrap">
                {selectedUsers?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleRemoveUser(user)}
                    bg="#005c4b" // Themed background for selected user chips
                    color="white"
                    px={3}
                    py={1}
                    m={1}
                    borderRadius="lg"
                    cursor="pointer"
                  />
                ))}
              </Box>
            </VStack>

            {/* Search Results */}
            <Box mt={4} w="100%">
              {loading ? (
                <Spinner size="lg" color="#00a884" ml="auto" d="flex" />
              ) : (
                searchResults?.slice(0, 4).map((user) => (
                  // ✅ FIX: Use UserCard and ensure it is returned (Implicit return with parentheses)
                  <UserCard
                    key={user._id}
                    username={user.name}
                    useremail={user.email}
                    profilePic={user.pic}
                    handleFunction={() => handleUserAdd(user)}
                  />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter borderTop="1px solid #2f3b42">
            <Button
              onClick={handleSubmit}
              bg="#00a884" // 🎨 THEME: Accent button color
              color="white"
              _hover={{ bg: "#029e78" }}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupModal;
