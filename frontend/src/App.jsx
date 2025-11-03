import React from "react";
import ChatPage from "./pages/chatPage.jsx";
import Home from "./pages/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatProvider from "./context/chatProvider.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/chat",
    element: (
      <>
        <ChatProvider>
          <ChatPage />
        </ChatProvider>
      </>
    ),
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
