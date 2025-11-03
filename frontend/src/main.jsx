import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import App from "./App.jsx";
// import ChatProvider from "./context/chatProvider.jsx";
createRoot(document.getElementById("root")).render(
  // <ChatProvider>
  <ChakraProvider>
    <App />
  </ChakraProvider>
  // {/* </ChatProvider> */}
);
