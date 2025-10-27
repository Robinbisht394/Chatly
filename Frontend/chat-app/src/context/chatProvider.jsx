import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chatStateList, setChatStateList] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("chatlyUser");

    if (!user) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(user));
  }, []);

  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chatStateList,
        setChatStateList,
        notification,
        setNotification,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};
export const chatState = () => {
  return useContext(chatContext);
};
export default ChatProvider;
