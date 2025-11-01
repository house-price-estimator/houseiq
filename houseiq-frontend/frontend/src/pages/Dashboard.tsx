import { Box, Button, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import RealEstateTipsFeed from "../components/RealEstateTipsFeed";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AnimatedBackground>
      <Box minH="100vh" w="100vw">
        <Navbar />
        <Box
          minH="calc(100vh - 80px)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px="4"
          py="8"
          pb="120px"
        >
        <VStack
          bg="rgba(15, 23, 42, 0.9)"
          backdropFilter="blur(10px)"
          p={10}
          rounded="2xl"
          shadow="2xl"
          w="full"
          maxW="450px"
          gap={6}
          align="stretch"
          borderWidth="1px"
          borderColor="cyan.500"
          boxShadow="0 0 30px rgba(6, 182, 212, 0.3)"
        >
          <VStack align="flex-start" gap={0}>
            <Heading size="2xl" color="cyan.400" fontWeight="bold" textShadow="0 0 10px rgba(6, 182, 212, 0.5)">
              HouseIQ
            </Heading>
            <Text fontSize="sm" color="cyan.300">
              Property Price Estimator
            </Text>
          </VStack>

          <HStack justify="center" align="center" spacing={2}>
            <Text fontSize="xl" textAlign="center" color="cyan.100" fontWeight="medium">
              Welcome Back, {user?.name || user?.email || "User"}!
            </Text>
            <Box
              as="svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              color="cyan.400"
              filter="drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </Box>
          </HStack>
          <Text fontSize="sm" textAlign="center" color="cyan.200" mb={2}>
            Get accurate property price estimates powered by AI
          </Text>
          <VStack gap={4} align="stretch" mt={4}>
            <Button
              colorScheme="cyan"
              w="full"
              size="lg"
              onClick={() => navigate("/property-form")}
              fontWeight="semibold"
            >
              Estimate New Property Price
            </Button>
            <Button
              variant="outline"
              w="full"
              size="lg"
              onClick={() => navigate("/history")}
              borderColor="cyan.500"
              color="cyan.400"
              _hover={{ bg: "rgba(6, 182, 212, 0.1)" }}
            >
              View Prediction History
            </Button>
          </VStack>
        </VStack>
        </Box>
      </Box>
      <RealEstateTipsFeed />
    </AnimatedBackground>
  );
}
