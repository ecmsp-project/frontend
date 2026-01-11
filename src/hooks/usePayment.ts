import { useState, useMemo } from "react";
import { useCartContext } from "../contexts/CartContext";

const VALID_CARD = {
  cardNumber: "4111111111111111",
  cardholderName: "JAN KOWALSKI",
  expiryDate: "12/25",
  cvv: "123",
};

const SHIPPING_COST = 19.99;
const FREE_SHIPPING_THRESHOLD = 500;

export interface CardFormValues {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

export const usePayment = () => {
  const { cartItems } = useCartContext();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const shipping = useMemo(
    () => (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST),
    [subtotal],
  );

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const validateCard = (values: CardFormValues): boolean => {
    const normalizedCardNumber = values.cardNumber.replace(/\s/g, "");
    const normalizedExpiry = values.expiryDate.replace(/\//g, "");
    const normalizedName = values.cardholderName.toUpperCase().trim();

    if (
      normalizedCardNumber === VALID_CARD.cardNumber &&
      normalizedExpiry === VALID_CARD.expiryDate.replace(/\//g, "") &&
      normalizedName === VALID_CARD.cardholderName &&
      values.cvv === VALID_CARD.cvv
    ) {
      return true;
    }

    return false;
  };

  const handlePayment = async (values: CardFormValues): Promise<boolean> => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!validateCard(values)) {
        setPaymentError("Invalid card data. Please check the entered information.");
        setIsProcessing(false);
        return false;
      }

      setIsProcessing(false);
      return true;
    } catch (err) {
      console.error("Error processing payment:", err);
      setPaymentError("An error occurred while processing the payment.");
      setIsProcessing(false);
      return false;
    }
  };

  const clearPaymentError = () => {
    setPaymentError(null);
  };

  return {
    subtotal,
    shipping,
    total,
    paymentError,
    isProcessing,
    handlePayment,
    clearPaymentError,
  };
};
