import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto"
    >
      <Container as={Stack} maxW={'7xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Navigation
            </Text>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/cart">Cart</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Legal
            </Text>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Contact Us
            </Text>
            <ChakraLink href="mailto:info.illusionlb@gmail.com">Email: info.illusionlb@gmail.com</ChakraLink>
            <ChakraLink href="tel:+96171904320">Phone: +961 71 904 320</ChakraLink>
          </Stack>

          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Follow Us
            </Text>
            <Stack direction={'row'} spacing={6}>
              <ChakraLink href={'https://www.instagram.com/illusion.leb?igsh=MW8xM2ViMTgwYmpsdg%3D%3D&utm_source=qr'} isExternal>
                <FaInstagram size={24} />
              </ChakraLink>
              <ChakraLink href={'https://www.facebook.com/share/16YqstRy9c/?mibextid=wwXIfr'} isExternal>
                <FaFacebook size={24} />
              </ChakraLink>
            </Stack>
          </Stack>
        </SimpleGrid>

        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          © {new Date().getFullYear()} Illusion. All rights reserved
        </Text>
      </Container>
    </Box>
  );
};

export default Footer; 