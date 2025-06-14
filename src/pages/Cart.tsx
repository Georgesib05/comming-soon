import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Divider,
  useColorModeValue,
  Flex,
  Tag,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
  AlertDescription,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getDiscountAmount,
    getCodeDiscountAmount,
    applyDiscountCode,
    removeDiscountCode,
    activeDiscountCode 
  } = useCart();
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const navigate = useNavigate();
  const toast = useToast();
  const [discountCode, setDiscountCode] = useState('');

  // Calculate subtotal and discounts
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tshirtDiscount = getDiscountAmount();
  const codeDiscount = getCodeDiscountAmount();
  const total = getCartTotal();

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a discount code',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = applyDiscountCode(discountCode);
    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      status: result.success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });

    if (result.success) {
      setDiscountCode('');
    }
  };

  return (
    <Box py={8}>
      <Container maxW={'7xl'}>
        <VStack spacing={8} align="start">
          <Heading size="xl">Shopping Cart</Heading>
          
          {cartItems.length === 0 ? (
            <Text fontSize="lg">Your cart is empty</Text>
          ) : (
            <>
              {cartItems.map((item) => (
                <Box
                  key={item.cartItemId}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="white"
                  w="full"
                  _dark={{bg: 'gray.800'}}
                >
                  <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    gap={6}
                    justify="space-between"
                    align={{ base: 'stretch', sm: 'center' }}
                  >
                    <HStack spacing={4}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="semibold">
                          {item.name}
                        </Text>
                        <Text color={textColor}>
                          ${item.price.toFixed(2)}
                        </Text>
                        <Wrap spacing={2} mt={2}>
                          {item.sizes.map((size, index) => (
                            <WrapItem key={index}>
                              <Tag size="sm" variant="outline">
                                Size {index + 1}: {size}
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </VStack>
                    </HStack>
                    
                    <Flex
                      direction={{ base: 'row', sm: 'row' }}
                      justify={{ base: 'space-between', sm: 'flex-end' }}
                      align="center"
                      gap={4}
                      mt={{ base: 4, sm: 0 }}
                    >
                      <HStack>
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                        >
                          -
                        </Button>
                        <Text px={4}>
                          {item.quantity}
                        </Text>
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                        >
                          +
                        </Button>
                      </HStack>
                      <Button
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.cartItemId)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              ))}

              <Divider />

              {/* Discount Code Section */}
              <Box w="full">
                <VStack spacing={4} align="stretch">
                  <InputGroup size="md">
                    <Input
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      pr="4.5rem"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleApplyDiscount}
                        isDisabled={!discountCode.trim()}
                      >
                        Apply
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  {activeDiscountCode && (
                    <Alert status="success" borderRadius="md">
                      <AlertIcon />
                      <AlertDescription>
                        {activeDiscountCode.code} applied! Saving {activeDiscountCode.percentage}% (up to ${activeDiscountCode.maxDiscount})
                      </AlertDescription>
                      <Button
                        size="sm"
                        variant="ghost"
                        ml="auto"
                        onClick={removeDiscountCode}
                      >
                        Remove
                      </Button>
                    </Alert>
                  )}
                </VStack>
              </Box>

              <Box w="full">
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between" fontSize="lg">
                    <Text>Subtotal:</Text>
                    <Text>${subtotal.toFixed(2)}</Text>
                  </HStack>

                  {tshirtDiscount > 0 && (
                    <HStack justify="space-between" fontSize="lg" color="green.500">
                      <Text>T-shirt Discount:</Text>
                      <Text>-${tshirtDiscount.toFixed(2)}</Text>
                    </HStack>
                  )}

                  {codeDiscount > 0 && (
                    <HStack justify="space-between" fontSize="lg" color="green.500">
                      <Text>Code Discount:</Text>
                      <Text>-${codeDiscount.toFixed(2)}</Text>
                    </HStack>
                  )}

                  <Divider />

                  <HStack justify="space-between" fontSize="lg" fontWeight="semibold">
                    <Text>Total:</Text>
                    <Text>${total.toFixed(2)}</Text>
                  </HStack>
                </VStack>
              </Box>

              <Button
                colorScheme="blackAlpha"
                size="lg"
                w={{ base: "full", md: "auto" }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Cart; 