import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ReactNode } from "react";

// Animated background component with floating particles and gradients
const float = keyframes`
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-30px) translateX(20px);
  }
  66% {
    transform: translateY(30px) translateX(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface AnimatedBackgroundProps {
  children: ReactNode;
}

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  return (
    <Box
      position="relative"
      minH="100vh"
      w="100vw"
      overflow="hidden"
      bg="#0a0e1a"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(6, 182, 212, 0.05) 100%)
        `,
        backgroundAttachment: "fixed",
        zIndex: 0,
      }}
    >
      {/* Floating particles */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="4px"
        h="4px"
        bg="cyan.400"
        borderRadius="full"
        boxShadow="0 0 10px rgba(6, 182, 212, 0.8)"
        animation={`${float} 6s ease-in-out infinite`}
        zIndex={1}
        opacity={0.6}
      />
      <Box
        position="absolute"
        top="30%"
        right="15%"
        w="6px"
        h="6px"
        bg="cyan.400"
        borderRadius="full"
        boxShadow="0 0 15px rgba(6, 182, 212, 0.8)"
        animation={`${float} 8s ease-in-out infinite`}
        zIndex={1}
        opacity={0.5}
      />
      <Box
        position="absolute"
        bottom="20%"
        left="20%"
        w="5px"
        h="5px"
        bg="cyan.400"
        borderRadius="full"
        boxShadow="0 0 12px rgba(6, 182, 212, 0.8)"
        animation={`${float} 7s ease-in-out infinite`}
        zIndex={1}
        opacity={0.4}
      />
      <Box
        position="absolute"
        top="50%"
        right="30%"
        w="3px"
        h="3px"
        bg="cyan.300"
        borderRadius="full"
        boxShadow="0 0 8px rgba(6, 182, 212, 0.8)"
        animation={`${float} 9s ease-in-out infinite`}
        zIndex={1}
        opacity={0.5}
      />

      {/* Grid pattern overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundImage="linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)"
        backgroundSize="50px 50px"
        opacity={0.5}
        zIndex={1}
      />

      {/* Pulsing circles */}
      <Box
        position="absolute"
        top="25%"
        right="10%"
        w="200px"
        h="200px"
        borderRadius="full"
        border="1px solid"
        borderColor="cyan.500"
        opacity={0.1}
        animation={`${pulse} 4s ease-in-out infinite`}
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom="15%"
        left="10%"
        w="150px"
        h="150px"
        borderRadius="full"
        border="1px solid"
        borderColor="cyan.400"
        opacity={0.08}
        animation={`${pulse} 5s ease-in-out infinite`}
        zIndex={1}
      />

      {/* Content */}
      <Box position="relative" zIndex={2}>
        {children}
      </Box>
    </Box>
  );
}

