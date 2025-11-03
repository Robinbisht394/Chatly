import React, { useState } from "react";
import {
  Tooltip,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Flex,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaSearch, FaBell } from "react-icons/fa";
import axios from "axios";
import Sidedrawer from "./SideDrawer";
import UserProfileModal from "./UserProfileModal";
import { chatState } from "../../context/chatProvider";
import { sender } from "../../services/appLogic";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const { notification, setNotification, user, setSelectedChat } = chatState();

  const sideDrawer = useDisclosure();
  const userProfileModal = useDisclosure();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  // Search user
  const handleSearch = async () => {
    if (search.trim() === "") {
      toast({
        title: "Empty search",
        description: "Please enter a name or email to search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      console.log(search);

      const response = await axios.get(
        `http://localhost:4000/api/v1/user/search?search=${search}`
      );
      console.log(response.data);

      setResult(response?.data?.data);
    } catch (error) {
      toast({
        title: "Error fetching users",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("chatlyUser");
    navigate("/"); //navigate to login page
  };

  // hnadle notification
  const handleNotification = async (notif) => {
    setSelectedChat(notif.chat);
    setNotification(notification.filter((n) => n !== notif));

    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/notification",
        notif.chat._id
      );
      console.log(err);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Flex
      bg="#202c33"
      color="#e9edef"
      align="center"
      justify="space-between"
      px="4"
      py="2"
      borderBottom="1px solid #2f3b42"
    >
      {/* Search Section */}
      <Tooltip label="Search users here" hasArrow bg="#00a884" color="white">
        <Flex
          align="center"
          gap="2"
          cursor="pointer"
          onClick={sideDrawer.onOpen}
        >
          <FaSearch size={18} />
          <Button
            display={{ base: "none", md: "flex" }}
            bg="#00a884"
            color="white"
            _hover={{ bg: "#029e78" }}
            size="sm"
          >
            Search Users
          </Button>
        </Flex>
      </Tooltip>

      {/* App title */}
      <Text fontWeight="bold" fontSize="lg" fontStyle={"sans-serif"}>
        Blink
      </Text>

      {/* Notification + Profile */}
      <Flex align="center" gap="4">
        <Menu>
          <MenuButton as={Button} bg="transparent" _hover={{ bg: "none" }}>
            <Box position="relative">
              <FaBell size={18} color="white" />
              {notification?.length >= 0 && (
                <Box
                  as="span"
                  position="absolute"
                  top="-6px"
                  right="-6px"
                  bg="#00a884"
                  color="white"
                  fontSize="xs"
                  rounded="full"
                  px="2"
                >
                  {notification.length}
                </Box>
              )}
            </Box>
          </MenuButton>
          {/* Notifications */}
          <MenuList bg="#2a3942" color="#e9edef">
            {!notification?.length && (
              <MenuItem bg="transparent">No new messages</MenuItem>
            )}
            {notification?.map((notif) => (
              <MenuItem
                key={notif._id}
                bg="transparent"
                _hover={{ bg: "#3a4b52" }}
                onClick={() => handleNotification(notif)}
              >
                {notif.chat.isGroupChat
                  ? `New message in ${notif.chat.chatName}`
                  : `Message from ${sender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Profile menu */}
        <Menu>
          <MenuButton>
            <Avatar size="sm" name={user?.name} src={user?.pic || ""} />
          </MenuButton>
          <MenuList bg="#2a3942" color="#e9edef">
            <MenuItem
              bg="transparent"
              _hover={{ bg: "#3a4b52" }}
              onClick={userProfileModal.onOpen}
            >
              My Profile
            </MenuItem>
            <MenuItem
              bg="transparent"
              _hover={{ bg: "#3a4b52" }}
              onClick={handleLogout}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>

        {/* 🔍 Drawer & Profile Modal */}
        <Sidedrawer
          loading={loading}
          search={search}
          setSearch={setSearch}
          result={result}
          handleSearch={handleSearch}
          isOpen={sideDrawer.isOpen}
          onOpen={sideDrawer.onOpen}
          onClose={sideDrawer.onClose}
        />
        <UserProfileModal userProfileModal={userProfileModal} user={user} />
      </Flex>
    </Flex>
  );
};

export default SideBar;
