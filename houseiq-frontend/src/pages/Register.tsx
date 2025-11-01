import { Box, Button, Input, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim();
    if (!emailRegex.test(trimmedEmail)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(email.trim(), password, name.trim());
      toast({
        title: "Registration Successful",
        description: "Account created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Email may already be registered.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" w="100vw">
      <Navbar showLogout={false} />
      <Box
        minH="calc(100vh - 80px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px="4"
        py="8"
      >
        <VStack
          bg="rgba(15, 23, 42, 0.9)"
          backdropFilter="blur(10px)"
          p={10}
          rounded="2xl"
          shadow="2xl"
          w="full"
          maxW="420px"
          gap={6}
          align="stretch"
          borderWidth="1px"
          borderColor="cyan.500"
          boxShadow="0 0 30px rgba(6, 182, 212, 0.3)"
        >
          <Heading size="lg" textAlign="center" color="cyan.400" textShadow="0 0 10px rgba(6, 182, 212, 0.5)">
            Create Account 🚀
          </Heading>
          <Text textAlign="center" color="cyan.200" fontSize="sm">
            Sign up to get started with HouseIQ
          </Text>

          <VStack gap={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="semibold" fontSize="sm" color="cyan.300">
                Full Name
              </Text>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                focusBorderColor="cyan.500"
                size="lg"
                variant="filled"
                disabled={isLoading}
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="semibold" fontSize="sm" color="cyan.300">
                Email
              </Text>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                focusBorderColor="cyan.500"
                size="lg"
                variant="filled"
                disabled={isLoading}
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="semibold" fontSize="sm" color="cyan.300">
                Password
              </Text>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                focusBorderColor="cyan.500"
                size="lg"
                variant="filled"
                disabled={isLoading}
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="semibold" fontSize="sm" color="cyan.300">
                Confirm Password
              </Text>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                focusBorderColor="cyan.500"
                size="lg"
                variant="filled"
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && handleRegister()}
              />
            </Box>
          </VStack>

          <VStack gap={3}>
            <Button 
              colorScheme="cyan" 
              w="full" 
              size="lg"
              onClick={handleRegister}
              fontWeight="semibold"
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Create Account
            </Button>
            <Button 
              variant="outline" 
              w="full" 
              size="lg"
              onClick={() => navigate("/")}
              borderColor="cyan.500"
              color="cyan.400"
              _hover={{ bg: "rgba(6, 182, 212, 0.1)" }}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          </VStack>

          <Text fontSize="sm" textAlign="center" color="cyan.300">
            Already have an account?{" "}
            <RouterLink
              to="/"
              style={{ color: "#06b6d4", fontWeight: "600", textShadow: "0 0 5px rgba(6, 182, 212, 0.5)" }}
            >
              Sign In
            </RouterLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

