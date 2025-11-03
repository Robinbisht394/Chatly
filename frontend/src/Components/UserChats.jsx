import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  useToast,
  Stack,
  useDisclosure,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";
import { chatState } from "../context/chatProvider";
import SkeletonLoading from "./SkeletonLoading";
import { sender } from "../services/appLogic";
import GroupModal from "./miscellanous/GroupModal";
const UserChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chatStateList,
    setChatStateList,
  } = chatState();
  const groupModalDisclosure = useDisclosure();
  const toast = useToast();

  // fetch all chats for logged-in user part of
  const fetchUserChats = async () => {
    try {
      const config = {
        headers: {
          authorization: `bearer ${user.token}`,
        },
      };

      const response = await axios.get(
        "http://localhost:4000/api/v1/chat",
        config
      );

      setChatStateList(response?.data?.chats);
    } catch (err) {
      console.error(err);

      toast({
        title: "something went occured",
        description: "failed to load chats try again !",
        status: "error",
        duration: 3000,
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("chatlyUser")));
    if (user != undefined) {
      fetchUserChats();
    }
  }, [user]);
  return (
    <Box display="flex" flexDirection="column" p={4} h="100%">
      {/* header for MyChats + group Chat create */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        pb={3}
        mb={3}
        borderBottom="1px solid #2f3b42"
      >
        <Heading fontSize="xl">My Chats</Heading>

        <Button
          bg="#00a884"
          color="white"
          size="sm"
          _hover={{ bg: "#029e78" }}
          onClick={groupModalDisclosure.onOpen}
        >
          New Group +
        </Button>
        <GroupModal groupModalDisclosure={groupModalDisclosure} />
      </Flex>

      <Box flex="1" overflowY="scroll" className="no-scrollbar" p={3}>
        {" "}
        {chatStateList && user ? (
          <Stack spacing={2}>
            {chatStateList.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  borderRadius="lg"
                  px={3}
                  py={2}
                  bg={selectedChat === chat ? "#005c4b" : "transparent"}
                  _hover={{ bg: selectedChat === chat ? "#005c4b" : "#2a3942" }}
                  key={chat._id}
                  display={"flex"}
                  justifyContent={"start"}
                  alignItems={"center"}
                  gap={4}
                >
                  <Avatar
                    size="sm"
                    name={
                      chat.isGroupChat
                        ? chat.chatName
                        : sender(loggedUser, chat.users)
                    }
                    src={user?.pic || ""}
                  />
                  <Text fontWeight="medium" color="white">
                    {!chat.isGroupChat
                      ? sender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <SkeletonLoading />
        )}
      </Box>
    </Box>
  );
};

export default UserChats;
