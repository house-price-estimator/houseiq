import { Box, Button, Input, Heading, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => console.log("Logging in with:", email, password);
  const handleRegister = () => console.log("Redirect to register page");

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      px="4"
    >
      <VStack
        bg="white"
        p="10"
        rounded="2xl"
        shadow="lg"
        w="full"
        maxW="400px"
        gap="6" // vertical spacing between children
        align="stretch"
      >
        {/* Heading */}
        <Heading size="lg" textAlign="center">
          Welcome Back 👋
        </Heading>

        {/* Form Inputs */}
        <VStack gap="4" align="stretch">
          <Box>
            <Text mb="1" fontWeight="medium" fontSize="sm">
              Email
            </Text>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              borderColor="teal.500"
            />
          </Box>

          <Box>
            <Text mb="1" fontWeight="medium" fontSize="sm">
              Password
            </Text>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              borderColor="teal.500"
            />
          </Box>
        </VStack>

        {/* Buttons */}
        <VStack gap="3">
          <Button colorScheme="teal" w="full" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="outline" w="full" onClick={handleRegister}>
            Register
          </Button>
        </VStack>

        {/* Register Link */}
        <Text fontSize="sm" textAlign="center">
          Don’t have an account?{" "}
          <RouterLink
            to="/register"
            style={{ color: "#319795", fontWeight: "bold" }}
          >
            Register
          </RouterLink>
        </Text>
      </VStack>
    </Box>
  );
}
