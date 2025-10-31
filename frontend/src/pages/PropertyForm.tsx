// src/pages/PropertyForm.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const PropertyForm = () => {
  const navigate = useNavigate();

  // State for input fields
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [floorArea, setFloorArea] = useState(0);
  const [propertyAge, setPropertyAge] = useState(0);
  const [locationIndex, setLocationIndex] = useState(0);

  const handlePredict = () => {
    // Pass the prediction input data via state
    navigate("/prediction-result", {
      state: { bedrooms, bathrooms, floorArea, propertyAge, locationIndex },
    });
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
        <Heading mb={6} textAlign="center">
          Property Input Form
        </Heading>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Bedrooms</FormLabel>
            <NumberInput
              min={0}
              value={bedrooms}
              onChange={(value) => setBedrooms(Number(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Bathrooms</FormLabel>
            <NumberInput
              min={0}
              value={bathrooms}
              onChange={(value) => setBathrooms(Number(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Floor Area (sqm)</FormLabel>
            <NumberInput
              min={0}
              value={floorArea}
              onChange={(value) => setFloorArea(Number(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Property Age (years)</FormLabel>
            <NumberInput
              min={0}
              value={propertyAge}
              onChange={(value) => setPropertyAge(Number(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Location Index</FormLabel>
            <NumberInput
              min={0}
              value={locationIndex}
              onChange={(value) => setLocationIndex(Number(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <Button colorScheme="teal" w="full" onClick={handlePredict}>
            Predict Price
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default PropertyForm;
