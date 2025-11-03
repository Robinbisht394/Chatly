import React, { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import SideBar from "../Components/miscellanous/SideBar.jsx";
import UserChats from "../Components/UserChats.jsx";
import ChatBox from "../Components/ChatBox.jsx";
import { chatState } from "../context/chatProvider";
import axios from "axios";
const ChatPage = () => {
  const { user, selectedChat, notification, setUser } = chatState();

  const fetchNotifications = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/notification",
        config
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, notification, setUser]);
  return (
    <Flex
      w="100%"
      h="100vh"
      bg="#111b21"
      color="white"
      overflow="hidden"
      flexDir="column"
    >
      <SideBar />

      <Flex flex="1" overflow="hidden" pt="1">
        {" "}
        <Box
          w={{ base: "100%", md: "35%", lg: "30%" }}
          h="100%"
          bg="#202c33"
          borderRight="1px solid #2f3b42"
          display={{ base: selectedChat ? "none" : "block", md: "block" }}
        >
          <UserChats />
        </Box>
        <Box
          flex="1"
          h="100%"
          bg="#0b141a"
          display={{ base: selectedChat ? "block" : "none", md: "block" }}
        >
          <ChatBox />
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatPage;
