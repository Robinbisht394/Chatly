import { Box, Text, Flex } from "@chakra-ui/react";
import React from "react";
import { chatState } from "../context/chatProvider";
import SingleChat from "./miscellanous/SingleChat";

const ChatBox = () => {
  const { selectedChat } = chatState();

  return (
    <Flex
      flex="1"
      bg="#0b141a"
      color="#e9edef"
      borderRadius="md"
      border="1px solid #2f3b42"
      p="4"
      h="85vh"
      align="center"
      justify="center"
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      transition="all 0.3s ease"
    >
      {selectedChat ? (
        <SingleChat />
      ) : (
        <Box textAlign="center">
          <Text fontSize="lg" color="gray.400">
            Select a chat to start messaging 💬
          </Text>
        </Box>
      )}
    </Flex>
  );
};

export default ChatBox;
