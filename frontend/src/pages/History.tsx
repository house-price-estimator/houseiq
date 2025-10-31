import { Box, Heading, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();

  // Mock data for demonstration
  const historyData = [
    {
      propertyDetails: "3 Bed, 2 Bath, 1500 sqft, Springfield",
      predictedPrice: "$320,000",
      dateTime: "2025-10-14 14:30",
    },
    {
      propertyDetails: "2 Bed, 1 Bath, 900 sqft, Shelbyville",
      predictedPrice: "$210,000",
      dateTime: "2025-10-13 11:15",
    },
  ];

  return (
    <Box
      minH="100vh"
      w="100vw"
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
        maxW="600px"
        gap="6"
        align="stretch"
      >
        <Heading size="xl" textAlign="center">
          History
        </Heading>

        <VStack gap="4" align="stretch">
          {historyData.map((item, index) => (
            <VStack
              key={index}
              p="4"
              borderWidth="1px"
              rounded="md"
              align="stretch"
              gap="3"
            >
              {/* Property Details */}
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">Property Details</Text>
                <Text>{item.propertyDetails}</Text>
              </HStack>

              {/* Predicted Price */}
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">Predicted Price</Text>
                <Text>{item.predictedPrice}</Text>
              </HStack>

              {/* Date/Time */}
              <HStack justifyContent="space-between">
                <Text fontWeight="bold">Date/Time</Text>
                <Text>{item.dateTime}</Text>
              </HStack>
            </VStack>
          ))}
        </VStack>

        {/* Back Button */}
        <Button
          colorScheme="teal"
          w="full"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </VStack>
    </Box>
  );
}
