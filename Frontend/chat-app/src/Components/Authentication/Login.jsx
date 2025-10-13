import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
  InputGroup,
  useToast,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useFetchApi from "../../customHooks/useFetch";

const Login = () => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const { error, data, fetchApi, setError } = useFetchApi();
  const [show, setShow] = useState(false);

  const onSubmit = async (formData) => {
    const response = await fetchApi(
      "http://localhost:4000/api/v1/user/login",
      formData
    );
    console.log({ response: data, error: error });

    if (error?.data?.code === "USER_NOT_FOUND") {
      console.log(error.response);

      toast({
        title: "login failed",
        description: error?.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError(null);
    } else if (error?.data?.code === "INVALID ID_PASSWORD") {
      console.log(error.response);

      toast({
        title: "Error",
        description: error?.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setError(null);
    } else if (data) {
      console.log(data);

      localStorage.setItem("chatlyUser", JSON.stringify(data.user));
      toast({
        title: "Login successful",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      reset();
    }
  };

  return (
    <Box
      minH={"auto"}
      bg="#0b141a"
      display="flex"
      alignItems="start"
      justifyContent="center"
    >
      <Box
        bg="#111b21"
        color="white"
        p={10}
        rounded="md"
        shadow="lg"
        width="100%"
        maxW="400px"
        border="1px solid #1f2c33"
      >
        <VStack spacing={6} align="stretch">
          <Heading
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            color="#25D366"
          >
            Chatly Login
          </Heading>

          {/* Email */}
          <FormControl isInvalid={errors.email}>
            <FormLabel fontSize="sm" color="gray.300">
              Email
            </FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              bg="#202c33"
              border="1px solid #2a3942"
              _focus={{ borderColor: "#25D366" }}
              color="white"
              _placeholder={{ color: "gray.500" }}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          {/* Password */}
          <FormControl isInvalid={errors.password}>
            <FormLabel fontSize="sm" color="gray.300">
              Password
            </FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                bg="#202c33"
                border="1px solid #2a3942"
                _focus={{ borderColor: "#25D366" }}
                color="white"
                _placeholder={{ color: "gray.500" }}
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  size="sm"
                  color="#25D366"
                  _hover={{ bg: "transparent" }}
                  onClick={() => setShow((prev) => !prev)}
                >
                  {show ? (
                    <AiOutlineEyeInvisible style={{ fontSize: "18px" }} />
                  ) : (
                    <AiOutlineEye style={{ fontSize: "18px" }} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="green"
            bg="#25D366"
            _hover={{ bg: "#20bd5f" }}
            color="black"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <Text textAlign="center" fontSize="sm" color="gray.400">
            Secure login • End-to-end encrypted
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
