import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Flex,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import './Home.css';
import backgroundImage from '../assets/background-1.png';

const AnimatedCounter = ({ end, label }: { end: number; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentCount = Math.round(progress * end);

        if (currentStep === steps) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(currentCount);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [end, isInView]);

  return (
    <VStack ref={ref} spacing={2} flex="1">
      <Text
        fontSize={{ base: "5xl", md: "6xl" }}
        fontWeight="light"
        fontFamily="'Bodoni Moda', serif"
        fontStyle="italic"
        color="black"
        letterSpacing="wide"
      >
        {count}+
      </Text>
      <Text
        fontSize={{ base: "md", md: "lg" }}
        color="gray.700"
        textTransform="uppercase"
        letterSpacing="wider"
        fontWeight="medium"
        textAlign="center"
      >
        {label}
      </Text>
    </VStack>
  );
};

const Home = () => {
  return (
    <Box width="100%">
      {/* Hero Section with Background */}
      <Box
        minHeight={{ base: '100vh', md: '100vh' }}
        position="relative"
        overflow="hidden"
      >
        {/* Background Image */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          overflow="hidden"
        >
          <Image
            src={backgroundImage}
            alt="Background"
            objectFit="cover"
            width={{ base: "100%", md: "100vw" }}
            height={{ base: "100%", md: "100vh" }}
            loading="eager"
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            transform={{ base: "none", md: "scale(1.1)" }}
            transformOrigin="center"
          />
        </Box>

        {/* Hero Content */}
        <Container 
          maxW="container.xl" 
          height="100%" 
          position="relative"
          px={{ base: 4, md: 8 }}
        >
          {/* Top Content */}
          <Flex 
            direction="row" 
            justify={{ base: "center", md: "flex-end" }}
            align="flex-start"
            pt={{ base: 20, md: 8 }}
          >
            {/* Hero Text */}
            <VStack
              spacing={{ base: 4, md: 6 }}
              align={{ base: "center", md: "flex-end" }}
              textAlign={{ base: "center", md: "right" }}
              color="white"
              maxW={{ base: "100%", sm: "400px", md: "500px" }}
              px={{ base: 4, md: 0 }}
            >
              <Heading
                as="h1"
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="normal"
                fontStyle="italic"
                lineHeight="shorter"
                color="black"
                fontFamily="'Bodoni Moda', serif"
                letterSpacing="wide"
              >
                Trap Collection
              </Heading>
            </VStack>
          </Flex>

          {/* Center Button and Social Icons */}
          <Flex
            position="absolute"
            bottom={{ base: "-270%", md: "-250%" }}
            left="50%"
            transform="translateX(-50%)"
            justify="center"
            align="center"
            direction="column"
            gap={6}
          >
            <Link to="/shop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button
                variant="outline"
                size={{ base: "md", md: "lg" }}
                bg="rgba(255, 255, 255, 0.1)"
                color="black"
                borderColor="black"
                borderWidth="1px"
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.3)',
                  borderColor: 'black',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
                _active={{
                  bg: 'rgba(255, 255, 255, 0.4)',
                  transform: 'translateY(1px)',
                }}
                transition="all 0.3s"
                px={{ base: 8, md: 12 }}
                py={{ base: 6, md: 7 }}
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="wider"
                textTransform="uppercase"
                fontWeight="medium"
              >
                Shop Now
              </Button>
            </Link>
            <Flex gap={6}>
              <ChakraLink href={'https://www.instagram.com/illusion.leb?igsh=MW8xM2ViMTgwYmpsdg%3D%3D&utm_source=qr'} isExternal>
                <FaInstagram size={24} color="black" />
              </ChakraLink>
              <ChakraLink href={'https://www.facebook.com/share/16YqstRy9c/?mibextid=wwXIfr'} isExternal>
                <FaFacebook size={24} color="black" />
              </ChakraLink>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Promotional Banner */}
      <Box
        w="100%"
        h={{ base: "100px", md: "80px" }}
        position="relative"
        className="scroll-wrapper"
        zIndex={1}
      >
        <Box className="scroll-container">
          <Box className="scroll-content">
            <Image
              src="/promo-banner.png"
              alt="Promotional Banner"
              loading="eager"
              draggable="false"
            />
          </Box>
          <Box className="scroll-content">
            <Image
              src="/promo-banner.png"
              alt="Promotional Banner"
              loading="eager"
              draggable="false"
            />
          </Box>
          <Box className="scroll-content">
            <Image
              src="/promo-banner.png"
              alt="Promotional Banner"
              loading="eager"
              draggable="false"
            />
          </Box>
          <Box className="scroll-content">
            <Image
              src="/promo-banner.png"
              alt="Promotional Banner"
              loading="eager"
              draggable="false"
            />
          </Box>
          <Box className="scroll-content">
            <Image
              src="/promo-banner.png"
              alt="Promotional Banner"
              loading="eager"
              draggable="false"
            />
          </Box>
        </Box>
      </Box>

      {/* Second Section */}
      <Box
        minHeight={{ base: '100vh', md: '100vh' }}
        position="relative"
        bg="white"
        borderTopRadius={{ base: "xl", md: "3xl" }}
        boxShadow="0px -10px 30px rgba(0,0,0,0.1)"
        marginTop="-10vh"
        width="100%"
        overflow="hidden"
      >
        {/* Spring Collection Section */}
        <Container 
          maxW="container.xl" 
          py={{ base: 12, md: 20 }}
          px={{ base: 4, md: 8 }}
          height="100%"
        >
          <VStack 
            spacing={{ base: 8, md: 12 }} 
            align="center"
            height="100%"
            justify="center"
          >
            <Heading
              as="h2"
              fontSize={{ base: 'xl', sm: '2xl', md: '3xl', lg: '4xl' }}
              textAlign="center"
              mb={{ base: 4, md: 8 }}
              fontFamily="'Bodoni Moda', serif"
              fontStyle="italic"
              px={{ base: 4, md: 0 }}
            >
              Summer 2025 Collection
            </Heading>

            {/* Featured Products Display */}
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={{ base: 8, md: 12 }}
              align="center"
              justify="center"
              w="full"
              px={{ base: 4, md: 0 }}
            >
              <Box 
                flex="1" 
                maxW={{ base: '100%', md: '50%' }}
                h={{ base: '300px', sm: '400px', md: '500px' }}
              >
                <Image
                  src="/visual-trap.png"
                  alt="Trap Collection"
                  borderRadius="xl"
                  w="full"
                  h="full"
                  objectFit="cover"
                  shadow="2xl"
                />
              </Box>
              <VStack
                flex="1"
                align={{ base: 'center', md: 'start' }}
                spacing={{ base: 6, md: 8 }}
                maxW={{ base: '100%', md: '40%' }}
              >
                <Text
                  fontSize={{ base: 'md', sm: 'lg', lg: 'xl' }}
                  color="gray.600"
                  textAlign={{ base: 'center', md: 'left' }}
                  lineHeight="tall"
                >
                  Discover our latest collection featuring unique designs that blend
                  contemporary aesthetics with timeless style. Each piece is crafted
                  to make a statement while maintaining comfort and versatility.
                </Text>
                <Link to="/shop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Button
                    variant="outline"
                    size={{ base: "md", md: "lg" }}
                    borderColor="black"
                    color="black"
                    _hover={{
                      bg: 'black',
                      color: 'white',
                    }}
                    px={{ base: 8, md: 12 }}
                    py={{ base: 6, md: 7 }}
                    fontSize={{ base: "sm", md: "md" }}
                    letterSpacing="wider"
                  >
                    View Collection
                  </Button>
                </Link>
              </VStack>
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        bg="white"
        py={{ base: 16, md: 20 }}
        px={4}
        borderTopWidth="1px"
        borderColor="gray.100"
      >
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 12, md: 20 }}
            justify="center"
            align="center"
            w="full"
          >
            <AnimatedCounter end={1500} label="Monthly Visitors" />
            <AnimatedCounter end={350} label="Happy Customers" />
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }

  @keyframes scrollDown {
    0% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
  }
`;
document.head.appendChild(style);

export default Home; 