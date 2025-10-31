// src/pages/PredictionResult.tsx
import React from "react";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const PredictionResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Placeholder predicted price
  const predictedPrice = "R1.2 Million";

  const handleSave = () => {
    // TODO: Send data to backend to save prediction
    alert("Prediction saved! (backend integration not yet implemented)");
    navigate("/history");
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        w="full"
        maxW="400px"
      >
        <VStack spacing={6}>
          <Heading>Prediction Result</Heading>
          <Text fontSize="2xl" fontWeight="bold">
            {predictedPrice}
          </Text>

          <VStack spacing={4} w="full">
            <Button colorScheme="teal" w="full" onClick={handleSave}>
              Save Prediction
            </Button>
            <Button
              variant="outline"
              w="full"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default PredictionResult;
