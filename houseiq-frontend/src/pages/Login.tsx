import { Box, Button, Input, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
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
            Welcome Back 👋
          </Heading>
          <Text textAlign="center" color="cyan.200" fontSize="sm">
            Sign in to your account to continue
          </Text>

          <VStack gap={4} align="stretch">
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
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
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
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </Box>
          </VStack>

          <VStack gap={3}>
            <Button 
              colorScheme="cyan" 
              w="full" 
              size="lg"
              onClick={handleLogin}
              fontWeight="semibold"
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              w="full" 
              size="lg"
              onClick={() => navigate("/register")}
              borderColor="cyan.500"
              color="cyan.400"
              _hover={{ bg: "rgba(6, 182, 212, 0.1)" }}
              disabled={isLoading}
            >
              Create Account
            </Button>
          </VStack>

          <Text fontSize="sm" textAlign="center" color="cyan.300">
            Don't have an account?{" "}
            <RouterLink
              to="/register"
              style={{ color: "#06b6d4", fontWeight: "600", textShadow: "0 0 5px rgba(6, 182, 212, 0.5)" }}
            >
              Sign Up
            </RouterLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
