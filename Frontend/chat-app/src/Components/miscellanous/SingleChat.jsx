import React, { useEffect, useState } from "react";
import { chatState } from "../../context/chatProvider";
import { sender, fullSenderUserName } from "../../services/appLogic";
import UserProfileModal from "./UserProfileModal";
import {
  Box,
  Icon,
  Text,
  useDisclosure,
  useToast,
  Spinner,
  Input,
  FormControl,
  Flex,
  useBreakpointValue, // For responsive design
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import UpdateGroupModal from "./UpdateGroupModal";
import ScrollabelFeed from "./ScrollabelFeed";
import io from "socket.io-client";
import axios from "axios";

// NOTE: It's cleaner to use environment variables for the endpoint
const endpoint = "http://localhost:4000";
let socket, selectedChatCompare;

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    chatState();

  const toast = useToast();
  const userProfileModal = useDisclosure();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  // Responsive arrow button visibility
  const arrowDisplay = useBreakpointValue({ base: "block", md: "none" });

  // ✅ Send message handler
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      if (!user || !user.token) {
        toast({ title: "Authentication Error", status: "error" });
        return;
      }

      setNewMessage("");

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        };

        const response = await axios.post(
          "http://localhost:4000/api/v1/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        // Emit message to socket
        socket.emit("new message", response.data.chatMessage);
        setMessages((prev) => [...prev, response.data.chatMessage]);
      } catch (err) {
        console.log(err);

        setNewMessage(newMessage); // Restore message if send failed
        toast({
          title: "Error sending message",
          description: "Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // ✅ Fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      // 💡 Bug Fix: Check for token before fetching
      if (!user || !user.token) return;

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const response = await axios.get(
          `${endpoint}/api/v1/message/${selectedChat._id}`,
          config
        );

        setMessages(response.data.message);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);
        selectedChatCompare = selectedChat;
      } catch (err) {
        setLoading(false);
        toast({
          title: "Error loading messages",
          description: "Could not fetch messages.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchMessages();
  }, [selectedChat, user, toast]); // Dependency array simplified

  // ✅ Socket setup
  useEffect(() => {
    socket = io(endpoint);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.emit("join chat", selectedChat._id);

    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Notification logic remains correct
        if (!notification.find((n) => n._id === newMessageReceived._id)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });

    // Cleanup function for socket disconnection
    return () => {
      socket.disconnect();
    };
  }, [user, notification, setNotification, setMessages]);

  // ✅ Typing handler (remains the same)
  const typingIndicator = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", selectedChat._id);
    setIsTyping(true);
    if (newMessage == e.target.value) {
      socket.emit("stop typing", selectedChat._id);
    }
  };
  useEffect(() => {
    socket.on("typing");
    console.log("user is typing");
    if (socket.on("stop typing")) {
      setIsTyping(false);
    }
  }, [newMessage, setNewMessage, typingIndicator]);

  // Empty state rendering
  if (!selectedChat)
    return (
      <Flex
        flex="1"
        bg="#0b141a"
        color="gray.400"
        justify="center"
        align="center"
        fontSize="xl" // Increased font size
        borderRadius="md"
        h="100%" // Take full height of parent container
      >
        Select a chat to start messaging 💬
      </Flex>
    );

  return (
    <Flex
      flexDir="column"
      bg="#202c33" // 🎨 THEME: Used a dark color for the chat box container
      color="#e9edef"
      w="100%"
      h="100%" // Use 100% to fill the parent box height
      borderRadius="md"
      p="4"
    >
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        borderBottom="1px solid #2f3b42"
        pb="3"
        mb="3"
      >
        <Flex align="center" gap="3">
          {/* Arrow is hidden on larger screens */}
          <Icon
            as={FaArrowLeft}
            cursor="pointer"
            fontSize="lg"
            display={arrowDisplay}
            onClick={() => setSelectedChat("")}
          />
          <Text
            fontWeight="bold"
            fontSize="xl" // Larger text for better focus
            color="#00a884" // Accent color for chat title
          >
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : sender(user, selectedChat.users)}
          </Text>
        </Flex>

        {/* Profile/Group Settings Button */}
        <Box>
          {!selectedChat.isGroupChat ? (
            // Assuming UserProfileModal has a trigger button inside
            <UserProfileModal
              userProfileModal={userProfileModal}
              user={fullSenderUserName(user, selectedChat.users)}
            />
          ) : (
            // Assuming UpdateGroupModal has a trigger button inside
            <UpdateGroupModal />
          )}
        </Box>
      </Flex>

      {/* Messages Feed */}
      <Box
        flex="1"
        overflowY="auto"
        mb="3"
        bg="#0b141a" // 🎨 THEME: Deepest dark for the message background
        borderRadius="md"
        p="3"
        // 🎨 THEME: Custom CSS for scrollbar to match theme (no-scrollbar from earlier)
        className="no-scrollbar"
        css={{
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#2f3b42",
            borderRadius: "20px",
          },
          "&::-webkit-scrollbar-track": { background: "transparent" },
        }}
      >
        {loading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="xl" color="#00a884" />
          </Flex>
        ) : (
          <ScrollabelFeed messages={messages} />
        )}
      </Box>

      {/* Input */}
      <FormControl onKeyDown={sendMessage}>
        <span>{istyping && "Typing"}</span>
        <Input
          value={newMessage}
          onChange={typingIndicator}
          placeholder="Type a message..."
          bg="#2a3942" // 🎨 THEME: Lighter dark for the input field
          color="#e9edef"
          border="none"
          _placeholder={{ color: "gray.400" }}
          _focus={{
            boxShadow: "0 0 0 2px #00a884", // Use box-shadow for focus ring
            bg: "#2a3942",
          }}
        />
      </FormControl>
    </Flex>
  );
};

export default SingleChat;
