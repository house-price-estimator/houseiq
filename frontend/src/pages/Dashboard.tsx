import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const username = "Verona";
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh" // full viewport height
      w="100vw" // full viewport width
      display="flex"
      alignItems="center" // vertical center
      justifyContent="center" // horizontal center
      bg="gray.100"
    >
      <VStack
        bg="white"
        p="10"
        rounded="2xl"
        shadow="lg"
        w="full"
        maxW="400px"
        gap="6"
        align="stretch"
      >
        <Heading size="2xl" textAlign="center">
          HouseIQ
        </Heading>
        <Text fontSize="xl" textAlign="center">
          Welcome Back, {username}
        </Text>
        <VStack gap="4" align="stretch">
          <Button
            colorScheme="teal"
            w="full"
            onClick={() => navigate("/property-form")}
          >
            Estimate New Property Price
          </Button>
          <Button
            variant="outline"
            w="full"
            onClick={() => navigate("/history")}
          >
            View History
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
