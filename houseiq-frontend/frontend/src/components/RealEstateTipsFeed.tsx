import { Box, Text, HStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";

interface RealEstateTip {
  id: number;
  title: string;
  content: string;
  icon: string;
}

const tips: RealEstateTip[] = [
  {
    id: 1,
    title: "Location Matters Most",
    content: "Properties within 500m of public transport stations can see up to 20% higher values.",
    icon: "📍",
  },
  {
    id: 2,
    title: "Energy Efficiency",
    content: "Homes with solar panels and energy-efficient features can increase property value by 3-5%.",
    icon: "☀️",
  },
  {
    id: 3,
    title: "Natural Light",
    content: "Properties with north-facing windows can command premium prices due to better natural lighting.",
    icon: "💡",
  },
  {
    id: 4,
    title: "School Districts",
    content: "Homes near top-rated schools can see property values increase by 10-20%.",
    icon: "🏫",
  },
  {
    id: 5,
    title: "Outdoor Space",
    content: "Properties with gardens or patios can add 5-10% to a home's value, especially in urban areas.",
    icon: "🌳",
  },
  {
    id: 6,
    title: "Parking Premium",
    content: "Off-street parking can add significant value, especially in densely populated areas.",
    icon: "🚗",
  },
  {
    id: 7,
    title: "Kitchen & Bathrooms",
    content: "Updated kitchens and bathrooms are among the top features that increase property values.",
    icon: "🛁",
  },
  {
    id: 8,
    title: "Property Age",
    content: "Newer properties typically have lower maintenance costs but older homes may have more character.",
    icon: "🏛️",
  },
];

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

export default function RealEstateTipsFeed() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        setIsTransitioning(false);
      }, 300);
    }, 8000); // Change tip every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTip = tips[currentTipIndex];

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="rgba(15, 23, 42, 0.95)"
      backdropFilter="blur(10px)"
      borderTop="1px solid"
      borderColor="cyan.500"
      px={6}
      py={4}
      zIndex={100}
      boxShadow="0 -4px 20px rgba(6, 182, 212, 0.3)"
    >
      <HStack
        justify="center"
        align="center"
        spacing={4}
        animation={isTransitioning ? `${slideOut} 0.3s ease-out` : `${slideIn} 0.3s ease-in`}
      >
        <Text fontSize="2xl">{currentTip.icon}</Text>
        <Box flex={1} maxW="800px">
          <Text fontSize="sm" fontWeight="bold" color="cyan.400" mb={1}>
            Did you know?
          </Text>
          <Text fontSize="sm" color="cyan.200">
            <strong>{currentTip.title}:</strong> {currentTip.content}
          </Text>
        </Box>
        <HStack spacing={2}>
          {tips.map((_, index) => (
            <Box
              key={index}
              w="8px"
              h="8px"
              borderRadius="full"
              bg={index === currentTipIndex ? "cyan.500" : "cyan.800"}
              transition="all 0.3s"
              boxShadow={index === currentTipIndex ? "0 0 8px rgba(6, 182, 212, 0.6)" : "none"}
            />
          ))}
        </HStack>
      </HStack>
    </Box>
  );
}

