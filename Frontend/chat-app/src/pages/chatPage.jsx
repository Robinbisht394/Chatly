import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import SideBar from "../Components/miscellanous/SideBar";
import UserChats from "../Components/UserChats";
import ChatBox from "../Components/ChatBox";
import { chatState } from "../context/chatProvider";

const ChatPage = () => {
  const { user, selectedChat } = chatState();

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
