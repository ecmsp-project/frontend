import { useState, useMemo, useEffect } from "react";
import type { InvoiceFormValues } from "../components/forms/InvoiceForm.tsx";
import type { ShippingFormValues } from "../components/forms/ShippingForm.tsx";
import { useCartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const SHIPPING_COST = 19.99;
const FREE_SHIPPING_THRESHOLD = 500;
const DISCOUNT_CODE = "RABAT20";
const DISCOUNT_PERCENTAGE = 0.2; // 20%

const initialShippingData: ShippingFormValues = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  country: "PL",
  street: "",
  buildingNumber: "",
  apartmentNumber: "",
  postalCode: "",
  city: "",
};

const initialInvoiceData: InvoiceFormValues = {
  type: "personal",
};

export const useCheckout = () => {
  const { cartItems } = useCartContext();
  const navigate = useNavigate();

  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [discountCode, setDiscountCode] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState<ShippingFormValues>(initialShippingData);
  const [invoiceData, setInvoiceData] = useState<InvoiceFormValues>(initialInvoiceData);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Generuj numer zamówienia gdy shippingData jest wypełnione
  useEffect(() => {
    if (shippingData.firstName && !orderId) {
      // Generuj numer zamówienia w formacie ORD-XXXXXXXX-XXXX
      const newOrderId = `ORD-${crypto.randomUUID().toUpperCase().replace(/-/g, "").substring(0, 13)}`;
      setOrderId(newOrderId);
    }
  }, [shippingData.firstName, orderId]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const shipping = useMemo(
    () => (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST),
    [subtotal],
  );

  const discountAmount = useMemo(() => {
    if (!isDiscountApplied) return 0;
    return subtotal * DISCOUNT_PERCENTAGE;
  }, [subtotal, isDiscountApplied]);

  const totalBeforeDiscount = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const total = useMemo(
    () => totalBeforeDiscount - discountAmount,
    [totalBeforeDiscount, discountAmount],
  );

  const handleShippingSubmit = (values: ShippingFormValues) => {
    setShippingData(values);
    setShippingModalOpen(false);
  };

  const handleInvoiceSubmit = (values: InvoiceFormValues) => {
    setInvoiceData(values);
    setInvoiceModalOpen(false);
  };

  const handleInvoiceChange = (checked: boolean) => {
    setWantsInvoice(checked);
    if (checked) {
      setInvoiceModalOpen(true);
    }
  };

  const handleInvoiceModalClose = () => {
    setInvoiceModalOpen(false);
    if (!invoiceData.firstName && !invoiceData.companyName) {
      setWantsInvoice(false);
    }
  };

  const handleApplyDiscount = () => {
    const trimmedCode = discountCode.toUpperCase().trim();
    if (trimmedCode === DISCOUNT_CODE) {
      setIsDiscountApplied(true);
      setDiscountError(null);
    } else {
      setIsDiscountApplied(false);
      setDiscountError("Nieprawidłowy kod rabatowy");
    }
  };

  const handleClearDiscountError = () => {
    setDiscountError(null);
  };

  const handlePay = () => {
    if (!orderId) {
      console.error("Order ID not generated yet");
      return;
    }

    if (paymentMethod === "card") {
      // Przekieruj do strony płatności kartą z orderId w state
      const paymentId = crypto.randomUUID();
      navigate(`/payment/${paymentId}`, { state: { orderId } });
    } else {
      // Płatność przy odbiorze - przekieruj bezpośrednio do potwierdzenia
      navigate(`/order-confirmation/${orderId}`);
    }
  };

  const getShippingDataForInvoice = ():
    | {
        firstName: string;
        lastName: string;
        country: string;
        street: string;
        buildingNumber: string;
        apartmentNumber: string;
        postalCode: string;
        city: string;
      }
    | undefined => {
    if (!shippingData.firstName) {
      return undefined;
    }
    return {
      firstName: shippingData.firstName,
      lastName: shippingData.lastName,
      country: shippingData.country,
      street: shippingData.street,
      buildingNumber: shippingData.buildingNumber,
      apartmentNumber: shippingData.apartmentNumber,
      postalCode: shippingData.postalCode,
      city: shippingData.city,
    };
  };

  return {
    // State
    shippingModalOpen,
    invoiceModalOpen,
    wantsInvoice,
    paymentMethod,
    discountCode,
    shippingData,
    invoiceData,
    orderId,
    subtotal,
    shipping,
    total,
    totalBeforeDiscount,
    discountAmount,
    isDiscountApplied,
    discountError,
    canPay: !!shippingData.firstName,

    // Setters
    setShippingModalOpen,
    setInvoiceModalOpen,
    setPaymentMethod,
    setDiscountCode,

    // Handlers
    handleShippingSubmit,
    handleInvoiceSubmit,
    handleInvoiceChange,
    handleInvoiceModalClose,
    handleApplyDiscount,
    handleClearDiscountError,
    handlePay,
    getShippingDataForInvoice,
  };
};
