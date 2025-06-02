import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';
import { createApiUrl } from '@/config/api';

interface CheckoutFormProps {
  cartItems: any[];
  orderSummary: {
    subtotal: number;
    shipping: number;
    total: number;
  };
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, orderSummary }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment failed:', error);
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred while processing your payment.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded, confirm with backend
        await confirmPaymentWithBackend(paymentIntent.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPaymentWithBackend = async (paymentIntentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(createApiUrl('api/payment/confirm-payment'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId,
          items: cartItems,
          shippingAddress,
          billingAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart after successful payment
        await clearCart();
        
        toast({
          title: "Payment Successful!",
          description: "Your order has been confirmed. You will receive a confirmation email shortly.",
        });

        // Navigate to success page with order details
        navigate('/order-success', { 
          state: { 
            order: data.order,
            paymentIntentId 
          } 
        });
      } else {
        throw new Error(data.message || 'Failed to confirm payment');
      }
    } catch (error) {
      console.error('Backend confirmation error:', error);
      toast({
        title: "Order Processing Error",
        description: "Payment succeeded but there was an issue processing your order. Please contact support.",
        variant: "destructive",
      });
    }
  };

  // Enhanced address element options with better autocomplete configuration
  const addressElementOptions = {
    mode: 'shipping' as const,
    allowedCountries: ['US', 'CA', 'IN'],
    fields: {
      phone: 'always' as const,
    },
    validation: {
      phone: {
        required: 'always' as const,
      },
    },
    autocomplete: {
      mode: 'automatic' as const,
    },
    // Additional options to help with dropdown issues
    defaultValues: {
      country: 'IN', // Set India as default since you updated contact info to Mumbai
    },
  };

  const billingAddressElementOptions = {
    mode: 'billing' as const,
    allowedCountries: ['US', 'CA', 'IN'],
    fields: {
      phone: 'never' as const,
    },
    autocomplete: {
      mode: 'automatic' as const,
    },
    defaultValues: {
      country: 'IN',
    },
  };

  return (
    <div className="relative checkout-form-container">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Address */}
        <div className="relative address-container">
          <h3 className="text-lg font-medium text-gold-300 mb-4">Shipping Address</h3>
          <div className="p-4 border border-gold-600/20 rounded-lg bg-gray-800/50 relative stripe-address-wrapper">
            <AddressElement
              options={addressElementOptions}
              onChange={(event) => {
                console.log('Shipping address event:', event);
                if (event.complete) {
                  setShippingAddress(event.value);
                  console.log('Shipping address set:', event.value);
                }
              }}
            />
          </div>
        </div>

        {/* Billing Address */}
        <div className="relative address-container">
          <h3 className="text-lg font-medium text-gold-300 mb-4">Billing Address</h3>
          <div className="p-4 border border-gold-600/20 rounded-lg bg-gray-800/50 relative stripe-address-wrapper">
            <AddressElement
              options={billingAddressElementOptions}
              onChange={(event) => {
                console.log('Billing address event:', event);
                if (event.complete) {
                  setBillingAddress(event.value);
                  console.log('Billing address set:', event.value);
                }
              }}
            />
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <h3 className="text-lg font-medium text-gold-300 mb-4">Payment Information</h3>
          <div className="p-4 border border-gold-600/20 rounded-lg bg-gray-800/50">
            <PaymentElement />
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg">
          <Lock className="mr-2" size={16} />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || !elements || isLoading}
          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black py-4 px-6 rounded-lg
                   font-semibold text-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-300
                   transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:transform-none flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Processing Payment...
            </>
          ) : (
            `Pay $${orderSummary.total.toFixed(2)}`
          )}
        </button>

        {/* Payment Methods */}
        <div className="text-center text-sm text-gray-400">
          <p>We accept all major credit cards and digital wallets</p>
          <div className="flex justify-center space-x-4 mt-2">
            <span className="text-gold-400">💳 Visa</span>
            <span className="text-gold-400">💳 Mastercard</span>
            <span className="text-gold-400">💳 AmEx</span>
            <span className="text-gold-400">📱 Apple Pay</span>
            <span className="text-gold-400">📱 Google Pay</span>
          </div>
        </div>
      </form>
    </div>
  );
}; 