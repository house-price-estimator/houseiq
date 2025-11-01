// src/pages/PredictionResult.tsx
import React from "react";
import { Box, Button, Flex, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreatePredictionResponse } from "../api/client";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import RealEstateTipsFeed from "../components/RealEstateTipsFeed";

const PredictionResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Get prediction data from navigation state
  const prediction: CreatePredictionResponse | undefined = location.state?.prediction;
  const input = location.state?.input;

  // Format price with currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!prediction) {
    return (
      <AnimatedBackground>
        <Box minH="100vh" w="100vw">
          <Navbar />
          <Flex minH="calc(100vh - 80px)" align="center" justify="center" px="4" py="8" pb="120px">
          <Box
            p={10}
            bg="rgba(15, 23, 42, 0.9)"
            backdropFilter="blur(10px)"
            borderWidth={1}
            borderRadius="2xl"
            borderColor="cyan.500"
            boxShadow="0 0 30px rgba(6, 182, 212, 0.3)"
            w="full"
            maxW="450px"
          >
            <VStack spacing={6}>
              <Heading size="lg" color="cyan.400" textShadow="0 0 10px rgba(6, 182, 212, 0.5)">No Prediction Data</Heading>
              <Text color="cyan.200" textAlign="center">
                Please submit a property form to see prediction results.
              </Text>
              <Button
                colorScheme="cyan"
                w="full"
                size="lg"
                onClick={handleBackToDashboard}
                fontWeight="semibold"
              >
                Back to Dashboard
              </Button>
            </VStack>
          </Box>
        </Flex>
        </Box>
        <RealEstateTipsFeed />
      </AnimatedBackground>
    );
  }

  const predictedPrice = prediction.predicted_price || 0;

  return (
    <AnimatedBackground>
      <Box minH="100vh" w="100vw">
        <Navbar />
        <Flex minH="calc(100vh - 80px)" align="center" justify="center" px="4" py="8" pb="120px">
        <Box
          p={10}
          bg="rgba(15, 23, 42, 0.9)"
          backdropFilter="blur(10px)"
          borderWidth={1}
          borderRadius="2xl"
          borderColor="cyan.500"
          boxShadow="0 0 30px rgba(6, 182, 212, 0.3)"
          w="full"
          maxW="500px"
        >
          <VStack spacing={6}>
            <Heading size="lg" color="cyan.400" textShadow="0 0 10px rgba(6, 182, 212, 0.5)">Prediction Result</Heading>
            
            <Box
              bg="rgba(6, 182, 212, 0.1)"
              p={6}
              borderRadius="xl"
              w="full"
              borderWidth="2px"
              borderColor="cyan.500"
              boxShadow="0 0 20px rgba(6, 182, 212, 0.4)"
            >
              <Text fontSize="sm" color="cyan.300" textAlign="center" mb={2}>
                Estimated Property Price
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color="cyan.400" textAlign="center" textShadow="0 0 15px rgba(6, 182, 212, 0.6)">
                {formatPrice(predictedPrice)}
              </Text>
            </Box>

            {input && (
              <Box
                bg="rgba(15, 23, 42, 0.6)"
                p={4}
                borderRadius="lg"
                w="full"
                borderWidth="1px"
                borderColor="cyan.800"
              >
                <Text fontSize="sm" fontWeight="semibold" color="cyan.300" mb={3}>
                  Property Details:
                </Text>
                <VStack align="stretch" spacing={2} fontSize="sm">
                  <Text color="cyan.200">
                    <strong>Bedrooms:</strong> {input.bedrooms}
                  </Text>
                  <Text color="cyan.200">
                    <strong>Bathrooms:</strong> {input.bathrooms}
                  </Text>
                  <Text color="cyan.200">
                    <strong>Floor Area:</strong> {input.floorArea} sqm
                  </Text>
                  <Text color="cyan.200">
                    <strong>Property Age:</strong> {input.propertyAge} years
                  </Text>
                  <Text color="cyan.200">
                    <strong>Location Index:</strong> {input.locationIndex}
                  </Text>
                </VStack>
              </Box>
            )}

            {prediction.createdAt && (
              <Text fontSize="xs" color="cyan.400" textAlign="center">
                Created: {formatDate(prediction.createdAt)}
              </Text>
            )}

            <VStack spacing={4} w="full" mt={4}>
              <Button
                variant="outline"
                w="full"
                size="lg"
                onClick={handleBackToDashboard}
                borderColor="cyan.500"
                color="cyan.400"
                _hover={{ bg: "rgba(6, 182, 212, 0.1)" }}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="ghost"
                w="full"
                size="md"
                onClick={() => navigate("/property-form")}
                color="cyan.400"
                _hover={{ bg: "rgba(6, 182, 212, 0.1)" }}
              >
                Create Another Prediction
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Flex>
      </Box>
      <RealEstateTipsFeed />
    </AnimatedBackground>
  );
};

export default PredictionResult;
