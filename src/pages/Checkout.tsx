import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  InputGroup,
  InputLeftAddon,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  HStack,
  Alert,
  AlertIcon,
  AlertDescription,
  Select,
  Flex,
  InputRightElement,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import emailjs from '@emailjs/browser';

// Language translations
const translations = {
  en: {
    title: "Checkout",
    personalInfo: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    contactInfo: "Contact Information",
    phoneNumber: "Phone Number",
    email: "Email",
    deliveryInfo: "Delivery Information",
    address: "Address",
    building: "Building",
    floor: "Floor (Optional)",
    paymentMethod: "Payment Method",
    cod: "Cash on Delivery (COD)",
    orderSummary: "Order Summary",
    totalAmount: "Total Amount",
    subtotal: "Subtotal",
    discount: "Discount",
    confirmOrder: "Confirm Order",
    confirmingOrder: "Confirming Order",
    deliveryRestriction: "Kindly note: For safety reasons, we do not deliver to the following regions: Beqaa (including Baalbek, Hermel, Britel, Yammouneh, Chraawneh, Nabichit, Hortaala, Arsal, Rmaysseh, Khodr, Khreibet, Talya, and Dar Al-Wasaa).",
    orderConfirmed: "Order Confirmed!",
    orderReceived: "Your order has been placed successfully. A confirmation email has been sent to your email address.",
    orderReceivedArabic: "تم استلام طلبك بنجاح. تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني.",
    error: "Error",
    tryAgain: "There was an error placing your order. Please try again.",
    tryAgainArabic: "حدث خطأ أثناء تقديم طلبك. يرجى المحاولة مرة أخرى.",
    language: "Language",
    selectLanguage: "Select Language",
    discountMessage: "You're saving $%s on your t-shirt purchase!"
  },
  ar: {
    title: "الدفع",
    personalInfo: "المعلومات الشخصية",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    contactInfo: "معلومات الاتصال",
    phoneNumber: "رقم الهاتف",
    email: "البريد الإلكتروني",
    deliveryInfo: "معلومات التوصيل",
    address: "العنوان",
    building: "المبنى",
    floor: "الطابق (اختياري)",
    paymentMethod: "طريقة الدفع",
    cod: "الدفع عند الاستلام",
    orderSummary: "ملخص الطلب",
    totalAmount: "المبلغ الإجمالي",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    confirmOrder: "تأكيد الطلب",
    confirmingOrder: "جاري تأكيد الطلب",
    deliveryRestriction: "يرجى ملاحظة: لأسباب تتعلق بالسلامة، لا نقوم بالتوصيل إلى المناطق التالية: البقاع (بما في ذلك بعلبك، الهرمل، بريتال، يامونة، شراونة، نبي شيت، حورتالا، عرسال، رميسة، خضر، خريبة، تليا، ودار الواسع).",
    orderConfirmed: "تم تأكيد الطلب!",
    orderReceived: "تم استلام طلبك بنجاح. تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني.",
    orderReceivedArabic: "تم استلام طلبك بنجاح. تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني.",
    error: "خطأ",
    tryAgain: "حدث خطأ أثناء تقديم طلبك. يرجى المحاولة مرة أخرى.",
    tryAgainArabic: "حدث خطأ أثناء تقديم طلبك. يرجى المحاولة مرة أخرى.",
    language: "اللغة",
    selectLanguage: "اختر اللغة",
    discountMessage: "أنت توفر $%s على شراء القمصان!"
  }
};

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  building: string;
  floor: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmailWithRetry = async (
  serviceId: string,
  templateId: string,
  params: any,
  publicKey: string,
  retryCount = 0
): Promise<void> => {
  try {
    await emailjs.send(serviceId, templateId, params, publicKey);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying email send (attempt ${retryCount + 1} of ${MAX_RETRIES})...`);
      await sleep(RETRY_DELAY);
      return sendEmailWithRetry(serviceId, templateId, params, publicKey, retryCount + 1);
    }
    throw error;
  }
};

const Checkout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { 
    cartItems, 
    getCartTotal, 
    getDiscountAmount,
    getCodeDiscountAmount,
    applyDiscountCode,
    removeDiscountCode,
    activeDiscountCode 
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [discountCode, setDiscountCode] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    building: '',
    floor: '',
  });

  const t = translations[language];
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Calculate all discounts and totals using useMemo
  const { subtotal, tshirtDiscount, codeDiscount, total } = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tshirtDiscount = getDiscountAmount();
    const codeDiscount = getCodeDiscountAmount();
    const total = getCartTotal();
    return { subtotal, tshirtDiscount, codeDiscount, total };
  }, [cartItems, getDiscountAmount, getCodeDiscountAmount, getCartTotal]);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{6,8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.building.trim()) {
      newErrors.building = 'Building is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Please enter a discount code' : 'يرجى إدخال رمز الخصم',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = applyDiscountCode(discountCode);
    toast({
      title: result.success ? (language === 'en' ? 'Success' : 'نجاح') : (language === 'en' ? 'Error' : 'خطأ'),
      description: result.message,
      status: result.success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });

    if (result.success) {
      setDiscountCode('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: language === 'en' ? 'Please fill in all required fields' : 'يرجى ملء جميع الحقول المطلوبة',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderDetails = cartItems.map(item => language === 'en' ? `
Product: ${item.name}
Quantity: ${item.quantity}
Sizes: ${item.sizes.join(', ')}
Price: $${item.price.toFixed(2)}
Subtotal: $${(item.price * item.quantity).toFixed(2)}
` : `
المنتج: ${item.name}
الكمية: ${item.quantity}
المقاسات: ${item.sizes.join(', ')}
السعر: $${item.price.toFixed(2)}
المجموع الفرعي: $${(item.price * item.quantity).toFixed(2)}
`).join('\n');

      // Prepare discount information for emails
      const discountInfo = language === 'en' ? `
Discounts Applied:
${tshirtDiscount > 0 ? `- T-shirt Quantity Discount: $${tshirtDiscount.toFixed(2)}` : ''}
${codeDiscount > 0 ? `- Discount Code (${activeDiscountCode?.code}): $${codeDiscount.toFixed(2)}` : ''}
` : `
الخصومات المطبقة:
${tshirtDiscount > 0 ? `- خصم كمية القمصان: $${tshirtDiscount.toFixed(2)}` : ''}
${codeDiscount > 0 ? `- رمز الخصم (${activeDiscountCode?.code}): $${codeDiscount.toFixed(2)}` : ''}
`;

      const emailParams = {
        to_name: 'Illusion Store',
        from_name: `${formData.firstName} ${formData.lastName}`,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: `+961${formData.phone}`,
        delivery_address: `${formData.address}, Building: ${formData.building}${formData.floor ? `, Floor: ${formData.floor}` : ''}`,
        order_details: orderDetails,
        discount_info: discountInfo,
        subtotal: `$${subtotal.toFixed(2)}`,
        total_amount: `$${total.toFixed(2)}`,
        payment_method: language === 'en' ? 'Cash on Delivery' : 'الدفع عند الاستلام',
        message: language === 'en' ? `Order Details:
      
Customer Information:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: +961${formData.phone}

Delivery Address:
- Address: ${formData.address}
- Building: ${formData.building}
${formData.floor ? `- Floor: ${formData.floor}` : ''}

Order Items:
${cartItems.map(item => `
- ${item.name}
  Quantity: ${item.quantity}
  Sizes: ${item.sizes.join(', ')}
  Price: $${item.price.toFixed(2)}
  Subtotal: $${(item.price * item.quantity).toFixed(2)}
`).join('\n')}

${discountInfo}

Subtotal: $${subtotal.toFixed(2)}
Total Amount: $${total.toFixed(2)}
Payment Method: Cash on Delivery` : `تفاصيل الطلب:

معلومات العميل:
- الاسم: ${formData.firstName} ${formData.lastName}
- البريد الإلكتروني: ${formData.email}
- الهاتف: +961${formData.phone}

عنوان التوصيل:
- العنوان: ${formData.address}
- المبنى: ${formData.building}
${formData.floor ? `- الطابق: ${formData.floor}` : ''}

عناصر الطلب:
${cartItems.map(item => `
- ${item.name}
  الكمية: ${item.quantity}
  المقاسات: ${item.sizes.join(', ')}
  السعر: $${item.price.toFixed(2)}
  المجموع الفرعي: $${(item.price * item.quantity).toFixed(2)}
`).join('\n')}

${discountInfo}

المجموع الفرعي: $${subtotal.toFixed(2)}
المبلغ الإجمالي: $${total.toFixed(2)}
طريقة الدفع: الدفع عند الاستلام`,
      };

      // Send order details to store with retry mechanism
      await sendEmailWithRetry(
        'service_mjkqwz9',
        'template_86fzq5l',
        emailParams,
        'Zip2CLq7CcBWBrBN3'
      );

      // Send thank you email to customer with retry mechanism

      const thankYouParams = {
        email: formData.email,
        message: language === 'en' ? 
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <div style="border-top: 6px solid #000; padding: 20px; background: white;">
              <h2>Thank You for Your Order</h2>
              <p>The shipping company will contact you as soon as your order arrives.</p>
              
              <div style="border-bottom: 2px solid #333; margin-bottom: 20px;">
                <strong>Order # ORD-${Date.now()}</strong>
              </div>

              ${cartItems.map(item => `
                <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <div style="font-weight: bold;">${item.name}</div>
                  <div style="color: #666;">
                    Quantity: ${item.quantity}<br>
                    Sizes: ${item.sizes.join(', ')}<br>
                    Price per item: $${item.price.toFixed(2)}<br>
                    Total: $${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              `).join('')}

              <div style="margin-top: 20px; border-top: 2px solid #333; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>Subtotal:</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </div>

                ${(tshirtDiscount > 0 || codeDiscount > 0) ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #458500;">
                    <span>Discounts:</span>
                    <span>-$${(tshirtDiscount + codeDiscount).toFixed(2)}</span>
                  </div>
                  ${tshirtDiscount > 0 ? `
                    <div style="color: #458500; font-size: 14px; margin-bottom: 5px;">
                      • T-shirt Quantity Discount: -$${tshirtDiscount.toFixed(2)}
                    </div>
                  ` : ''}
                  ${codeDiscount > 0 ? `
                    <div style="color: #458500; font-size: 14px; margin-bottom: 5px;">
                      • Discount Code (${activeDiscountCode?.code}): -$${codeDiscount.toFixed(2)}
                    </div>
                  ` : ''}
                ` : ''}

                <div style="display: flex; justify-content: space-between; margin-top: 10px; border-top: 2px solid #333; padding-top: 10px;">
                  <strong>Total Amount:</strong>
                  <strong>$${total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
              Email sent to ${formData.email}
            </div>
          </div>
          ` :
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; direction: rtl;">
            <div style="border-top: 6px solid #000; padding: 20px; background: white;">
              <h2>شكراً لطلبك</h2>
              <p>ستتصل بك شركة الشحن بمجرد وصول طلبك.</p>
              
              <div style="border-bottom: 2px solid #333; margin-bottom: 20px;">
                <strong>رقم الطلب # ORD-${Date.now()}</strong>
              </div>

              ${cartItems.map(item => `
                <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <div style="font-weight: bold;">${item.name}</div>
                  <div style="color: #666;">
                    الكمية: ${item.quantity}<br>
                    المقاسات: ${item.sizes.join(', ')}<br>
                    السعر لكل قطعة: $${item.price.toFixed(2)}<br>
                    المجموع: $${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              `).join('')}

              <div style="margin-top: 20px; border-top: 2px solid #333; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>المجموع الفرعي:</span>
                  <span>$${subtotal.toFixed(2)}</span>
                </div>

                ${(tshirtDiscount > 0 || codeDiscount > 0) ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #458500;">
                    <span>الخصومات:</span>
                    <span>-$${(tshirtDiscount + codeDiscount).toFixed(2)}</span>
                  </div>
                  ${tshirtDiscount > 0 ? `
                    <div style="color: #458500; font-size: 14px; margin-bottom: 5px;">
                      • خصم كمية القمصان: -$${tshirtDiscount.toFixed(2)}
                    </div>
                  ` : ''}
                  ${codeDiscount > 0 ? `
                    <div style="color: #458500; font-size: 14px; margin-bottom: 5px;">
                      • رمز الخصم (${activeDiscountCode?.code}): -$${codeDiscount.toFixed(2)}
                    </div>
                  ` : ''}
                ` : ''}

                <div style="display: flex; justify-content: space-between; margin-top: 10px; border-top: 2px solid #333; padding-top: 10px;">
                  <strong>المبلغ الإجمالي:</strong>
                  <strong>$${total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
              تم إرسال البريد الإلكتروني إلى ${formData.email}
            </div>
          </div>
          `
      };

      try {
        await sendEmailWithRetry(
          'service_issqadc',
          'template_qxnt0pp',
          thankYouParams,
          'Zip2CLq7CcBWBrBN3'
        );

        toast({
          title: t.orderConfirmed,
          description: t.orderReceived,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        navigate('/');
      } catch (confirmError: unknown) {
        console.error('Error sending confirmation email:', confirmError);
        toast({
          title: language === 'en' ? 'Order Received' : 'تم استلام الطلب',
          description: language === 'en' ? 
            'Your order was received, but there was an issue sending the confirmation email. We will contact you shortly.' :
            'تم استلام طلبك، ولكن حدثت مشكلة في إرسال بريد التأكيد. سنتواصل معك قريباً.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        navigate('/');
      }
    } catch (error: unknown) {
      console.error('Error processing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: t.error,
        description: language === 'en' ? 
          `There was an error placing your order: ${errorMessage}. Please try again or contact support.` :
          `حدث خطأ أثناء تقديم طلبك: ${errorMessage}. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box py={{ base: 4, md: 8 }} px={{ base: 2, md: 4 }}>
      <Container maxW="container.md">
        <VStack spacing={{ base: 4, md: 8 }} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size={{ base: "lg", md: "xl" }}>{t.title}</Heading>
            <FormControl w="200px">
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                size={{ base: "md", md: "lg" }}
                fontSize={{ base: "16px", md: "md" }}
                height={{ base: "45px", md: "50px" }}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </Select>
            </FormControl>
          </Flex>

          <form onSubmit={handleSubmit}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Personal Information */}
              <Box>
                <Heading size={{ base: "sm", md: "md" }} mb={{ base: 3, md: 4 }}>{t.personalInfo}</Heading>
                <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 3, md: 4 }}>
                  <FormControl isRequired isInvalid={!!errors.firstName}>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>{t.firstName}</FormLabel>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      size={{ base: "md", md: "lg" }}
                      fontSize={{ base: "16px", md: "md" }}
                      height={{ base: "45px", md: "50px" }}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.lastName}>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>{t.lastName}</FormLabel>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      size={{ base: "md", md: "lg" }}
                      fontSize={{ base: "16px", md: "md" }}
                      height={{ base: "45px", md: "50px" }}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.lastName}</FormErrorMessage>
                  </FormControl>
                </Stack>
              </Box>

              {/* Contact Information */}
              <Box>
                <Heading size={{ base: "sm", md: "md" }} mb={{ base: 3, md: 4 }}>{t.contactInfo}</Heading>
                <VStack spacing={{ base: 3, md: 4 }}>
                  <FormControl isRequired isInvalid={!!errors.phone}>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>{t.phoneNumber}</FormLabel>
                    <InputGroup size={{ base: "md", md: "lg" }}>
                      <InputLeftAddon height={{ base: "45px", md: "50px" }}>
                        <HStack spacing={2}>
                          <Text fontSize={{ base: "sm", md: "md" }}>🇱🇧</Text>
                          <Text fontSize={{ base: "sm", md: "md" }}>+961</Text>
                        </HStack>
                      </InputLeftAddon>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={language === 'en' ? "Enter phone number" : "أدخل رقم الهاتف"}
                        fontSize={{ base: "16px", md: "md" }}
                        height={{ base: "45px", md: "50px" }}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </InputGroup>
                    <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.phone}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>{t.email}</FormLabel>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={language === 'en' ? "Enter email address" : "أدخل البريد الإلكتروني"}
                      size={{ base: "md", md: "lg" }}
                      fontSize={{ base: "16px", md: "md" }}
                      height={{ base: "45px", md: "50px" }}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.email}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </Box>

              {/* Delivery Information */}
              <Box>
                <Heading size={{ base: "sm", md: "md" }} mb={{ base: 3, md: 4 }}>{t.deliveryInfo}</Heading>
                <Alert status="warning" mb={4} borderRadius="md">
                  <AlertIcon />
                  <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
                    {t.deliveryRestriction}
                  </AlertDescription>
                </Alert>
                <VStack spacing={{ base: 3, md: 4 }}>
                  <FormControl isRequired isInvalid={!!errors.address}>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>{t.address}</FormLabel>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={language === 'en' ? "Enter delivery address" : "أدخل عنوان التوصيل"}
                      size={{ base: "md", md: "lg" }}
                      fontSize={{ base: "16px", md: "md" }}
                      height={{ base: "45px", md: "50px" }}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.address}</FormErrorMessage>
                  </FormControl>

                  <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 3, md: 4 }}>
                    <FormControl isRequired isInvalid={!!errors.building}>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>{t.building}</FormLabel>
                      <Input
                        value={formData.building}
                        onChange={(e) => handleInputChange('building', e.target.value)}
                        placeholder={language === 'en' ? "Building name/number" : "اسم/رقم المبنى"}
                        size={{ base: "md", md: "lg" }}
                        fontSize={{ base: "16px", md: "md" }}
                        height={{ base: "45px", md: "50px" }}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.building}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>{t.floor}</FormLabel>
                      <Input
                        value={formData.floor}
                        onChange={(e) => handleInputChange('floor', e.target.value)}
                        placeholder={language === 'en' ? "Floor number" : "رقم الطابق"}
                        size={{ base: "md", md: "lg" }}
                        fontSize={{ base: "16px", md: "md" }}
                        height={{ base: "45px", md: "50px" }}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </FormControl>
                  </Stack>
                </VStack>
              </Box>

              {/* Payment Method */}
              <Box>
                <Heading size={{ base: "sm", md: "md" }} mb={{ base: 3, md: 4 }}>{t.paymentMethod}</Heading>
                <RadioGroup defaultValue="cod">
                  <Stack>
                    <Radio value="cod" isChecked={true} isDisabled fontSize={{ base: "sm", md: "md" }}>
                      {t.cod}
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              {/* Discount Code Section */}
              <Box>
                <Heading size={{ base: "sm", md: "md" }} mb={{ base: 3, md: 4 }}>
                  {language === 'en' ? 'Discount Code' : 'رمز الخصم'}
                </Heading>
                <VStack spacing={4} align="stretch">
                  <InputGroup size={{ base: "md", md: "lg" }}>
                    <Input
                      placeholder={language === 'en' ? "Enter discount code" : "أدخل رمز الخصم"}
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      pr="4.5rem"
                      fontSize={{ base: "16px", md: "md" }}
                      height={{ base: "45px", md: "50px" }}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <InputRightElement width="4.5rem" height={{ base: "45px", md: "50px" }}>
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleApplyDiscount}
                        isDisabled={!discountCode.trim()}
                      >
                        {language === 'en' ? 'Apply' : 'تطبيق'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  {activeDiscountCode && (
                    <Alert status="success" borderRadius="md">
                      <AlertIcon />
                      <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
                        {activeDiscountCode.code} {language === 'en' ? 'applied!' : 'تم التطبيق!'} {language === 'en' ? 'Saving' : 'توفير'} {activeDiscountCode.percentage}% ({language === 'en' ? 'up to' : 'حتى'} ${activeDiscountCode.maxDiscount})
                      </AlertDescription>
                      <Button
                        size="sm"
                        variant="ghost"
                        ml="auto"
                        onClick={removeDiscountCode}
                      >
                        {language === 'en' ? 'Remove' : 'إزالة'}
                      </Button>
                    </Alert>
                  )}
                </VStack>
              </Box>

              <Divider />

              {/* Order Summary */}
              <Box>
                <Heading size={{ base: "sm", md: "md" }} mb={{ base: 3, md: 4 }}>{t.orderSummary}</Heading>
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize={{ base: "md", md: "lg" }}>{t.subtotal}:</Text>
                    <Text fontSize={{ base: "md", md: "lg" }}>${subtotal.toFixed(2)}</Text>
                  </HStack>
                  
                  {tshirtDiscount > 0 && (
                    <HStack justify="space-between" color="green.500">
                      <Text fontSize={{ base: "md", md: "lg" }}>{t.discount}:</Text>
                      <Text fontSize={{ base: "md", md: "lg" }}>-${tshirtDiscount.toFixed(2)}</Text>
                    </HStack>
                  )}

                  {codeDiscount > 0 && (
                    <HStack justify="space-between" color="green.500">
                      <Text fontSize={{ base: "md", md: "lg" }}>
                        {language === 'en' ? 'Code Discount:' : 'خصم الكود:'}
                      </Text>
                      <Text fontSize={{ base: "md", md: "lg" }}>-${codeDiscount.toFixed(2)}</Text>
                    </HStack>
                  )}

                  <Divider />
                  
                  <HStack justify="space-between">
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{t.totalAmount}:</Text>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                      ${total.toFixed(2)}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              <Button
                type="submit"
                colorScheme="blackAlpha"
                size={{ base: "md", md: "lg" }}
                w="full"
                isLoading={isLoading}
                loadingText={t.confirmingOrder}
                height={{ base: "45px", md: "50px" }}
                fontSize={{ base: "md", md: "lg" }}
              >
                {t.confirmOrder}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default Checkout; 