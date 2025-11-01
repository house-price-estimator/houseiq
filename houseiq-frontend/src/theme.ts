import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#e6fffa",
      100: "#b2f5ea",
      200: "#81e6d9",
      300: "#4fd1c7",
      400: "#06b6d4", // Bright cyan
      500: "#0891b2",
      600: "#0e7490",
      700: "#155e75",
      800: "#164e63",
      900: "#083344",
    },
    dark: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a", // Deep dark blue
    },
    cyan: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
    },
  },
  fonts: {
    heading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "#0f172a", // Deep dark blue background
        color: "cyan.100",
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      },
      "#root": {
        minHeight: "100vh",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "cyan",
      },
      variants: {
        solid: {
          bg: "cyan.500",
          color: "dark.900",
          _hover: {
            bg: "cyan.400",
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)",
          },
          boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)",
        },
        outline: {
          borderColor: "cyan.500",
          color: "cyan.400",
          _hover: {
            bg: "rgba(6, 182, 212, 0.1)",
            borderColor: "cyan.400",
            boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)",
          },
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "cyan.500",
      },
      variants: {
        filled: {
          bg: "rgba(15, 23, 42, 0.8)",
          border: "1px solid",
          borderColor: "cyan.800",
          color: "cyan.100",
          _hover: {
            borderColor: "cyan.700",
          },
          _focus: {
            borderColor: "cyan.500",
            boxShadow: "0 0 0 1px rgba(6, 182, 212, 0.5)",
          },
          _placeholder: {
            color: "cyan.600",
          },
        },
      },
    },
    NumberInput: {
      parts: ["field", "stepper"],
      defaultProps: {
        focusBorderColor: "cyan.500",
      },
      variants: {
        filled: {
          field: {
            bg: "rgba(15, 23, 42, 0.8)",
            border: "1px solid",
            borderColor: "cyan.800",
            color: "cyan.100",
            _hover: {
              borderColor: "cyan.700",
            },
            _focus: {
              borderColor: "cyan.500",
              boxShadow: "0 0 0 1px rgba(6, 182, 212, 0.5)",
            },
          },
        },
      },
    },
    Box: {
      variants: {
        card: {
          bg: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "cyan.500",
          borderRadius: "xl",
          boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)",
        },
      },
    },
  },
});

export default theme;

