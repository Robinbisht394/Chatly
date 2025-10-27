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
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import UpdateGroupModal from "./UpdateGroupModal";
import ScrollabelFeed from "./ScrollabelFeed";
import io from "socket.io-client";
import axios from "axios";

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

  // Responsive arrow button
  const arrowDisplay = useBreakpointValue({ base: "block", md: "none" });

  // Send message handler
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

  const sendNotification = async (chat, content) => {
    console.log("notification sent");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/notification/",
        {
          chat,
          content,
        }
      );
      console.log(response);
    } catch (err) {
      console.err(err);
    }
  };

  // Fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

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
  }, [selectedChat]); // Dependency array simplified

  //  Socket setup
  useEffect(() => {
    // Initialize socket and setup

    socket = io(endpoint);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    // Cleanup function for socket disconnection
    return () => {
      socket.off("message received");
      socket.off("typing");
      socket.off("stop typing");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    console.log("message useEffect");

    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id != newMessageReceived.chat._id
      ) {
        // --- Notification Handling ---

        console.log("notify set");
        setNotification((prevNotifications) => {
          // Check if the message is already in the notification list
          const exist = prevNotifications.some(
            (n) => n._id === newMessageReceived._id
          );
          if (!exist) {
            return [newMessageReceived, ...prevNotifications];
          }

          return prevNotifications;
        });
        sendNotification(newMessageReceived.chat, newMessageReceived.content);
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
      console.log("messag off");
    };
  }, [setMessages, setNotification]);

  const typingIndicator = (e) => {
    setNewMessage(e.target.value);
    if (!socket) return;
    socket.emit("typing", selectedChat._id);
    setIsTyping(true);
    let timeout;
    if (timeout) {
      clearInterval(timeout);
    }

    timeout = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
    }, 3000);
  };
  // typing socket
  useEffect(() => {
    if (!socket) return;

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [setNewMessage]);

  // Empty state rendering
  if (!selectedChat)
    return (
      <Flex
        flex="1"
        bg="#0b141a"
        color="gray.400"
        justify="center"
        align="center"
        fontSize="xl"
        borderRadius="md"
        h="100%"
      >
        Select a chat to start messaging 💬
      </Flex>
    );

  return (
    <Flex
      flexDir="column"
      bg="#202c33"
      color="#e9edef"
      w="100%"
      h="100%"
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
        <span>
          {istyping && <p className="pl-5 text-green-500">typing...</p>}
        </span>
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
