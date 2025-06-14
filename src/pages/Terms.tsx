import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const Terms = () => {
  const borderColor = useColorModeValue('black', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Box py={12} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW={'5xl'}>
        <Box
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={8}
          bg={bgColor}
          boxShadow="lg"
        >
          <VStack spacing={8} align="start">
            <Heading size="xl" borderBottom="2px" borderColor={borderColor} pb={4} w="full">
              Terms of Service
            </Heading>
            
            <Text fontSize="md" color={textColor}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>

            <VStack spacing={8} align="start" w="full">
              <Box>
                <Heading size="md" mb={4}>1. Acceptance of Terms</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    By accessing and using the Illusion website and services, you agree to be bound by these Terms of Service, our Privacy Policy, and any additional terms and conditions that may apply.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>2. Product Information</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    We strive to display our products as accurately as possible. However:
                  </Text>
                  <Text color={textColor} pl={4}>• Colors may vary depending on your device's display</Text>
                  <Text color={textColor} pl={4}>• All measurements are approximate</Text>
                  <Text color={textColor} pl={4}>• Products are subject to availability</Text>
                  <Text color={textColor} pl={4}>• We reserve the right to discontinue any product</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>3. Pricing and Payment</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    Regarding pricing and payments:
                  </Text>
                  <Text color={textColor} pl={4}>• All prices are in [Currency] and include applicable taxes</Text>
                  <Text color={textColor} pl={4}>• We reserve the right to change prices without notice</Text>
                  <Text color={textColor} pl={4}>• Payment is required prior to shipping</Text>
                  <Text color={textColor} pl={4}>• We use secure payment processors to protect your information</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>4. Shipping and Returns</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>Our shipping and returns policy:</Text>
                  <Text color={textColor} pl={4}>• Delivery times are estimates only</Text>
                  <Text color={textColor} pl={4}>• Returns must be initiated within 14 days of delivery</Text>
                  <Text color={textColor} pl={4}>• Items must be unworn with original tags attached</Text>
                  <Text color={textColor} pl={4}>• Return shipping costs may apply</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>5. Intellectual Property</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    All content on this website, including but not limited to:
                  </Text>
                  <Text color={textColor} pl={4}>• Product designs and images</Text>
                  <Text color={textColor} pl={4}>• Logo and branding elements</Text>
                  <Text color={textColor} pl={4}>• Website design and content</Text>
                  <Text color={textColor}>
                    Are protected by copyright and other intellectual property rights owned by Illusion.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>6. Account Responsibilities</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>You are responsible for:</Text>
                  <Text color={textColor} pl={4}>• Maintaining account confidentiality</Text>
                  <Text color={textColor} pl={4}>• Providing accurate information</Text>
                  <Text color={textColor} pl={4}>• All activities under your account</Text>
                  <Text color={textColor} pl={4}>• Notifying us of unauthorized access</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>7. Limitation of Liability</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    Illusion shall not be liable for:
                  </Text>
                  <Text color={textColor} pl={4}>• Indirect or consequential damages</Text>
                  <Text color={textColor} pl={4}>• Loss of profits or data</Text>
                  <Text color={textColor} pl={4}>• Service interruptions</Text>
                  <Text color={textColor} pl={4}>• Damages exceeding purchase amount</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>8. Governing Law</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    These terms are governed by the laws of [Your Jurisdiction]. Any disputes shall be resolved in the courts of [Your Jurisdiction].
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>9. Contact Information</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    For any questions regarding these terms, contact us at:
                  </Text>
                  <Text color={textColor} fontWeight="medium">Email: info.illusionlb@gmail.com</Text>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Terms; 