import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function SignupCard() {
  // State variables for managing form inputs, password visibility, and notifications
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  // State variable to manage input fields
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Function to handle signup form submission
  const handleSignup = async () => {
    try {
      // Sending a POST request to the backend to create a new user
      const res = await fetch("/api/users/signup", {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      // Parsing the response data
      const data = await res.json();

      // Handling errors or displaying success message
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // Storing user data in local storage and updating user state
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  // JSX code to render the signup form
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                {/* Input field for Full Name */}
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setInputs({ ...inputs, name: e.target.value });
                    }}
                    value={inputs.name}
                  />
                </FormControl>
              </Box>
              <Box>
                {/* Input field for Username */}
                <FormControl isRequired>
                  <FormLabel>UserName</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setInputs({ ...inputs, username: e.target.value });
                    }}
                    value={inputs.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            {/* Input field for Email */}
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) => {
                  setInputs({ ...inputs, email: e.target.value });
                }}
                value={inputs.email}
              />
            </FormControl>
            {/* Input field for Password */}
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setInputs({ ...inputs, password: e.target.value });
                  }}
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  {/* Button to toggle password visibility */}
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              {/* Button to submit the signup form */}
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              {/* Link to navigate to the login page */}
              <Text align={"center"}>
                Already a user?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => {
                    setAuthScreen("login");
                  }}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
