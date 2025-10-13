import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  VStack,
  useToast,
  HStack,
  Image,
  Spinner,
  InputRightElement,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const Signup = () => {
  const toast = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImagefile] = useState(null);
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  //  Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat app");
    formData.append("cloud_name", "duzaootux");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/duzaootux/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  };

  //  Handle signup
  const onSubmit = async (formData) => {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        pic: imageUrl,
      };

      const response = await axios.post(
        "http://localhost:4000/api/v1/user/signup",
        payload
      );

      if (response) {
        toast({
          title: "Signup successful",
          description: "User registered successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem("chatlyUser", JSON.stringify(response.data.user));
        reset();
      }
    } catch (err) {
      toast({
        title: "Signup failed",
        description:
          err?.response.data.error.message ||
          "Something went wrong try again !",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //  Handle image change
  const handleImagechange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Only image files are accepted.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setImagefile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Box
      minH="auto"
      bg="#0b141a"
      display="flex"
      alignItems="start"
      justifyContent="center"
      color="white"
    >
      <Box
        bg="#111b21"
        p={10}
        rounded="md"
        shadow="lg"
        width="100%"
        maxW="450px"
        border="1px solid #1f2c33"
      >
        <VStack spacing={6} align="stretch">
          <Heading
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            color="#25D366"
          >
            Create Your Account
          </Heading>

          {/* Name */}
          <FormControl isInvalid={errors.name}>
            <FormLabel fontSize="sm" color="gray.300">
              Name
            </FormLabel>
            <Input
              {...register("name", {
                required: "Name is required",
              })}
              placeholder="Enter your name"
              bg="#202c33"
              border="1px solid #2a3942"
              color="white"
              _focus={{ borderColor: "#25D366" }}
              _placeholder={{ color: "gray.500" }}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          {/* Email */}
          <FormControl isInvalid={errors.email}>
            <FormLabel fontSize="sm" color="gray.300">
              Email
            </FormLabel>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email"
              bg="#202c33"
              border="1px solid #2a3942"
              color="white"
              _focus={{ borderColor: "#25D366" }}
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
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your password"
                bg="#202c33"
                border="1px solid #2a3942"
                color="white"
                _focus={{ borderColor: "#25D366" }}
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

          {/* Profile Picture */}
          <FormControl>
            <FormLabel fontSize="sm" color="gray.300">
              Profile Picture
            </FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImagechange}
              bg="#202c33"
              border="1px solid #2a3942"
              color="white"
              p={1}
            />
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                mt={3}
                borderRadius="md"
                boxSize="100px"
                objectFit="cover"
                mx="auto"
              />
            )}
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
            {isSubmitting ? <Spinner size="sm" /> : "Sign Up"}
          </Button>

          <Text textAlign="center" fontSize="sm" color="gray.400">
            Join our secure chat • End-to-end encrypted
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Signup;
