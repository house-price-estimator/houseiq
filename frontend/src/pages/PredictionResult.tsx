import { Box, Heading, Text } from "@chakra-ui/react";

export default function PredictionResult() {
  return (
    <Box p={8}>
      <Heading mb={4}>Prediction Result</Heading>
      <Text>The predicted house price will be displayed here.</Text>
    </Box>
  );
}
