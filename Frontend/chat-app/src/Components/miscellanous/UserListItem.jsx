import React from "react";
import { Box, color, IconButton } from "@chakra-ui/react";

import { FiX } from "react-icons/fi";
const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box display={"flex"} gap={2} width={"auto"} padding={1}>
        <p>{user.name}</p>
        <IconButton
          aria-label="remove"
          icon={<FiX />}
          onClick={() => handleFunction(user)}
          variant="ghost"
          size="sm"
          color={"white"}
          _hover={{ color: "black", bg: "white" }}
        />
      </Box>
    </>
  );
};

export default UserListItem;
