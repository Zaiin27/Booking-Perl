 import { useState, useEffect, useRef } from "react";
import { useSelector, useStore } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useScrapeUberEatsOrderMutation, useCreatePaymentIntentMutation } from "../../services/Api";
import { useGetSiteSettingsQuery } from "../../services/admin/adminApi";
import StripeCardElement from "../StripeCardElement.jsx";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import reviewbg from "../../assets/images/reviewbg.png";
import { BiHelpCircle } from "react-icons/bi";
import usaFlag from "../../assets/icons/usaFlag.svg";
import mapFind from "../../assets/icons/mapFind.svg";
import reloadIcon from "../../assets/icons/reloadIcon.svg";
import userIcon from "../../assets/images/chaticon.png";
import { getChatMessages } from "../../services/chatApi";
import {
  IoMdCheckmarkCircleOutline,
  IoIosHelpCircleOutline,
} from "react-icons/io";
import { BsBoxSeamFill } from "react-icons/bs";
import { toastUtils } from "../../utils/toastUtils";
import socketService from "../../services/socketService";
import { getServiceStatus } from "../../utils/serviceAvailability";

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  const isLoggedIn = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  const [scrapeUberEatsOrder, { isLoading: isScraping }] = useScrapeUberEatsOrderMutation();
  const [createPaymentIntent, { isLoading: isProcessingPayment }] = useCreatePaymentIntentMutation();
  
  const { data: siteSettings, isLoading: isLoadingServiceStatus } = useGetSiteSettingsQuery();
  const serviceStatus = getServiceStatus(siteSettings);
  const isServiceActive = serviceStatus.isAvailable;
  const stripe = useStripe();
  const elements = useElements();
  const [currentStep, setCurrentStep] = useState(1);
  const [cardError, setCardError] = useState(null);
  const [isProcessingCardPayment, setIsProcessingCardPayment] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  
  const [formData, setFormData] = useState({
    cartLink: "",
    orderSummary: {
      itemName: "",
      totalItems: 0,
      price: 0,
      deliveryFee: 0,
      subtotal: 0,
      discount: 0,
      finalTotal: 0,
    },
    paymentMethod: "card",
    orderId: "",
    cardDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
  }, [currentStep]);


  useEffect(() => {
    if (location.state?.scrapedData && location.state?.fromProfile) {
      console.log('Profile scraped data:', location.state.scrapedData);
      
      const scrapedData = location.state.scrapedData;
      
      // Check if scrapedData has the expected structure
      if (scrapedData.data && scrapedData.data.order_id) {
        const orderData = scrapedData.data;
        
        // Calculate total items from the items array structure
        const totalItems = orderData.items?.reduce((total, item) => {
          return total + (item.quantity || 1);
        }, 0) || 0;

        // Extract data from nested structure
        const pricing = orderData.pricing || {};
        const restaurant = orderData.restaurant || {};
        const delivery = orderData.delivery || {};
        const uberOne = orderData.uber_one || {};
        const customerDetails = orderData.customer_details || {};
        
        // Debug: Log customer details to see what phone fields are available
        console.log("🔍 Profile Customer Details Debug:", customerDetails);
        console.log("🔍 Profile Order Data Debug:", orderData);
        
        const subtotal = pricing.subtotal || 0;
        const deliveryFee = pricing.delivery_fee || 0;
        const serviceFee = pricing.service_fee || 0;
        const taxes = pricing.taxes || 0;
        const total = pricing.total || 0;
        
        const discount = 0;
        const originalSavings = uberOne.uber_one_benefit || 0;
        const savings = 0;
        
        // Total before discount = Subtotal + Service fee + Delivery fee + Taxes
        const totalBeforeDiscount = subtotal + serviceFee + deliveryFee + taxes;
        
        const newOrderSummary = {
          itemName: restaurant.name || "Uber Eats Order",
          totalItems: totalItems,
          price: subtotal,
          deliveryFee: deliveryFee,
          subtotal: subtotal,
          discount: discount,
          finalTotal: total,
          orderId: orderData.order_id,
          serviceFee: serviceFee,
          taxes: taxes,
          totalBeforeDiscount: totalBeforeDiscount,
          originalSavings: originalSavings,
          savings: savings,
          restaurant: restaurant,
          delivery: delivery,
          items: orderData.items || [],
          customer: {
            displayName: customerDetails.customer_display_name || "",
            address: delivery.address || "",
            deliveryInstructions: delivery.instructions || "",
            phone: customerDetails.customer_phone || customerDetails.phone || customerDetails.phone_number || customerDetails.mobile || customerDetails.contact_number || ""
          }
        };

        setFormData(prev => {
          const newData = {
            ...prev,
            cartLink: scrapedData.url || "",
            orderSummary: newOrderSummary
          };
          return newData;
        });

        setCurrentStep(2);
        navigate('/order-now', { replace: true });
      } else {
        console.error('Invalid scraped data structure:', scrapedData);
        toastUtils.error("Invalid order data received. Please try again.");
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (isLoggedIn && user) {
      const orderId = formData.orderSummary.orderId || formData.orderId || 'global';
      socketService.connect(user.id, orderId);
      
      socketService.onTicketCreated((data) => {
        
        // Show notification with action
        toast.success(`Support ticket created for order ${data.order_id}`, {
          duration: 5000,
          action: {
            label: 'Open Chat',
            onClick: () => {
              navigate('/order-now');
              setTimeout(() => {
                setCurrentStep(5);
              }, 1000);
            }
          }
        });
        
        if (currentStep === 5) {
          setChatMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: 'system',
            message: `Support ticket #${data.ticket_id} has been created for your order. Support team will assist you shortly.`,
            timestamp: new Date(data.createdAt)
          }]);
          scrollToBottom();
        }
      });
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (currentStep === 5 && isLoggedIn && user && formData.orderSummary.orderId) {
      loadChatHistory(formData.orderSummary.orderId);
    }
  }, [currentStep]);


  const loadChatHistory = async (orderId) => {
    try {
      
      const data = await getChatMessages(orderId);
      
      
      if (data.success && data.chats && Array.isArray(data.chats)) {
        const transformedMessages = data.chats.map((msg, index) => ({
          id: msg._id || `msg-${index}`,
          message: msg.message,
          userId: msg.sender_id?.role === 'staff' || msg.sender_id?.role === 'admin' ? 'staff' : 'user',
          userName: msg.sender_id?.role === 'staff' || msg.sender_id?.role === 'admin' ? 'Support' : 'You',
          timestamp: new Date(msg.createdAt),
          type: msg.sender_id?.role === 'staff' || msg.sender_id?.role === 'admin' ? 'support' : 'user'
        }));
        
        setChatMessages(transformedMessages);
      } else {
        console.log('No chat messages found or invalid response format');
        setChatMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setChatMessages([]);
    }
  };

  useEffect(() => {
    if (currentStep === 5 && isLoggedIn && user && formData.orderSummary.orderId) {
      console.log('Initializing socket connection for order:', formData.orderSummary.orderId);
      
      loadChatHistory(formData.orderSummary.orderId);
      
      socketService.connect(user.id, formData.orderSummary.orderId);
      
      setTimeout(() => {
        const status = socketService.getConnectionStatus();
        console.log('Socket connection status after connect:', status);
        if (!status.isConnected) {
          console.log('Socket not connected, retrying...');
          socketService.forceReconnect();
        }
      }, 2000);
      
      socketService.onMessage((messageData) => {
        console.log('Received message:', messageData);
        
        const isForCurrentOrder = 
          messageData.orderId === formData.orderSummary.orderId || 
          messageData.ticket_id === formData.orderSummary.orderId ||
          messageData.ticket_id === formData.orderId ||
          messageData.order_id === formData.orderSummary.orderId ||
          messageData.order_id === formData.orderId;
        
        if (isForCurrentOrder) {
          setChatMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            message: messageData.message,
            userId: messageData.userId,
            userName: messageData.userId === 'staff' ? 'Support' : 'You',
            timestamp: new Date(messageData.timestamp),
            type: messageData.userId === 'staff' ? 'support' : 'user'
          }]);
          scrollToBottom();
        }
      });

      socketService.onTicketMessage((messageData) => {
        console.log('Received ticket message:', messageData);
        
        const isForCurrentOrder = 
          messageData.orderId === formData.orderSummary.orderId || 
          messageData.ticket_id === formData.orderSummary.orderId ||
          messageData.ticket_id === formData.orderId ||
          messageData.order_id === formData.orderSummary.orderId ||
          messageData.order_id === formData.orderId;
        
        if (isForCurrentOrder) {
          setChatMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            message: messageData.message,
            userId: messageData.userId || 'staff',
            userName: 'Support',
            timestamp: new Date(messageData.timestamp),
            type: 'support'
          }]);
          scrollToBottom();
        }
      });

      socketService.onUserJoined((data) => {
        console.log('User joined:', data);
        setChatMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'system',
          message: `${data.userName || 'Support'} joined the chat`,
          timestamp: new Date()
        }]);
        scrollToBottom();
      });

      socketService.onUserLeft((data) => {
        console.log('User left:', data);
        setChatMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'system',
          message: `${data.userName || 'Support'} left the chat`,
          timestamp: new Date()
        }]);
        scrollToBottom();
      });

      socketService.onOrderUpdate((data) => {
        console.log('Order update:', data);
        setChatMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'system',
          message: `Order update: ${data.message}`,
          timestamp: new Date()
        }]);
        scrollToBottom();
      });

      socketService.onSupportMessage((data) => {
        console.log('Support message:', data);
        
        const isForCurrentOrder = 
          data.orderId === formData.orderSummary.orderId || 
          data.ticket_id === formData.orderSummary.orderId ||
          data.ticket_id === formData.orderId ||
          data.order_id === formData.orderSummary.orderId ||
          data.order_id === formData.orderId;
        
        if (isForCurrentOrder) {
          setChatMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            message: data.message,
            userId: data.userId || 'staff',
            userName: 'Support',
            timestamp: new Date(data.timestamp),
            type: 'support'
          }]);
          scrollToBottom();
        }
      });

      const handleChatMessage = (messageData) => {
        console.log('Received chat.message event:', messageData);
        
        const isForCurrentOrder = 
          messageData.orderId === formData.orderSummary.orderId || 
          messageData.ticket_id === formData.orderSummary.orderId ||
          messageData.ticket_id === formData.orderId ||
          messageData.order_id === formData.orderSummary.orderId ||
          messageData.order_id === formData.orderId;
        
        if (isForCurrentOrder) {
          console.log('Message is for current order, adding to chat');
          setChatMessages(prev => {
            const messageExists = prev.some(msg => 
              msg.message === messageData.message && 
              Math.abs(new Date(msg.timestamp) - new Date(messageData.timestamp || new Date())) < 1000
            );
            
            if (!messageExists) {
              const newMessage = {
                id: Date.now() + Math.random(),
                message: messageData.message,
                userId: messageData.userId || 'staff',
                userName: messageData.userId === 'staff' ? 'Support' : 'You',
                timestamp: new Date(messageData.timestamp || new Date()),
                type: messageData.userId === 'staff' ? 'support' : 'user'
              };
              console.log('Adding new message:', newMessage);
              return [...prev, newMessage];
            }
            return prev;
          });
          scrollToBottom();
        } else {
          console.log('Message not for current order:', {
            messageOrderId: messageData.order_id,
            messageTicketId: messageData.ticket_id,
            currentOrderId: formData.orderSummary.orderId
          });
        }
      };

      if (socketService.socket) {
        socketService.socket.on('chat.message', handleChatMessage);
        console.log('Direct chat.message listener set up');
        
        socketService.socket.on('order.joined', (data) => {
          console.log('Order joined successfully:', data);
        });
        
        socketService.socket.emit('test', { 
          message: 'Order form connected', 
          orderId: formData.orderSummary.orderId 
        });
      } else {
        console.error('Socket not available for chat.message listener');
      }

      // Listen for ticket created event
      socketService.onTicketCreated((data) => {
        console.log('Ticket created:', data);
        
        toast.success(`Support ticket created for order ${data.order_id}`);
        
        setChatMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'system',
          message: `Support ticket #${data.ticket_id} has been created for your order. Support team will assist you shortly.`,
          timestamp: new Date(data.createdAt)
        }]);
        
        scrollToBottom();
      });

      socketService.joinOrderChat();
      
      if (socketService.socket) {
        socketService.socket.emit('order.join', {
          order_id: formData.orderSummary.orderId
        });
        console.log('Joined order room:', formData.orderSummary.orderId);
      }


      const checkConnection = () => {
        const status = socketService.getConnectionStatus();
        setIsSocketConnected(status.isConnected);
      };

      checkConnection();
      const interval = setInterval(checkConnection, 1000);
      

      const refreshInterval = setInterval(() => {
        if (currentStep === 5) {
          loadChatHistory(formData.orderSummary.orderId);
        }
      }, 5000);


      return () => {
        clearInterval(interval);
        clearInterval(refreshInterval);
        socketService.removeAllListeners();
        socketService.disconnect();
      };
    }
  }, [currentStep, isLoggedIn, user, formData.orderSummary.orderId]);


  const sendMessage = async () => {
    if (newMessage.trim()) {
      const messageText = newMessage.trim();
      const orderId = formData.orderSummary.orderId || formData.orderId;
     
      const userMessage = {
        id: Date.now() + Math.random(),
        message: messageText,
        userId: user?.id,
        userName: user?.name || user?.email || 'You',
        timestamp: new Date(),
        type: 'user'
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage("");
      scrollToBottom();
      
      try {

        await socketService.sendMessageViaAPI(messageText, orderId, user?.id);
        console.log('Message sent via API successfully');
        

        if (isSocketConnected) {
          socketService.sendMessage(messageText);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error("Failed to send message. Please try again.");
        

        setChatMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      }
    } else if (!isSocketConnected) {
      toast.error("Chat connection not available. Please try again.");
    }
  };


  const handleMessageInput = (e) => {
    setNewMessage(e.target.value);
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : null);
  };

  const handlePaymentMethodChange = (method) => {

    const discount = 0;
    // No discount/savings for card payment, only for SOL (crypto)
    const savings = method === "sol" ? (formData.orderSummary.originalSavings || 0) : 0;
    
    const totalBeforeDiscount = formData.orderSummary.price + formData.orderSummary.serviceFee + formData.orderSummary.deliveryFee + formData.orderSummary.taxes;
    const finalTotal = totalBeforeDiscount - savings;

    setFormData({
      ...formData,
      paymentMethod: method,
      orderSummary: {
        ...formData.orderSummary,
        subtotal: totalBeforeDiscount, // Update subtotal to be total before discount
        discount: discount,
        savings: savings,
        finalTotal: finalTotal,
      }
    });
  };


  const handleFetchOrder = async () => {
    if (!isLoggedIn) {
      toastUtils.error("Please login to fetch your order details");
      navigate("/login?returnUrl=/order-now");
      return;
    }

    // Check if user is verified
    if (!user?.isVerified) {
      toastUtils.error("Please verify your account to access this resource");
      return;
    }

    if (!formData.cartLink.trim()) {
      toastUtils.error("Please enter a valid cart link");
      return;
    }

    try {
      const url = new URL(formData.cartLink);
      
      if (!url.hostname.includes('uber.com') && !url.hostname.includes('eats.uber.com')) {
        toastUtils.error("Please enter a valid Uber Eats group order link");
        return;
      }
    } catch (error) {
      toastUtils.error("Please enter a valid URL");
      return;
    }

    const loadingToast = toastUtils.loading("Fetching your order details...");

    try {
      const authState = store.getState().auth;
      
      const token = authState.user?.token || localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        toastUtils.dismiss(loadingToast);
        toastUtils.error("Please login to continue");
        navigate("/login?returnUrl=/order-now");
        return;
      }
      
      const requestData = {
        url: formData.cartLink
      };
      
      const result = await scrapeUberEatsOrder(requestData);

      toastUtils.dismiss(loadingToast);

      if (result.data) {
        toastUtils.success("Order details fetched successfully!");
        
        const orderData = result.data.data;
        if (orderData && orderData.order_id) {
          // Calculate total items from the new items array structure
          const totalItems = orderData.items?.reduce((total, item) => {
            return total + (item.quantity || 1);
          }, 0) || 0;

          // Extract data from new nested structure
          const pricing = orderData.pricing || {};
          const restaurant = orderData.restaurant || {};
          const delivery = orderData.delivery || {};
          const uberOne = orderData.uber_one || {};
          const customerDetails = orderData.customer_details || {};
          
          const subtotal = pricing.subtotal || 0;
          const deliveryFee = pricing.delivery_fee || 0;
          const serviceFee = pricing.service_fee || 0;
          const taxes = pricing.taxes || 0;
          const total = pricing.total || 0;
          
          const discount = 0;
          // Store the original savings amount for SOL payment
          const originalSavings = uberOne.uber_one_benefit || 0;
          // Default payment method is "card", so no discount initially
          // Discount will only be applied when user selects SOL (crypto)
          const savings = 0;
          
          // Correct calculations:
          // Total before discount = Subtotal + Service fee + Delivery fee + Taxes
          const totalBeforeDiscount = subtotal + serviceFee + deliveryFee + taxes;
          // Final Total = Total before discount - MealCheap Save (only for SOL)
          const finalTotal = totalBeforeDiscount - savings;

          // Create participants array from items for backward compatibility
          const participants = [{
            name: "Your Order",
            summary: `${totalItems} items`,
            items: orderData.items?.map(item => {
              const unitPrice = item.price / item.quantity;
              console.log("🔍 Item Debug:", {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                unitPrice: unitPrice,
                rawItem: item
              });
              return {
                title: item.name,
                price: item.price, 
                unitPrice: unitPrice, 
                quantity: item.quantity,
                addOns: item.customizations || []
              };
            }) || []
          }];

          const newOrderSummary = {
            orderId: orderData.order_id,
            itemName: orderData.items?.[0]?.name || "Multiple Items",
            totalItems: totalItems,
            price: subtotal, 
            deliveryFee: deliveryFee,
            serviceFee: serviceFee,
            taxes: taxes,
            subtotal: totalBeforeDiscount, // This is now "Total before discount"
            discount: discount,
            savings: savings,
            originalSavings: originalSavings, // Store original savings for SOL payment
            finalTotal: finalTotal, // This is now "Final Total" after discount
            participants: participants,
            cartUrl: orderData.order?.cart_url,
            status: orderData.status,
            // New nested data
            restaurant: restaurant,
            delivery: delivery,
            uberOne: uberOne,
            items: orderData.items || [],
            customer: {
              displayName: customerDetails.customer_display_name || "",
              address: delivery.address || "",
              deliveryInstructions: delivery.instructions || "",
              phone: customerDetails.customer_phone || customerDetails.phone || customerDetails.phone_number || customerDetails.mobile || customerDetails.contact_number || ""
            }
          };


          setFormData(prev => {
            const updated = {
              ...prev,
              orderSummary: newOrderSummary
            };
            return updated;
          });
          
          setTimeout(() => {
            nextStep();
          }, 100);
        } else {
          toastUtils.error("Failed to process order data. Please try again.");
        }
      } else if (result.error) {
        let errorMessage = "Failed to fetch order details";
        
        if (result.error.status === 401) {
          errorMessage = "Please login to continue";
          navigate("/login?returnUrl=/order-now");
        } else if (result.error.data?.message) {
          errorMessage = result.error.data.message;
        } else if (result.error.data?.error) {
          errorMessage = result.error.data.error;
        } else if (result.error.status === 404) {
          errorMessage = "Scraping service not available. Please try again later.";
        } else if (result.error.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (result.error.status === 'FETCH_ERROR') {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (typeof result.error.data === 'string') {
          errorMessage = result.error.data;
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }
        
        toastUtils.error(errorMessage);
      }
    } catch (error) {
      toastUtils.dismiss(loadingToast);
      toastUtils.error("Network error. Please try again.");
    }
  };

  const nextStep = () => {
    
    if (!isLoggedIn) {
      toastUtils.error("Please login to continue with your order");
      navigate("/login?returnUrl=/order-now");
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
    }
  };

  const handlePayment = async () => {
    
    if (!isLoggedIn) {
      toast.error("Please login to complete your order");
      navigate("/login?returnUrl=/order-now");
      return;
    }

    if (formData.paymentMethod === "card") {
      if (!stripe || !elements) {
        toast.error("Stripe is not loaded yet. Please try again.");
        return;
      }

      const cardElement = elements.getElement('cardNumber');
      if (!cardElement) {
        toast.error("Card element not found. Please try again.");
        return;
      }

      if (cardError) {
        toast.error(cardError);
        return;
      }

       try {
         const paymentData = {
           order_id: formData.orderSummary.orderId || formData.orderId,
           method: formData.paymentMethod
         };


         const result = await createPaymentIntent(paymentData);

         if (result.data && result.data?.data?.payment?.stripe_client_secret) {
           console.log("Client secret received:", result.data.data.payment.stripe_client_secret);
           
           const { error, paymentIntent } = await stripe.confirmCardPayment(
             result.data.data.payment.stripe_client_secret,
             {
               payment_method: {
                 card: cardElement,
               }
             }
           );

           if (error) {
             console.log("Stripe confirmation error:", error);
             toast.error(error.message);
             return;
           }

           if (paymentIntent.status === 'succeeded') {
             toastUtils.success("Payment processed successfully!");
             nextStep();
           } else {
             toastUtils.error("Payment was not successful. Please try again.");
           }
         } else if (result.error) {
           let errorMessage = "Payment failed. Please try again.";
           
           if (result.error.data?.message) {
             errorMessage = result.error.data.message;
           } else if (result.error.data?.error) {
             errorMessage = result.error.data.error;
           }
           
           toast.error(errorMessage);
         } else {
           toast.error("No client secret received from server.");
         }
       } catch (error) {
         console.log("Payment catch error:", error);
         toast.error("Network error. Please try again.");
       }
    } else {
      try {
        const paymentData = {
          order_id: formData.orderSummary.orderId || formData.orderId,
          method: formData.paymentMethod
        };


        const result = await createPaymentIntent(paymentData);

        if (result.data) {
          toastUtils.success("Payment processed successfully!");
          console.log("Calling nextStep() for non-card payment...");
          nextStep();
        } else if (result.error) {
          console.log("Payment error:", result.error);
          let errorMessage = "Payment failed. Please try again.";
          
          if (result.error.data?.message) {
            errorMessage = result.error.data.message;
          } else if (result.error.data?.error) {
            errorMessage = result.error.data.error;
          }
          
          toast.error(errorMessage);
        }
      } catch (error) {
        console.log("Payment catch error:", error);
        toast.error("Network error. Please try again.");
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: "Paste Link" },
    { id: 2, title: "Review Order" },
    { id: 3, title: "Choose Payment & Save" },
    { id: 4, title: "Get Confirmation & Chat" },
    { id: 5, title: "Order Chat" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[#374151] font-inter font-medium text-sm mb-2">
                Enter your cart link
                <BiHelpCircle className="text-[#E33629]" />
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="cartLink"
                  value={formData.cartLink}
                  onChange={handleInputChange}
                  placeholder="https://eats.uber.com/group-orders/..."
                  disabled={!isServiceActive}
                  className={`flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9945FF] focus:border-[#9945FF] font-inter ${
                    !isServiceActive ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <button 
                  disabled={!isServiceActive}
                  className={`px-2 py-1 bg-white border border-gray-300 rounded-lg transition-colors ${
                    !isServiceActive 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <img src={reloadIcon} alt="reload" className="w-8 h-8" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={mapFind} alt="map" className="w-6 h-6" />
                <span className="text-[#374151] font-inter">
                  Available Countries
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 rounded-lg flex items-center justify-center">
                  <img src={usaFlag} alt="flag" className="w-4 h-4" />
                </div>
                <span className="text-[#374151] font-inter">USA</span>
              </div>
            </div>

            {!isServiceActive ? (
              <div className="w-full py-4 px-8 rounded-lg bg-red-50 border border-red-200 text-center">
                <div className="text-red-600 font-inter text-lg font-bold">
                  {serviceStatus.message}
                </div>
                {serviceStatus.showHoursLink && serviceStatus.hoursLink && (
                  <div className="text-red-600 font-inter text-sm mt-2">
                    {serviceStatus.hoursLink.includes('me.senew-tech.com') ? (
                      <>
                        Visit{' '}
                        <a 
                          href="https://me.senew-tech.com" 
                          className="underline hover:text-red-700" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          me.senew-tech.com
                        </a>
                        {' '}to check when we're open
                      </>
                    ) : (
                      serviceStatus.hoursLink
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleFetchOrder}
                disabled={isScraping}
                className={`w-full py-4 px-8 rounded-full font-inter text-lg font-medium text-white transition-all duration-300 ${
                  isScraping 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:scale-105'
                }`}
                style={{
                  background: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                }}
              >
                {isScraping ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    FETCHING ORDER...
                  </div>
                ) : (
                  "FETCH ORDER"
                )}
              </button>
            )}
            
            {!isLoggedIn && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-inter text-sm font-medium">
                    Please login to fetch your order details
                  </span>
                </div>
              </div>
            )}
            <div className="bg-[#15193909] rounded-lg p-4">
              <div className="flex justify-between items-center text-black w-full border-b border-white p-2">
                <div className="flex items-center gap-2">
                  <IoMdCheckmarkCircleOutline />
                  <span className="text-[#166534] text-sm font-bold font-inter">
                    You Save
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#166534] font-bold">$23.78 (70%)</span>
                </div>
              </div>

              <p className="text-[#6B7280] text-sm font-inter p-2">
                ~Paste the link you received from your group to view and confirm
                order details.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-2">
            <h3 className="font-inter text-lg font-medium text-[#374151]">
              Review Your Order
            </h3>
            <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                  <BsBoxSeamFill className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-inter text-sm font-semibold text-[#111827]">
                    Order Summary Box
                  </h3>
                  {formData.orderSummary.restaurant?.name && (
                    <p className="font-inter text-xs text-[#6B7280]">
                      From {formData.orderSummary.restaurant.name}
                      {formData.orderSummary.restaurant?.address && (
                        <span> - {formData.orderSummary.restaurant.address}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4 text-sm ml-12 max-h-80 overflow-y-auto scrollbar-ultra-thin pr-2">
                {formData.orderSummary.customer?.displayName && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Customer:</span>
                    <span className="font-medium text-black">
                      {formData.orderSummary.customer.displayName}
                    </span>
                  </div>
                )}
                {formData.orderSummary.customer?.address && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Delivery Address:</span>
                    <span className="font-medium text-black">
                      {formData.orderSummary.customer.address}
                    </span>
                  </div>
                )}
                {formData.orderSummary.orderId && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Order ID:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.orderId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#374151]">Phone:</span>
                  <span className="font-medium text-black">
                    {formData.orderSummary.customer?.phone || "N/A"}
                  </span>
                </div>
                
                {/* Items from participants */}
                {formData.orderSummary.participants?.map((participant, participantIndex) => (
                  <div key={participantIndex} className="border-b border-gray-200 pb-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#374151] font-semibold">{participant.name}</span>
                      <span className="text-[#374151] text-xs">{participant.summary}</span>
                    </div>
                    {participant.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="ml-4 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#374151] text-xs">{item.title}</span>
                          <span className="font-medium text-xs">
                            ${item.unitPrice?.toFixed(2) || '0.00'} x {item.quantity}
                          </span>
                        </div>
                        {item.addOns?.length > 0 && (
                          <div className="ml-2">
                            <span className="text-[#6B7280] text-xs">
                              + {item.addOns.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

                <div className="flex justify-between">
                  <span className="text-[#374151]">Total items:</span>
                  <span className="font-medium">
                    {String(formData.orderSummary.totalItems).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#374151]">Subtotal:</span>
                  <span className="font-medium">
                    ${formData.orderSummary.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {formData.orderSummary.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Service fee:</span>
                    <span className="font-medium">
                      ${formData.orderSummary.serviceFee?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#374151]">Delivery fee:</span>
                  <span className="font-medium">
                    ${formData.orderSummary.deliveryFee?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {formData.orderSummary.taxes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Taxes:</span>
                    <span className="font-medium">
                      ${formData.orderSummary.taxes?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#374151]">Total before discount:</span>
                  <span className="font-medium">
                    ${formData.orderSummary.subtotal?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {formData.orderSummary.customer?.deliveryInstructions && (
                  <div className=" pt-1">
                    <div className="text-[#374151] font-semibold text-sm mb-2">Delivery Instructions:</div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-[#6B7280]">
                      {formData.orderSummary.customer.deliveryInstructions}
                    </div>
                  </div>
                )}
                {(formData.orderSummary.savings > 0 || formData.orderSummary.discount > 0) && (
                  <div className="flex justify-between text-[#166534] font-bold text-sm">
                    <div className="flex items-center gap-2">
                      <IoMdCheckmarkCircleOutline className="text-black text-lg" />
                      <span>MealCheap Save:</span>
                    </div>
                    <span className="font-bold">
                      ${formData.orderSummary.savings?.toFixed(2) || '0.00'} (
                      {formData.orderSummary.discount || 0}%)
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t-2 border-white/60 pt-4">
                  <span className="text-[#374151] font-bold text-sm">
                    Final Total:
                  </span>
                  <span className="text-[#166534] font-bold">
                    ${formData.orderSummary.finalTotal?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="w-1/3 py-3 px-6 rounded-full font-inter font-medium transition-all duration-300 hover:scale-105 relative"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(153, 69, 255, 1) 0%, rgba(20, 241, 149, 1) 100%)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    padding: "2px",
                  }}
                ></div>
                <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent relative z-10 font-medium text-lg">
                  EDIT LINK
                </span>
              </button>
              <button
                onClick={nextStep}
                className="w-2/3 py-3 px-6 rounded-full font-inter font-medium text-lg text-white transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                }}
              >
                PROCEED TO PAYMENT
              </button>
            </div>
            
            {/* Login prompt for unauthenticated users */}
            {!isLoggedIn && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-inter text-sm font-medium">
                    Please login to continue with your order
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-inter text-lg font-medium text-[#374151] mb-4">
                Choose Payment Method:
              </h3>
              <div className="space-y-4">
                <label
                  className={`flex flex-col gap-3 p-4 border rounded-lg cursor-not-allowed opacity-50 ${
                    formData.paymentMethod === "sol"
                      ? "border-[#9945FF] bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="sol"
                        checked={formData.paymentMethod === "sol"}
                        onChange={() => handlePaymentMethodChange("sol")}
                        className="sr-only"
                        disabled
                      />
                      <div className="relative w-6 h-6">
                        {formData.paymentMethod === "sol" ? (
                          // Selected state with gradient border and fill
                          <div
                            className="w-full h-full rounded-full p-1"
                            style={{
                              background:
                                "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-full border-2 border-[#374151B0] flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#374151B0]"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-inter font-medium text-[#374151]">
                        Pay with SOL (Crypto) <span className="text-xs text-red-500 font-medium">(Coming Soon)</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Includes MealCheap savings
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === "sol" && (
                    <div className="ml-9 ">
                      <div className="text-sm text-gray-500">
                        Auto-detect wallet (Phantom, Solflare, Backpack, etc.)
                      </div>
                    </div>
                  )}
                </label>

                <label
                  className={`flex flex-col gap-3 p-4 border rounded-lg cursor-not-allowed opacity-50 ${
                    formData.paymentMethod === "usdc"
                      ? "border-[#9945FF] bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="usdc"
                        checked={formData.paymentMethod === "usdc"}
                        onChange={() => handlePaymentMethodChange("usdc")}
                        className="sr-only"
                        disabled
                      />
                      <div className="relative w-6 h-6">
                        {formData.paymentMethod === "usdc" ? (
                          // Selected state with gradient border and fill
                          <div
                            className="w-full h-full rounded-full p-1"
                            style={{
                              background:
                                "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-full border-2 border-[#374151B0] flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#374151B0]"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-inter font-medium text-[#374151]">
                        Pay with USDC (Crypto) <span className="text-xs text-red-500 font-medium">(Coming Soon)</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Includes MealCheap savings
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === "usdc" && (
                    <div className="ml-9 ">
                      <div className="text-sm text-gray-500">
                        Auto-detect wallet (Phantom, Solflare, Backpack, etc.)
                      </div>
                    </div>
                  )}
                </label>

                <label
                  className={`flex flex-col gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    formData.paymentMethod === "card"
                      ? "border-[#9945FF] bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={() => handlePaymentMethodChange("card")}
                        className="sr-only"
                      />
                      <div className="relative w-6 h-6">
                        {formData.paymentMethod === "card" ? (
                          <div
                            className="w-full h-full rounded-full p-1"
                            style={{
                              background:
                                "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-full border-2 border-[#374151B0] flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#374151B0]"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-inter font-medium text-[#374151]">
                        Pay with Card (No discount)
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Full price - no savings applied
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="ml-9 pt-4 border-t border-gray-200">
                      <StripeCardElement 
                        onCardChange={handleCardChange}
                        error={cardError}
                      />
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                  <BsBoxSeamFill className="text-white text-sm" />
                </div>
                <div>
                  <h3 className="font-inter text-sm font-semibold text-[#111827]">
                    Order Summary Box
                  </h3>
                  {formData.orderSummary.restaurant?.name && (
                    <p className="font-inter text-xs text-[#6B7280]">
                      From {formData.orderSummary.restaurant.name}
                      {formData.orderSummary.restaurant?.address && (
                        <span> - {formData.orderSummary.restaurant.address}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1 text-sm ml-8 max-h-60 overflow-y-auto scrollbar-ultra-thin pr-2">
                {formData.orderSummary.customer?.displayName && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Customer:</span>
                    <span className="font-medium text-black">
                      {formData.orderSummary.customer.displayName}
                    </span>
                  </div>
                )}
                {formData.orderSummary.customer?.address && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Address:</span>
                    <span className="font-medium text-black">
                      {formData.orderSummary.customer.address}
                    </span>
                  </div>
                )}
                {formData.orderSummary.orderId && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Order ID:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.orderId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#374151]">Phone:</span>
                  <span className="font-medium text-black">
                    {formData.orderSummary.customer?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#374151]">Subtotal:</span>
                  <span className="font-medium">
                    ${formData.orderSummary.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {formData.orderSummary.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Service fee:</span>
                    <span className="font-medium">
                      ${formData.orderSummary.serviceFee?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#374151]">Delivery fee:</span>
                  <span className="font-medium">
                    ${formData.orderSummary.deliveryFee?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {formData.orderSummary.taxes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Taxes:</span>
                    <span className="font-medium">
                      ${formData.orderSummary.taxes?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                )}
                {formData.orderSummary.customer?.deliveryInstructions && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="text-[#374151] font-semibold text-sm mb-2">Delivery Instructions:</div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-[#6B7280]">
                      {formData.orderSummary.customer.deliveryInstructions}
                    </div>
                  </div>
                )}
                {(formData.orderSummary.savings > 0 || formData.orderSummary.discount > 0) && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Discount:</span>
                    <span className="font-medium text-[#166534]">
                      ${formData.orderSummary.savings?.toFixed(2) || '0.00'} ({formData.orderSummary.discount || 0}%)
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t-2 border-white/60 pt-4">
                  <span className="text-[#374151] font-bold text-sm">
                    Final Total:
                  </span>
                  <span className="text-[#166534] font-bold">
                    ${formData.orderSummary.finalTotal?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="w-1/3 py-3 px-6 rounded-full font-inter font-medium transition-all duration-300 hover:scale-105 relative"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(153, 69, 255, 1) 0%, rgba(20, 241, 149, 1) 100%)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    padding: "2px",
                  }}
                ></div>
                <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent relative z-10 font-medium text-lg">
                  BACK
                </span>
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessingPayment || isProcessingCardPayment}
                className="w-2/3 py-3 px-6 rounded-full font-inter font-medium text-lg text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background:
                    "linear-gradient(135deg, #14F195 0%, #9945FF 100%)",
                }}
              >
                 {isProcessingPayment || isProcessingCardPayment ? "PROCESSING..." : "PAY WITH CARD"}
              </button>
            </div>
            
            {/* Login prompt for unauthenticated users */}
            {!isLoggedIn && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-inter text-sm font-medium">
                    Please login to complete your order
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-start">
              <div className="text-lg font-inter font-medium text-[#374151] mb-2">
                Order ID: {formData.orderSummary.orderId || formData.orderId}
              </div>
              <div className="text-[#16EE96] font-inter font-medium mb-6">
                Your order is placed!
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                  <BsBoxSeamFill className="text-white text-sm" />
                </div>
                <div>
                  <h3 className="font-inter text-sm font-semibold text-[#111827]">
                    Order Summary Box
                  </h3>
                  {formData.orderSummary.restaurant?.name && (
                    <p className="font-inter text-xs text-[#6B7280]">
                      From {formData.orderSummary.restaurant.name}
                      {formData.orderSummary.restaurant?.address && (
                        <span> - {formData.orderSummary.restaurant.address}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm ml-8 max-h-60 overflow-y-auto scrollbar-ultra-thin pr-2">
                {formData.orderSummary.customer?.displayName && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Customer:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.customer.displayName}
                    </span>
                  </div>
                )}
                {formData.orderSummary.customer?.address && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Address:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.customer.address}
                    </span>
                  </div>
                )}
                {formData.orderSummary.orderId && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Order ID:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.orderId}
                    </span>
                  </div>
                )}
                {formData.orderSummary.customer?.phone && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Phone:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.customer.phone}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-2 border-b border-white/20 pb-4">
                  <div className="flex justify-between">
                    <span className="text-[#343853]">Subtotal:</span>
                    <span className="font-medium">
                      ${formData.orderSummary.price?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  {formData.orderSummary.serviceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#343853]">Service fee:</span>
                      <span className="font-medium">
                        ${formData.orderSummary.serviceFee?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#343853]">Delivery fee:</span>
                    <span className="font-medium">
                      ${formData.orderSummary.deliveryFee?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  {formData.orderSummary.taxes > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#343853]">Taxes:</span>
                      <span className="font-medium">
                        ${formData.orderSummary.taxes?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  )}
                  {(formData.orderSummary.savings > 0 || formData.orderSummary.discount > 0) && (
                    <div className="flex justify-between">
                      <span className="text-[#343853]">Discount:</span>
                      <span className="font-medium text-[#166534]">
                        ${formData.orderSummary.savings?.toFixed(2) || '0.00'} ({formData.orderSummary.discount || 0}%)
                      </span>
                    </div>
                  )}
                  {formData.orderSummary.customer?.deliveryInstructions && (
                    <div className="border-t border-gray-200 pt-3">
                      <div className="text-[#374151] font-semibold text-sm mb-2">Delivery Instructions:</div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-[#6B7280]">
                        {formData.orderSummary.customer.deliveryInstructions}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 border-b border-white/20 pb-4">
                  <div className="flex justify-between font-bold text-lg border-t-2 border-white/60 pt-4">
                    <span className="text-[#343853] font-bold text-sm">
                      Final Total
                    </span>
                    <span className="text-[#166534]">
                      ${formData.orderSummary.finalTotal?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between border-t-2 border-white/60 pt-4">
                  <span className="text-[#343853]">Payment By:</span>
                  <span className="font-medium">
                    {formData.paymentMethod === "card" ? "Card" : 
                     formData.paymentMethod === "sol" ? "SOL" : "SOL"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="w-1/3 py-3 px-6 rounded-full font-inter font-medium transition-all duration-300 hover:scale-105 relative"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(153, 69, 255, 1) 0%, rgba(20, 241, 149, 1) 100%)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    padding: "2px",
                  }}
                ></div>
                <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent relative z-10 font-medium text-lg">
                  BACK
                </span>
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="w-2/3 py-3 px-6 rounded-full font-inter font-medium text-lg text-white transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                }}
              >
                ORDER CHAT
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 h-[400px] flex flex-col">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-[#6B7280] font-inter">
                  {isSocketConnected ? 'Connected to support' : 'Connecting...'}
                </span>
              </div>
              <div className="text-xs text-[#6B7280] font-inter">
                Order #{formData.orderSummary.orderId || formData.orderId}
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                  <BsBoxSeamFill className="text-white text-sm" />
                </div>
                <div>
                  <h3 className="font-inter text-sm font-semibold text-[#111827]">
                    Order Summary Box
                  </h3>
                  {formData.orderSummary.restaurant?.name && (
                    <p className="font-inter text-xs text-[#6B7280]">
                      From {formData.orderSummary.restaurant.name}
                      {formData.orderSummary.restaurant?.address && (
                        <span> - {formData.orderSummary.restaurant.address}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm max-h-60 overflow-y-auto scrollbar-ultra-thin pr-2">
                {formData.orderSummary.customer?.displayName && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Customer:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.customer.displayName}
                    </span>
                  </div>
                )}
                {formData.orderSummary.customer?.address && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Address:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.customer.address}
                    </span>
                  </div>
                )}
                {formData.orderSummary.orderId && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Order ID:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.orderId}
                    </span>
                  </div>
                )}
                {formData.orderSummary.customer?.phone && (
                  <div className="flex justify-between">
                    <span className="text-[#374151]">Phone:</span>
                    <span className="font-medium text-[#9945FF]">
                      {formData.orderSummary.customer.phone}
                    </span>
                  </div>
                )}
                {formData.orderSummary.customer?.deliveryInstructions && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="text-[#374151] font-semibold text-sm mb-2">Delivery Instructions:</div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-[#6B7280]">
                      {formData.orderSummary.customer.deliveryInstructions}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div
              className="rounded-lg p-4 mb-4"
              style={{
                background:
                  "linear-gradient(90deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
                borderLeft: "4px solid #9945FF",
              }}
            >
              <p className="text-sm text-[#6B7280] font-inter">
                <span className="font-semibold">
                  Notes:
                  <br />
                </span>{" "}
                This chat is only for help with completing your order. For
                general support click help from below links.
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#15193908] rounded-lg p-4">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center mx-auto mb-3">
                      <img src={userIcon} alt="support" className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-[#6B7280] font-inter">
                      Thank you for ordering. Support will be working on your order shortly.
                    </p>
                  </div>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center flex-shrink-0">
                      <img src={userIcon} alt="user" className="w-full h-full" />
                    </div>
                    <div className={`rounded-lg p-3 shadow-sm border max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white' 
                        : 'bg-white border-gray-100'
                    }`}>
                      <p className={`text-sm font-inter ${
                        message.type === 'system' 
                          ? 'text-[#6B7280] italic' 
                          : message.type === 'user'
                          ? 'text-white'
                          : 'text-[#374151]'
                      }`}>
                        {message.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-white/70' : 'text-[#9CA3AF]'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area - Fixed at bottom */}
            <div className="flex gap-2 mt-auto pt-4 bg-[#15193908] rounded-lg p-4">
              <input
                type="text"
                placeholder={isSocketConnected ? "Type your message here..." : "Connecting to chat..."}
                value={newMessage}
                onChange={handleMessageInput}
                onKeyPress={handleKeyPress}
                disabled={!isSocketConnected}
                className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9945FF] focus:border-[#9945FF] font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!isSocketConnected || !newMessage.trim()}
                className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: "white",
                }}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                  <svg
                    width="21"
                    height="22"
                    viewBox="0 0 21 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M20.1301 11.4089L1.68976 0.984456C1.59967 0.932474 1.49839 0.906412 1.39593 0.908848C1.29348 0.911283 1.19339 0.942132 1.10558 0.998342C1.01776 1.05455 0.945255 1.13418 0.895229 1.22935C0.845202 1.32452 0.819388 1.43193 0.820338 1.54097V9.41362C0.819293 9.56753 0.871534 9.71646 0.967095 9.83201C1.06266 9.94755 1.19485 10.0216 1.33846 10.0401L16.0872 12.002L1.36299 13.3061C1.21496 13.3185 1.0768 13.3899 0.976171 13.5061C0.875543 13.6222 0.819882 13.7746 0.820338 13.9326V21.162C0.81954 21.2683 0.844173 21.3731 0.891918 21.4664C0.939662 21.5598 1.00895 21.6387 1.09326 21.6957C1.17756 21.7528 1.27412 21.786 1.37384 21.7924C1.47355 21.7987 1.57315 21.778 1.66326 21.7321L20.1046 12.5345C20.2048 12.4856 20.2901 12.4077 20.3508 12.3097C20.4114 12.2117 20.445 12.0975 20.4476 11.9802C20.4503 11.8629 20.4219 11.7471 20.3658 11.6461C20.3096 11.5451 20.228 11.4629 20.1301 11.4089Z"
                      fill="url(#paint0_linear_573_35914)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_573_35914"
                        x1="0.820312"
                        y1="11.3511"
                        x2="20.4478"
                        y2="11.3511"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#9945FF" />
                        <stop offset="1" stopColor="#14F195" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section
      className="py-20 mt-[-180px] md:mt-[-180px] xl:mt-[-150px] relative overflow-hidden"
      style={{
        background: `url(${reviewbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 top-72 lg:top-56">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <svg
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.4297 0C31.4754 0 40.4297 8.9543 40.4297 20C40.4297 31.0457 31.4754 40 20.4297 40C9.38399 40 0.429688 31.0457 0.429688 20C0.429688 8.9543 9.38399 0 20.4297 0C20.4297 15 7.09635 20 0.429688 20C15.4297 20 20.4297 33.3333 20.4297 40C20.4297 25 33.763 20 40.4297 20C25.4297 20 20.4297 6.66667 20.4297 0Z"
                fill="url(#paint0_linear_573_10507)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_573_10507"
                  x1="0.429688"
                  y1="20"
                  x2="40.4297"
                  y2="20"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9945FF" />
                  <stop offset="1" stopColor="#14F195" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <span className="text-white text-3xl md:text-[50px] font-bold font-inter">
                Big Savings{" "}
              </span>
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-3xl md:text-[50px] !font-bold font-inter">
                MealCheap
              </span>
            </div>
          </div>
        </div>

        {/* Main Order Form */}
        <div className="max-w-5xl mx-auto pb-20 mb-56">
          {/* Blue Glass Effect Background */}
          <div
            className="rounded-3xl p-4 border border-[#FFFFFF3B] w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar - Progress Steps */}
                <div className="lg:w-1/4 bg-[#131A3D] rounded-3xl p-6 relative">
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "exclude",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      padding: "10px",
                    }}
                  ></div>

                  <div className="relative z-10 flex flex-col h-full">
                    {currentStep === 5 ? (
                      // Chat step design - Order Summary Box only
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                            <BsBoxSeamFill className="text-white text-sm" />
                          </div>
                          <div>
                            <h3 className="font-inter text-sm font-semibold text-[#111827]">
                              Order Summary Box
                            </h3>
                            {formData.orderSummary.restaurant?.name && (
                              <p className="font-inter text-xs text-[#6B7280]">
                                From {formData.orderSummary.restaurant.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm max-h-60 overflow-y-auto scrollbar-ultra-thin pr-2">
                          <div className="flex justify-between">
                            <span className="text-[#374151]">Subtotal:</span>
                            <span className="font-medium">
                              ${formData.orderSummary.price?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          {formData.orderSummary.serviceFee > 0 && (
                            <div className="flex justify-between">
                              <span className="text-[#374151]">Service fee:</span>
                              <span className="font-medium">
                                ${formData.orderSummary.serviceFee?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-[#374151]">Delivery fee:</span>
                            <span className="font-medium">
                              ${formData.orderSummary.deliveryFee?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          {formData.orderSummary.taxes > 0 && (
                            <div className="flex justify-between">
                              <span className="text-[#374151]">Taxes:</span>
                              <span className="font-medium">
                                ${formData.orderSummary.taxes?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          )}
                          {(formData.orderSummary.savings > 0 || formData.orderSummary.discount > 0) && (
                            <div className="flex justify-between">
                              <span className="text-[#374151]">Discount:</span>
                              <span className="font-medium text-[#166534]">
                                ${formData.orderSummary.savings?.toFixed(2) || '0.00'} ({formData.orderSummary.discount || 0}%)
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-lg border-t-2 border-white/60 pt-4">
                            <span className="text-[#374151] font-bold text-sm">
                              Final Total:
                            </span>
                            <span className="text-[#166534] font-bold">
                              ${formData.orderSummary.finalTotal?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="flex justify-between border-t-2 border-white/60 pt-4">
                            <span className="text-[#374151]">Payment By:</span>
                            <span className="font-medium">
                              {formData.paymentMethod === "card" ? "Card" : 
                               formData.paymentMethod === "sol" ? "SOL" : "SOL"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Regular progress steps design
                      <div className="space-y-10 mb-5">
                        {steps
                          .filter((step) => step.id <= 4)
                          .map((step, index) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                              <div key={step.id} className="relative">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isCompleted
                                        ? "bg-[#16EE96]"
                                        : isActive
                                        ? "relative"
                                        : "bg-white border-1 border-white"
                                    }`}
                                  >
                                    {isCompleted ? null : isActive ? ( // Completed step - no icon, just solid green circle
                                      // Active step - gradient background with gradient border and BsBoxSeamFill icon
                                      <div
                                        className="w-full h-full rounded-full flex items-center justify-center relative p-0.5"
                                        style={{
                                          background:
                                            "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                                        }}
                                      >
                                        {/* Gradient border using pseudo-element technique */}
                                        <div
                                          className="absolute inset-0 rounded-full"
                                          style={{
                                            background:
                                              "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                                            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                            maskComposite: "exclude",
                                            WebkitMask:
                                              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                            WebkitMaskComposite: "xor",
                                            padding: "2px",
                                          }}
                                        ></div>
                                        <div className="relative w-full h-full bg-black rounded-full p-1">
                                          <BsBoxSeamFill className="w-full h-full text-white text-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full p-2" />
                                        </div>
                                      </div>
                                    ) : (
                                      // Inactive step - BsBoxSeamFill icon with dark background
                                      <div className="w-full h-full rounded-full bg-[#131A3D] border-2 border-white flex items-center justify-center">
                                        <div className="w-5 h-5 bg-white rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-white/60 text-xs font-inter font-medium tracking-wider mb-1">
                                      STEP {step.id}
                                    </div>
                                    <div
                                      className={`font-inter font-medium leading-tight ${
                                        isActive
                                          ? "text-white font-semibold text-sm"
                                          : "text-white/80 text-sm"
                                      }`}
                                    >
                                      {step.title}
                                    </div>
                                  </div>
                                </div>
                                {index < 3 && (
                                  <div
                                    className={`absolute left-6 top-14 w-0.5 h-6 ${
                                      isCompleted
                                        ? "bg-[#16EE96]"
                                        : "bg-white/20"
                                    }`}
                                  ></div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* Spacer to push Contact Us button to bottom */}
                    <div className="flex-1"></div>

                    {/* Contact Us Button - Fixed at bottom for all steps */}
                    <button
                      className="w-full px-4 py-3 rounded-lg text-white font-inter text-sm hover:bg-white/5 transition-colors border border-white/20 mt-5"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <IoIosHelpCircleOutline className="text-white text-lg w-6 h-6" />
                        <div className="text-left">
                          <div className="text-white/60 text-[7px] !font-medium font-inter">
                            Having troubles?
                          </div>
                          <div className="text-white font-inter !font-semibold !text-md">
                            Contact Us
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Right Side - Form Content */}
                <div className="bg-white rounded-3xl lg:w-3/4 p-8">
                  <h2 className="text-lg font-inter !font-bold text-[#111827] mb-6">
                    {currentStep === 5 ? "ORDER CHAT" : "ORDER FORM:"} <br />
                    {currentStep === 1 || currentStep === 5 ? "" : "" || ""}
                  </h2>

                  {renderStepContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;


