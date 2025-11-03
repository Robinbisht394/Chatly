import React, { useEffect } from "react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  VStack,
  Container,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chatlyUser"));
    if (user) {
      navigate("/chat");
    }
  }, []);

  return (
    <Box
      minH="100vh"
      w="100%"
      bg="#0b141a"
      display="flex"
      alignItems="center"
      justifyContent="center"
      // px={4}
      py={4}
    >
      <Container
        maxW="lg"
        bg="#111b21"
        p={{ base: 6, md: 10 }}
        rounded="md"
        boxShadow="lg"
        // border="1px solid #1f2c33"
      >
        <VStack spacing={6}>
          <Text fontSize="sm" color="gray.400" textAlign="center">
            Connect securely. Chat instantly.
          </Text>

          <Tabs
            isFitted
            variant="soft-rounded"
            colorScheme="green"
            w="100%"
            mt={2}
          >
            <TabList mb="1em" gap={"2px"}>
              <Tab
                _selected={{
                  bg: "#25D366",
                  color: "black",
                  fontWeight: "bold",
                }}
                bg="#202c33"
                color="white"
                border="1px solid #2a3942"
                _hover={{ bg: "#1f2c33" }}
              >
                Login
              </Tab>
              <Tab
                _selected={{
                  bg: "#25D366",
                  color: "black",
                  fontWeight: "bold",
                }}
                bg="#202c33"
                color="white"
                border="1px solid #2a3942"
                _hover={{ bg: "#1f2c33" }}
              >
                Sign Up
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
