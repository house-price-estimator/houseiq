// src/pages/PropertyForm.tsx
import { useState } from "react";
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
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { predictionAPI } from "../api/client";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import RealEstateTipsFeed from "../components/RealEstateTipsFeed";

const PropertyForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // State for input fields
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [floorArea, setFloorArea] = useState(0);
  const [propertyAge, setPropertyAge] = useState(0);
  const [locationIndex, setLocationIndex] = useState(0);

  const handlePredict = async () => {
    // Validation
    if (bedrooms < 1 || bedrooms > 7) {
      toast({
        title: "Validation Error",
        description: "Bedrooms must be between 1 and 7",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (bathrooms < 1 || bathrooms > 5) {
      toast({
        title: "Validation Error",
        description: "Bathrooms must be between 1 and 5",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (floorArea <= 0 || floorArea > 1000) {
      toast({
        title: "Validation Error",
        description: "Floor area must be between 1 and 1000 sqm",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (propertyAge < 0 || propertyAge > 120) {
      toast({
        title: "Validation Error",
        description: "Property age must be between 0 and 120 years",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (locationIndex < 0 || locationIndex > 99) {
      toast({
        title: "Validation Error",
        description: "Location index must be between 0 and 99",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await predictionAPI.createPrediction({
        bedrooms,
        bathrooms,
        floorArea,
        area_sqm: floorArea,
        propertyAge,
        age_years: propertyAge,
        locationIndex,
        location_index: locationIndex,
      });

      // Navigate to prediction result with the response data
      navigate("/prediction-result", {
        state: {
          prediction: response,
          input: { bedrooms, bathrooms, floorArea, propertyAge, locationIndex },
        },
      });
    } catch (error: any) {
      toast({
        title: "Prediction Failed",
        description: error.message || "Failed to get prediction. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <Box minH="100vh" w="100vw">
        <Navbar />
        <Flex minH="calc(100vh - 80px)" align="center" justify="center" px="4" py="8" pb="120px">
        <Box
          p={8}
          bg="rgba(15, 23, 42, 0.9)"
          backdropFilter="blur(10px)"
          borderWidth={1}
          borderRadius="2xl"
          borderColor="cyan.500"
          boxShadow="0 0 30px rgba(6, 182, 212, 0.3)"
          w="full"
          maxW="500px"
        >
          <Heading mb={2} textAlign="center" color="cyan.400" size="lg" textShadow="0 0 10px rgba(6, 182, 212, 0.5)">
            Property Input Form
          </Heading>
          <Text mb={6} textAlign="center" color="cyan.200" fontSize="sm">
            Enter the property details to get an accurate price estimate
          </Text>
          <VStack spacing={5}>
            <FormControl>
              <FormLabel color="cyan.300" fontWeight="semibold">
                Bedrooms (1-7)
              </FormLabel>
              <NumberInput
                min={1}
                max={7}
                value={bedrooms}
                onChange={(value: string) => setBedrooms(Number(value))}
                size="lg"
              >
                <NumberInputField 
                  borderColor="cyan.500"
                  _focus={{ borderColor: "cyan.500" }}
                  color="cyan.100"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper color="cyan.400" />
                  <NumberDecrementStepper color="cyan.400" />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel color="cyan.300" fontWeight="semibold">
                Bathrooms (1-5)
              </FormLabel>
              <NumberInput
                min={1}
                max={5}
                value={bathrooms}
                onChange={(value: string) => setBathrooms(Number(value))}
                size="lg"
              >
                <NumberInputField 
                  borderColor="cyan.500"
                  _focus={{ borderColor: "cyan.500" }}
                  color="cyan.100"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper color="cyan.400" />
                  <NumberDecrementStepper color="cyan.400" />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel color="cyan.300" fontWeight="semibold">
                Floor Area (sqm) (1-1000)
              </FormLabel>
              <NumberInput
                min={1}
                max={1000}
                precision={2}
                value={floorArea}
                onChange={(value: string) => setFloorArea(Number(value))}
                size="lg"
              >
                <NumberInputField 
                  borderColor="cyan.500"
                  _focus={{ borderColor: "cyan.500" }}
                  color="cyan.100"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper color="cyan.400" />
                  <NumberDecrementStepper color="cyan.400" />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel color="cyan.300" fontWeight="semibold">
                Property Age (years) (0-120)
              </FormLabel>
              <NumberInput
                min={0}
                max={120}
                value={propertyAge}
                onChange={(value: string) => setPropertyAge(Number(value))}
                size="lg"
              >
                <NumberInputField 
                  borderColor="cyan.500"
                  _focus={{ borderColor: "cyan.500" }}
                  color="cyan.100"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper color="cyan.400" />
                  <NumberDecrementStepper color="cyan.400" />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel color="cyan.300" fontWeight="semibold">
                Location Index (0-10)
              </FormLabel>
              <NumberInput
                min={0}
                max={99}
                value={locationIndex}
                onChange={(value: string) => setLocationIndex(Number(value))}
                size="lg"
              >
                <NumberInputField 
                  borderColor="cyan.500"
                  _focus={{ borderColor: "cyan.500" }}
                  color="cyan.100"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper color="cyan.400" />
                  <NumberDecrementStepper color="cyan.400" />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <VStack w="full" gap={3} mt={4}>
              <Button 
                colorScheme="cyan" 
                w="full" 
                size="lg"
                onClick={handlePredict}
                fontWeight="semibold"
                isLoading={isLoading}
                loadingText="Predicting..."
              >
                Predict Price
              </Button>
              <Button
                variant="outline"
                w="full"
                size="lg"
                onClick={() => navigate("/dashboard")}
                borderColor="cyan.500"
                color="cyan.400"
                _hover={{ bg: "rgba(6, 182, 212, 0.1)" }}
                disabled={isLoading}
              >
                Cancel
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

export default PropertyForm;
