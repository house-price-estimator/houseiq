import { Box, Heading, Text, VStack, HStack, Button, Spinner, Center, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { predictionAPI, Prediction } from "../api/client";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import RealEstateTipsFeed from "../components/RealEstateTipsFeed";

export default function HistoryPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setIsLoading(true);
    try {
      const data = await predictionAPI.getPredictions(0, 50);
      setPredictions(data);
    } catch (error: any) {
      toast({
        title: "Failed to Load History",
        description: error.message || "Failed to fetch prediction history",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) {
      return;
    }

    setDeletingId(id);
    try {
      await predictionAPI.deletePrediction(id);
      toast({
        title: "Prediction Deleted",
        description: "Prediction has been deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadPredictions();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete prediction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

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

  // Format property details from features
  const formatPropertyDetails = (features: Record<string, any>): string => {
    const parts = [];
    if (features.bedrooms) parts.push(`${features.bedrooms} Bed`);
    if (features.bathrooms) parts.push(`${features.bathrooms} Bath`);
    if (features.area_sqm) parts.push(`${features.area_sqm} sqm`);
    if (features.age_years !== undefined) parts.push(`${features.age_years} years old`);
    if (features.location_index !== undefined) parts.push(`Location: ${features.location_index}`);
    return parts.join(", ") || "N/A";
  };

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
          maxW="700px"
          gap={6}
          align="stretch"
          borderWidth="1px"
          borderColor="cyan.500"
          boxShadow="0 0 30px rgba(6, 182, 212, 0.3)"
        >
          <Heading size="xl" textAlign="center" color="cyan.400" textShadow="0 0 10px rgba(6, 182, 212, 0.5)">
            Prediction History
          </Heading>
          <Text textAlign="center" color="cyan.200" fontSize="sm" mb={2}>
            View your past property price predictions
          </Text>

          {isLoading ? (
            <Center py={8}>
              <Spinner size="xl" color="cyan.500" thickness="4px" />
            </Center>
          ) : predictions.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="cyan.300" mb={4}>No prediction history yet.</Text>
              <Button
                colorScheme="cyan"
                onClick={() => navigate("/property-form")}
              >
                Create Your First Prediction
              </Button>
            </Box>
          ) : (
            <VStack gap={4} align="stretch">
              {predictions.map((prediction) => (
                <Box
                  key={prediction.id}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="cyan.800"
                  bg="rgba(15, 23, 42, 0.6)"
                  _hover={{ bg: "rgba(15, 23, 42, 0.8)", borderColor: "cyan.600", boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)" }}
                  transition="all 0.2s"
                  position="relative"
                >
                  <VStack align="stretch" gap={3}>
                    {/* Predicted Price */}
                    <HStack justifyContent="space-between" flexWrap="wrap">
                      <Text fontWeight="semibold" color="cyan.300" fontSize="sm">
                        Predicted Price
                      </Text>
                      <Text color="cyan.400" fontWeight="bold" fontSize="xl" textShadow="0 0 10px rgba(6, 182, 212, 0.5)">
                        {formatPrice(prediction.predictedPrice)}
                      </Text>
                    </HStack>

                    {/* Property Details */}
                    <HStack justifyContent="space-between" flexWrap="wrap">
                      <Text fontWeight="semibold" color="cyan.300" fontSize="sm">
                        Property Details
                      </Text>
                      <Text color="cyan.200" fontWeight="medium" textAlign="right">
                        {formatPropertyDetails(prediction.features || {})}
                      </Text>
                    </HStack>

                    {/* Date/Time */}
                    <HStack justifyContent="space-between" flexWrap="wrap">
                      <Text fontWeight="semibold" color="cyan.300" fontSize="sm">
                        Created
                      </Text>
                      <Text color="cyan.300" fontSize="sm">
                        {formatDate(prediction.createdAt)}
                      </Text>
                    </HStack>

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      w="full"
                      size="md"
                      onClick={() => handleDelete(prediction.id)}
                      isLoading={deletingId === prediction.id}
                      borderColor="cyan.500"
                      color="cyan.400"
                      _hover={{
                        bg: "rgba(6, 182, 212, 0.1)",
                        borderColor: "cyan.400",
                        boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)",
                      }}
                      mt={2}
                    >
                      Delete Prediction
                    </Button>
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}

          {/* Back Button */}
          <Button
            colorScheme="cyan"
            w="full"
            size="lg"
            onClick={() => navigate("/dashboard")}
            fontWeight="semibold"
            mt={4}
          >
            Back to Dashboard
          </Button>
        </VStack>
      </Box>
      </Box>
      <RealEstateTipsFeed />
    </AnimatedBackground>
  );
}
