import {
  Box,
  Container,
  SimpleGrid,
  Input,
  Select,
  VStack,
  Text,
  Image,
  Button,
  useColorModeValue,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Wrap,
  WrapItem,
  Heading,
  Divider,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Flex,
  IconButton,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  useBreakpointValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

// Updated product interface
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  dateAdded: Date;
  isPopular?: boolean;
  availableSizes: string[];
}

interface CartProduct extends Product {
  sizes: string[];
  quantity: number;
}

// Mock product data
const initialProducts = [
  {
    id: 1,
    name: 'Ocular Trap T-Shirt',
    price: 19.99,
    image: '/Ocular-trap.png',
    category: 'T-Shirts',
    dateAdded: new Date('2024-03-15'),
    isPopular: true,
    availableSizes: ['S', 'M', 'L']
  },
  {
    id: 2,
    name: 'Visual Trap T-Shirt',
    price: 19.99,
    image: '/visual-trap.png',
    category: 'T-Shirts',
    dateAdded: new Date('2024-03-10'),
    availableSizes: ['S', 'M', 'L']
  },
  
  // Add more products here
];

// Define sort option groups and their conflicts
type SortGroup = 'date' | 'price' | 'name';
type SortOption = 'newest' | 'oldest' | 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a';

const sortGroups: Record<SortGroup, SortOption[]> = {
  date: ['newest', 'oldest'],
  price: ['price-low-high', 'price-high-low'],
  name: ['name-a-z', 'name-z-a']
};

const sortLabels: Record<SortOption, string> = {
  newest: 'Newest to Oldest',
  oldest: 'Oldest to Newest',
  'price-low-high': 'Price: Low to High',
  'price-high-low': 'Price: High to Low',
  'name-a-z': 'Name: A to Z',
  'name-z-a': 'Name: Z to A'
};

interface Quantities {
  [key: number]: number;
}

interface CategoryProductsProps {
  category: string;
  products: Product[];
  cardBgColor: string;
  textColor: string;
  quantities: { [key: number]: number };
  selectedSizes: { [key: number]: string[] };
  sizeErrors: { [key: number]: boolean };
  handleQuantityChange: (productId: number, valueAsString: string, valueAsNumber: number) => void;
  handleQuantityBlur: (productId: number) => void;
  handleSizeChange: (productId: number, index: number, size: string) => void;
  handleAddToCart: (product: Product) => void;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ 
  category, 
  products, 
  cardBgColor, 
  textColor, 
  quantities,
  selectedSizes,
  sizeErrors,
  handleQuantityChange,
  handleQuantityBlur,
  handleSizeChange,
  handleAddToCart
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemWidth = 300; // Width of each product card including gap
  const visibleItems = { base: 1, sm: 2, md: 3, lg: 4 }; // Responsive visible items
  const currentVisibleItems = useBreakpointValue(visibleItems) || 1;
  const maxScroll = Math.max(0, products.length - currentVisibleItems);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setScrollPosition(Math.max(0, scrollPosition - 1));
    } else {
      setScrollPosition(Math.min(maxScroll, scrollPosition + 1));
    }
  };

  const showNavButtons = products.length > currentVisibleItems;

  return (
    <Box key={category} w="full" position="relative">
      <Heading size="lg" mb={6}>{category}</Heading>
      <Flex position="relative" align="center">
        {showNavButtons && scrollPosition > 0 && (
          <IconButton
            aria-label="Scroll left"
            icon={<ChevronLeftIcon boxSize={6} />}
            onClick={() => handleScroll('left')}
            position="absolute"
            left={{ base: "-10px", md: "-16px" }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            rounded="full"
            bg="white"
            boxShadow="lg"
            _hover={{ bg: 'gray.100' }}
            size={{ base: "sm", md: "lg" }}
            display={{ base: "flex" }}
          />
        )}
        
        <Box 
          w="full" 
          overflow="hidden"
          position="relative"
          px={{ base: 2, md: 0 }}
        >
          <Flex
            ref={containerRef}
            gap={6}
            transform={`translateX(-${scrollPosition * itemWidth}px)`}
            transition="transform 0.3s ease-in-out"
            width={`${products.length * itemWidth}px`}
          >
            {products.map((product: Product) => (
              <Box 
                key={product.id}
                flexShrink={0}
                w={`${itemWidth - 24}px`}
              >
                <VStack
                  bg={cardBgColor}
                  p={{ base: 3, md: 4 }}
                  borderRadius="lg"
                  boxShadow="sm"
                  spacing={{ base: 3, md: 4 }}
                  align="start"
                  h="full"
                >
                  <Box position="relative" w="full" pt="100%">
                    <Image
                      src={product.image}
                      alt={product.name}
                      position="absolute"
                      top="0"
                      left="0"
                      w="full"
                      h="full"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    {product.isPopular && (
                      <Box
                        position="absolute"
                        top="10px"
                        right="10px"
                        bg="red.500"
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="sm"
                        fontWeight="bold"
                        transform="rotate(15deg)"
                        boxShadow="md"
                      >
                        Popular
                      </Box>
                    )}
                  </Box>
                  <VStack align="start" spacing={3} flex="1" w="full">
                    <Text 
                      fontSize={{ base: "md", md: "lg" }} 
                      fontWeight="semibold"
                      noOfLines={2}
                    >
                      {product.name}
                    </Text>
                    <Text 
                      color={textColor}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      ${product.price.toFixed(2)}
                    </Text>

                    {/* Updated Quantity Selection */}
                    <FormControl>
                      <FormLabel fontSize="sm">Quantity</FormLabel>
                      <NumberInput
                        size="sm"
                        min={1}
                        max={10}
                        value={quantities[product.id] ?? ''}
                        onChange={(valueString, valueNumber) => 
                          handleQuantityChange(product.id, valueString, valueNumber)
                        }
                        onBlur={() => handleQuantityBlur(product.id)}
                        keepWithinRange={false}
                        clampValueOnBlur={true}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    {/* Multiple Size Selection */}
                    <FormControl isInvalid={sizeErrors[product.id]}>
                      <FormLabel fontSize="sm">
                        {(quantities[product.id] || 1) > 1 ? 'Sizes' : 'Size'}
                      </FormLabel>
                      <Wrap spacing={2}>
                        {Array(quantities[product.id] || 1).fill(null).map((_, index) => (
                          <WrapItem key={index}>
                            <Select
                              value={selectedSizes[product.id]?.[index] || ''}
                              onChange={(e) => handleSizeChange(product.id, index, e.target.value)}
                              placeholder={`Size ${index + 1}`}
                              size="sm"
                              w="100px"
                            >
                              {product.availableSizes.map(size => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </Select>
                          </WrapItem>
                        ))}
                      </Wrap>
                      <FormErrorMessage>Please select sizes for all items</FormErrorMessage>
                    </FormControl>

                    <Button
                      mt="auto"
                      w="full"
                      colorScheme="blackAlpha"
                      size={{ base: "sm", md: "md" }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </Flex>
        </Box>

        {showNavButtons && scrollPosition < maxScroll && (
          <IconButton
            aria-label="Scroll right"
            icon={<ChevronRightIcon boxSize={6} />}
            onClick={() => handleScroll('right')}
            position="absolute"
            right={{ base: "-10px", md: "-16px" }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            rounded="full"
            bg="white"
            boxShadow="lg"
            _hover={{ bg: 'gray.100' }}
            size={{ base: "sm", md: "lg" }}
            display={{ base: "flex" }}
          />
        )}
      </Flex>
      <Divider my={8} />
    </Box>
  );
};

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeSortOptions, setActiveSortOptions] = useState<string[]>([]);
  const [products, setProducts] = useState(initialProducts);
  const [showSupplierAlert, setShowSupplierAlert] = useState(true);
  const { addToCart } = useCart();
  const toast = useToast();

  // Updated state for multiple sizes
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string[] }>({});
  const [quantities, setQuantities] = useState<Quantities>({});
  const [] = useState<{ [key: number]: string }>({});
  const [sizeErrors, setSizeErrors] = useState<{ [key: number]: boolean }>({});
  
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  const categories = Array.from(new Set(initialProducts.map(product => product.category)));

  const handleSortToggle = (sortOption: string) => {
    setActiveSortOptions(prevOptions => {
      // Find which group the selected option belongs to
      const group = Object.entries(sortGroups).find(([_, options]) => 
        options.includes(sortOption as SortOption)
      )?.[0];

      if (!group) return prevOptions;

      // If option was already selected, remove it
      if (prevOptions.includes(sortOption)) {
        return prevOptions.filter(option => option !== sortOption);
      }

      // Remove any active options from the same group and add the new option
      const filteredOptions = prevOptions.filter(option => 
        !sortGroups[group as SortGroup].includes(option as SortOption)
      );
      return [...filteredOptions, sortOption];
    });
  };

  const filterProducts = () => {
    let filtered = [...initialProducts];
    
    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply all active sort options in sequence
    activeSortOptions.forEach(sortBy => {
      switch (sortBy) {
        case 'newest':
          filtered.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
          break;
        case 'oldest':
          filtered.sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime());
          break;
        case 'price-low-high':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-a-z':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-z-a':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    });

    setProducts(filtered);
  };

  // Update filters when search, category, or sort changes
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, activeSortOptions]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setSearchQuery(''); // Reset search when category changes
  };

  const handleSizeChange = (productId: number, index: number, size: string) => {
    setSelectedSizes(prev => {
      const currentSizes = [...(prev[productId] || [])];
      currentSizes[index] = size;
      return { ...prev, [productId]: currentSizes };
    });
    setSizeErrors(prev => ({ ...prev, [productId]: false }));
  };

  const handleQuantityChange = (productId: number, valueAsString: string, valueAsNumber: number) => {
    // Allow empty input while typing
    if (valueAsString === '') {
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[productId];
        return newQuantities;
      });
    } else if (!isNaN(valueAsNumber) && valueAsNumber >= 1) {
      // Update with valid number
      setQuantities(prev => ({ ...prev, [productId]: valueAsNumber }));
      setSelectedSizes(prev => ({
        ...prev,
        [productId]: Array(valueAsNumber).fill('')
      }));
    }
  };

  const handleQuantityBlur = (productId: number) => {
    // Ensure we have a valid number (minimum 1) on blur
    const currentQuantity = quantities[productId];
    const validQuantity = !currentQuantity || currentQuantity < 1 ? 1 : currentQuantity;
    
    setQuantities(prev => ({ ...prev, [productId]: validQuantity }));
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: Array(validQuantity).fill('')
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    const sizes = selectedSizes[product.id] || Array(quantity).fill('');

    // Check if all sizes are selected
    if (sizes.some(size => !size)) {
      setSizeErrors(prev => ({ ...prev, [product.id]: true }));
      toast({
        title: 'Please select sizes for all items',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    const cartProduct: CartProduct = {
      ...product,
      sizes,
      quantity,
    };

    addToCart(cartProduct);
    toast({
      title: 'Added to cart',
      description: `${quantity} x ${product.name} added to your cart`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    });

    // Reset sizes and quantity after adding to cart
    setSelectedSizes(prev => ({ ...prev, [product.id]: [] }));
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const renderProducts = () => {
    if (!selectedCategory) {
      // Group products by category when no category is selected
      return categories.map(category => {
        // Get products for this category
        const categoryProducts = products.filter(product => product.category === category);
        
        // Skip rendering if category has no products
        if (categoryProducts.length === 0) return null;

        return (
          <CategoryProducts
            key={category}
            category={category}
            products={categoryProducts}
            cardBgColor={cardBgColor}
            textColor={textColor}
            quantities={quantities}
            selectedSizes={selectedSizes}
            sizeErrors={sizeErrors}
            handleQuantityChange={handleQuantityChange}
            handleQuantityBlur={handleQuantityBlur}
            handleSizeChange={handleSizeChange}
            handleAddToCart={handleAddToCart}
          />
        );
      });
    }

    // Show filtered products when category is selected
    return (
      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
        spacing={{ base: 4, md: 6, lg: 8 }}
        w="full"
      >
        {products.map(product => (
          <VStack
            key={product.id}
            bg={cardBgColor}
            p={{ base: 3, md: 4 }}
            borderRadius="lg"
            boxShadow="sm"
            spacing={{ base: 3, md: 4 }}
            align="start"
            h="full"
          >
            <Box position="relative" w="full" pt="100%">
              <Image
                src={product.image}
                alt={product.name}
                position="absolute"
                top="0"
                left="0"
                w="full"
                h="full"
                objectFit="cover"
                borderRadius="md"
              />
              {product.isPopular && (
                <Box
                  position="absolute"
                  top="10px"
                  right="10px"
                  bg="red.500"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight="bold"
                  transform="rotate(15deg)"
                  boxShadow="md"
                >
                  Popular
                </Box>
              )}
            </Box>
            <VStack align="start" spacing={3} flex="1" w="full">
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                fontWeight="semibold"
                noOfLines={2}
              >
                {product.name}
              </Text>
              <Text 
                color={textColor}
                fontSize={{ base: "sm", md: "md" }}
              >
                ${product.price.toFixed(2)}
              </Text>

              {/* Updated Quantity Selection */}
              <FormControl>
                <FormLabel fontSize="sm">Quantity</FormLabel>
                <NumberInput
                  size="sm"
                  min={1}
                  max={10}
                  value={quantities[product.id] ?? ''}
                  onChange={(valueString, valueNumber) => 
                    handleQuantityChange(product.id, valueString, valueNumber)
                  }
                  onBlur={() => handleQuantityBlur(product.id)}
                  keepWithinRange={false}
                  clampValueOnBlur={true}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              {/* Multiple Size Selection */}
              <FormControl isInvalid={sizeErrors[product.id]}>
                <FormLabel fontSize="sm">
                  {(quantities[product.id] || 1) > 1 ? 'Sizes' : 'Size'}
                </FormLabel>
                <Wrap spacing={2}>
                  {Array(quantities[product.id] || 1).fill(null).map((_, index) => (
                    <WrapItem key={index}>
                      <Select
                        value={selectedSizes[product.id]?.[index] || ''}
                        onChange={(e) => handleSizeChange(product.id, index, e.target.value)}
                        placeholder={`Size ${index + 1}`}
                        size="sm"
                        w="100px"
                      >
                        {product.availableSizes.map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </Select>
                    </WrapItem>
                  ))}
                </Wrap>
                <FormErrorMessage>Please select sizes for all items</FormErrorMessage>
              </FormControl>

              <Button
                mt="auto"
                w="full"
                colorScheme="blackAlpha"
                size={{ base: "sm", md: "md" }}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
            </VStack>
          </VStack>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Box>
      {showSupplierAlert && (
        <Alert
          status="info"
          variant="subtle"
          bg={useColorModeValue('gray.50', 'gray.800')}
          borderBottom="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          py={3}
        >
          <Container maxW={'7xl'} display="flex" alignItems="center">
            <AlertIcon />
            <AlertDescription fontSize="sm">
              For business inquiries and wholesale opportunities, please contact us at{' '}
              <ChakraLink href="mailto:info.illusionlb@gmail.com">Email: info.illusionlb@gmail.com</ChakraLink>
            </AlertDescription>
            <CloseButton
              position="relative"
              right={-4}
              onClick={() => setShowSupplierAlert(false)}
            />
          </Container>
        </Alert>
      )}
      
      <Box py={{ base: 6, md: 8 }}>
        <Container maxW={'7xl'} px={{ base: 4, md: 8 }}>
          <VStack spacing={{ base: 6, md: 8 }}>
            {/* Search and Filter Section */}
            <Stack 
              w="full" 
              spacing={{ base: 5, md: 4 }}
              direction={{ base: 'column', md: 'row' }}
              align="stretch"
            >
              {/* Category Filter */}
              <FormControl 
                flex={{ md: 1 }}
                minW={{ base: "full", md: "200px" }}
              >
                <FormLabel 
                  display={{ base: 'block', md: 'none' }}
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                >
                  Category
                </FormLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  size="lg"
                  w="full"
                  placeholder="All Categories"
                  bg="white"
                  borderRadius="md"
                  sx={{
                    '@media(max-width: 480px)': {
                      height: '50px',
                      fontSize: '16px', // Prevents iOS zoom
                    }
                  }}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Search Input */}
              <FormControl
                flex={{ md: 2 }}
              >
                <FormLabel 
                  display={{ base: 'block', md: 'none' }}
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                >
                  Search
                </FormLabel>
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  size="lg"
                  w="full"
                  bg="white"
                  borderRadius="md"
                  sx={{
                    '@media(max-width: 480px)': {
                      height: '50px',
                      fontSize: '16px', // Prevents iOS zoom
                    }
                  }}
                />
              </FormControl>

              {/* Sort Options */}
              <FormControl
                flex={{ md: 1 }}
                minW={{ base: "full", md: "200px" }}
              >
                <FormLabel 
                  display={{ base: 'block', md: 'none' }}
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                >
                  Sort By
                </FormLabel>
                <Menu closeOnSelect={false}>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    w="full"
                    h="50px"
                    bg="white"
                    borderWidth={1}
                    borderColor="gray.200"
                    _hover={{ bg: 'gray.50' }}
                    _active={{ bg: 'gray.50' }}
                    fontSize="16px"
                    textAlign="left"
                    px={4}
                    variant="outline"
                    _focus={{
                      boxShadow: 'outline',
                      borderColor: 'blue.500',
                    }}
                    sx={{
                      borderRadius: 'md',
                      boxShadow: 'none',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'gray.300',
                      },
                      '&:active': {
                        borderColor: 'gray.300',
                      }
                    }}
                  >
                    Sort by...
                  </MenuButton>
                  <MenuList 
                    minW="240px"
                    py={2}
                    boxShadow="lg"
                    borderWidth={1}
                    borderColor="gray.200"
                    sx={{
                      '@media(max-width: 480px)': {
                        fontSize: '16px',
                      }
                    }}
                  >
                    <Text px={3} py={2} fontWeight="medium" color="gray.500">
                      Date
                    </Text>
                    <MenuOptionGroup type="checkbox">
                      {sortGroups.date.map(option => (
                        <MenuItemOption
                          key={option}
                          value={option}
                          isChecked={activeSortOptions.includes(option)}
                          onClick={() => handleSortToggle(option)}
                          py={2}
                          sx={{
                            '& .chakra-menu__icon-wrapper': {
                              border: '2px solid',
                              borderColor: 'gray.300',
                              borderRadius: 'base',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bg: 'white',
                              mr: 3,
                              transition: 'all 0.2s',
                              '& > *': {
                                opacity: activeSortOptions.includes(option) ? 1 : 0,
                                transform: activeSortOptions.includes(option) ? 'scale(1)' : 'scale(0.5)',
                                transition: 'all 0.2s'
                              }
                            },
                            '&[data-checked]': {
                              bg: 'transparent',
                              '& .chakra-menu__icon-wrapper': {
                                borderColor: 'gray.500',
                              }
                            },
                            '&:hover': {
                              bg: 'gray.50',
                              '& .chakra-menu__icon-wrapper': {
                                borderColor: 'gray.400'
                              }
                            }
                          }}
                        >
                          {sortLabels[option]}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>

                    <MenuDivider my={2} borderColor="gray.200" />

                    <Text px={3} py={2} fontWeight="medium" color="gray.500">
                      Price
                    </Text>
                    <MenuOptionGroup type="checkbox">
                      {sortGroups.price.map(option => (
                        <MenuItemOption
                          key={option}
                          value={option}
                          isChecked={activeSortOptions.includes(option)}
                          onClick={() => handleSortToggle(option)}
                          py={2}
                          sx={{
                            '& .chakra-menu__icon-wrapper': {
                              border: '2px solid',
                              borderColor: 'gray.300',
                              borderRadius: 'base',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bg: 'white',
                              mr: 3,
                              transition: 'all 0.2s',
                              '& > *': {
                                opacity: activeSortOptions.includes(option) ? 1 : 0,
                                transform: activeSortOptions.includes(option) ? 'scale(1)' : 'scale(0.5)',
                                transition: 'all 0.2s'
                              }
                            },
                            '&[data-checked]': {
                              bg: 'transparent',
                              '& .chakra-menu__icon-wrapper': {
                                borderColor: 'gray.500',
                              }
                            },
                            '&:hover': {
                              bg: 'gray.50',
                              '& .chakra-menu__icon-wrapper': {
                                borderColor: 'gray.400'
                              }
                            }
                          }}
                        >
                          {sortLabels[option]}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>

                    <MenuDivider my={2} borderColor="gray.200" />

                    <Text px={3} py={2} fontWeight="medium" color="gray.500">
                      Name
                    </Text>
                    <MenuOptionGroup type="checkbox">
                      {sortGroups.name.map(option => (
                        <MenuItemOption
                          key={option}
                          value={option}
                          isChecked={activeSortOptions.includes(option)}
                          onClick={() => handleSortToggle(option)}
                          py={2}
                          sx={{
                            '& .chakra-menu__icon-wrapper': {
                              border: '2px solid',
                              borderColor: 'gray.300',
                              borderRadius: 'base',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bg: 'white',
                              mr: 3,
                              transition: 'all 0.2s',
                              '& > *': {
                                opacity: activeSortOptions.includes(option) ? 1 : 0,
                                transform: activeSortOptions.includes(option) ? 'scale(1)' : 'scale(0.5)',
                                transition: 'all 0.2s'
                              }
                            },
                            '&[data-checked]': {
                              bg: 'transparent',
                              '& .chakra-menu__icon-wrapper': {
                                borderColor: 'gray.500',
                              }
                            },
                            '&:hover': {
                              bg: 'gray.50',
                              '& .chakra-menu__icon-wrapper': {
                                borderColor: 'gray.400'
                              }
                            }
                          }}
                        >
                          {sortLabels[option]}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </FormControl>
            </Stack>

            {/* Products Display */}
            {renderProducts()}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Shop; 