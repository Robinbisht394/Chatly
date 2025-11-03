import React from "react";
import { Box, Text, Avatar, Flex, Heading } from "@chakra-ui/react";

const UserCard = (props) => {
  const { username, useremail, profilePic, handleFunction } = props;

  if (!username) return null;

  return (
    <Flex
      align="center"
      p={2}
      mb={1}
      borderRadius="lg"
      cursor="pointer"
      w="100%"
      bg="#2a3942"
      color="#e9edef"
      _hover={{
        bg: "#3a4b52",
      }}
      onClick={handleFunction}
    >
      {/*  Avatar */}
      <Avatar size="sm" src={profilePic} name={username} mr={3} />

      {/*  User Info */}
      <Box>
        <Heading fontSize="md" fontWeight="semibold">
          {username || "Unknown User"}
        </Heading>
        <Text fontSize="sm" color="gray.400">
          Email {useremail || ""}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserCard;
