import { Box, HStack, VStack, Button, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  showLogout?: boolean;
}

// Logo 1: HouseIQ with roof icon above "ouse"
const Logo1 = ({ size = "32px" }: { size?: string }) => (
  <HStack spacing={2} align="center">
    <Box position="relative" display="inline-block">
      {/* Roof icon */}
      <Box
        position="absolute"
        top="-8px"
        left="50%"
        transform="translateX(-50%)"
        width="24px"
        height="12px"
        borderTop="2px solid"
        borderLeft="2px solid"
        borderRight="2px solid"
        borderColor="cyan.400"
        borderTopRadius="2px"
        boxShadow="0 0 10px rgba(6, 182, 212, 0.5)"
      />
      {/* HouseIQ text */}
      <Box
        fontSize="xl"
        fontWeight="bold"
        color="cyan.400"
        textShadow="0 0 10px rgba(6, 182, 212, 0.5)"
        letterSpacing="tight"
      >
        HouseIQ
      </Box>
    </Box>
  </HStack>
);

// Logo 2: House with HQ inside + HouseIQ text below
const Logo2 = ({ size = "40px" }: { size?: string }) => (
  <VStack spacing={1} align="center">
    {/* House icon with HQ */}
    <Box position="relative" mb={1}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        {/* House outline */}
        <path
          d="M24 8 L8 20 L8 40 L18 40 L18 28 L30 28 L30 40 L40 40 L40 20 Z"
          fill="none"
          stroke="rgba(6, 182, 212, 1)"
          strokeWidth="2"
          filter="drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))"
        />
        {/* HQ text inside */}
        <text
          x="24"
          y="28"
          fontSize="14"
          fontWeight="bold"
          fill="rgba(6, 182, 212, 1)"
          textAnchor="middle"
          filter="drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))"
        >
          HQ
        </text>
      </svg>
    </Box>
    {/* HouseIQ text */}
    <Box
      fontSize="sm"
      fontWeight="semibold"
      color="cyan.400"
      textShadow="0 0 8px rgba(6, 182, 212, 0.5)"
      letterSpacing="tight"
    >
      HouseIQ
    </Box>
  </VStack>
);

export default function Navbar({ showLogout = true }: NavbarProps) {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      w="100%"
      px={6}
      py={4}
      bg="rgba(15, 23, 42, 0.8)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="cyan.500"
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="0 4px 20px rgba(6, 182, 212, 0.2)"
    >
      <HStack justify="space-between" align="center">
        <Button
          variant="ghost"
          onClick={handleLogoClick}
          _hover={{ bg: "rgba(6, 182, 212, 0.1)" }}
          p={2}
          h="auto"
        >
          <Logo1 />
        </Button>

        {showLogout && isAuthenticated && (
          <Button
            variant="outline"
            colorScheme="cyan"
            onClick={handleLogout}
            borderColor="cyan.500"
            color="cyan.400"
            _hover={{
              bg: "rgba(6, 182, 212, 0.1)",
              borderColor: "cyan.400",
              boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)",
            }}
          >
            Logout
          </Button>
        )}
      </HStack>
    </Box>
  );
}
