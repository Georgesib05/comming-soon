import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  Container,
  Badge,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Header = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      position="sticky"
      top={0}
      zIndex={10}
      py={2}
    >
      <Container maxW={'7xl'}>
        <Flex
          color={useColorModeValue('gray.600', 'white')}
          align={'center'}
          justify={'space-between'}
          px={{ base: 4 }}
        >
          <Link to="/">
            <Text
              fontFamily={'heading'}
              fontSize="2xl"
              fontWeight="bold"
              color={useColorModeValue('gray.800', 'white')}
            >
              ILLUSION
            </Text>
          </Link>

          <Stack direction={'row'} spacing={8} align="center">
            <Link to="/">
              <Button
                fontSize={'sm'}
                fontWeight={600}
                variant={'link'}
                color={location.pathname === '/' ? 'black' : 'gray.500'}
                _hover={{ color: 'black' }}
              >
                Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button
                fontSize={'sm'}
                fontWeight={600}
                variant={'link'}
                color={location.pathname === '/shop' ? 'black' : 'gray.500'}
                _hover={{ color: 'black' }}
              >
                Shop
              </Button>
            </Link>
            <Link to="/cart">
              <IconButton
                aria-label={'Shopping Cart'}
                icon={
                  <>
                    <FiShoppingCart />
                    {cartCount > 0 && (
                      <Badge
                        colorScheme="red"
                        position="absolute"
                        top="-1"
                        right="-1"
                        fontSize="xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </>
                }
                variant={'ghost'}
                _hover={{ bg: 'gray.100' }}
              />
            </Link>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;