import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const Privacy = () => {
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
              Privacy Policy
            </Heading>
            
            <Text fontSize="md" color={textColor}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>

            <VStack spacing={8} align="start" w="full">
              <Box>
                <Heading size="md" mb={4}>1. Information We Collect</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    When you use our fashion e-commerce platform, we collect:
                  </Text>
                  <Text color={textColor} pl={4}>• Personal information (name, email, shipping address)</Text>
                  <Text color={textColor} pl={4}>• Payment information (processed securely through our payment providers)</Text>
                  <Text color={textColor} pl={4}>• Size preferences and shopping history</Text>
                  <Text color={textColor} pl={4}>• Device information and browsing behavior</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>2. How We Use Your Information</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>We use your information to:</Text>
                  <Text color={textColor} pl={4}>• Process and fulfill your orders</Text>
                  <Text color={textColor} pl={4}>• Provide personalized shopping recommendations</Text>
                  <Text color={textColor} pl={4}>• Send order updates and shipping notifications</Text>
                  <Text color={textColor} pl={4}>• Improve our product offerings and user experience</Text>
                  <Text color={textColor} pl={4}>• Prevent fraud and maintain security</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>3. Information Sharing</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    We share your information only with:
                  </Text>
                  <Text color={textColor} pl={4}>• Shipping partners to deliver your orders</Text>
                  <Text color={textColor} pl={4}>• Payment processors to handle transactions</Text>
                  <Text color={textColor} pl={4}>• Analytics providers to improve our service</Text>
                  <Text color={textColor}>
                    We never sell your personal data to third parties for marketing purposes.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>4. Data Protection</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    We implement industry-standard security measures:
                  </Text>
                  <Text color={textColor} pl={4}>• SSL/TLS encryption for all data transmission</Text>
                  <Text color={textColor} pl={4}>• Secure payment processing</Text>
                  <Text color={textColor} pl={4}>• Regular security audits</Text>
                  <Text color={textColor} pl={4}>• Limited employee access to personal data</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>5. Your Rights</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>You have the right to:</Text>
                  <Text color={textColor} pl={4}>• Access your personal data</Text>
                  <Text color={textColor} pl={4}>• Correct inaccurate information</Text>
                  <Text color={textColor} pl={4}>• Request deletion of your data</Text>
                  <Text color={textColor} pl={4}>• Opt-out of marketing communications</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>6. Cookies and Tracking</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    We use cookies and similar technologies to:
                  </Text>
                  <Text color={textColor} pl={4}>• Remember your preferences</Text>
                  <Text color={textColor} pl={4}>• Maintain your shopping cart</Text>
                  <Text color={textColor} pl={4}>• Analyze site usage</Text>
                  <Text color={textColor} pl={4}>• Provide personalized experiences</Text>
                </VStack>
              </Box>

              <Box>
                <Heading size="md" mb={4}>7. Contact Us</Heading>
                <VStack spacing={3} align="start">
                  <Text color={textColor}>
                    For privacy-related inquiries, contact us at:
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

export default Privacy; 