import { Box, Container } from '@chakra-ui/react';

const Banner = () => {
  return (
    <Box
      bg="blue.500"
      color="white"
      py={2}
      textAlign="center"
      fontWeight="bold"
      fontSize="lg"
    >
      <Container maxW="container.xl">
        Buy two t-shirts for $35 and enjoy free delivery all over Lebanon! 🚚
      </Container>
    </Box>
  );
};

export default Banner; 