import React, { useState, useRef } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  Box,
  Input,
  Button,
  VStack,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import UserCard from "./UserCard";
import SkeletonLoading from "../SkeletonLoading";
import { chatState } from "../../context/chatProvider";
import axios from "axios";

const Sidedrawer = (props) => {
  const { search, setSearch, result, handleSearch, isOpen, onClose, loading } =
    props;
  const { user, setSelectedChat, chatStateList, setChatStateList } =
    chatState();

  const [loadingChat, setloadingChat] = useState(false);
  const toast = useToast();

  const accessChat = async (userId) => {
    console.log(userId);

    setloadingChat(true);

    if (!user || !user.token) {
      toast({
        title: "Authentication Error",
        description: "User token is missing.",
        status: "error",
        duration: 3000,
      });
      setloadingChat(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/chat",
        { userId },
        config
      );
      console.log(response);

      if (!chatStateList.find((c) => c._id === response?.data.chat._id)) {
        setChatStateList([response.data.chat, ...chatStateList]);
      }

      // setSelectedChat(response?.data.chat);
      console.log(chatStateList);

      onClose(); // Close the drawer upon selecting or creating a chat
    } catch (err) {
      console.log(err);

      toast({
        title: "Error accessing chat",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setloadingChat(false);
    }
  };

  const firstField = useRef();

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        initialFocusRef={firstField}
      >
        <DrawerOverlay />
        <DrawerContent bg="#202c33" color="#e9edef">
          {" "}
          <DrawerCloseButton color="#e9edef" />
          <DrawerHeader borderBottomWidth="1px" borderColor="#2f3b42">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            {/* Search Input and Button */}
            <Box display="flex" alignItems="center" mb={4}>
              <Input
                ref={firstField}
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="#2a3942"
                border="none"
                _focus={{ borderColor: "#00a884" }}
              />
              <Button
                onClick={handleSearch}
                ml={2}
                bg="#00a884"
                color="white"
                _hover={{ bg: "#029e78" }}
                isLoading={loading}
              >
                Go
              </Button>
            </Box>

            {/* Search Results */}
            <Box mt={3} h="100%" overflowY="auto">
              {loading ? (
                <SkeletonLoading count={6} />
              ) : result?.length > 0 ? (
                <VStack spacing={2} align="stretch">
                  {result.map((user) => {
                    return (
                      <UserCard
                        key={user._id}
                        username={user.name}
                        useremail={user.email}
                        profilePic={user.pic}
                        handleFunction={() => accessChat(user._id)}
                      />
                    );
                  })}
                </VStack>
              ) : search.length > 0 && !loading ? (
                <Text color="gray.400" mt={4}>
                  No users found.
                </Text>
              ) : (
                <Text color="gray.400" mt={4}>
                  Start typing to search users.
                </Text>
              )}
            </Box>

            {loadingChat && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                mt={4}
                color="#00a884"
              >
                <Spinner size="sm" mr={2} />
                <Text fontSize="sm">Accessing chat...</Text>
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidedrawer;
