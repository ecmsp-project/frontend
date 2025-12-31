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

const getStorageKey = (orderId: string) => `checkout_data_${orderId}`;

interface CheckoutStorageData {
  shippingData: ShippingFormValues;
  invoiceData: InvoiceFormValues;
  wantsInvoice: boolean;
  paymentMethod: "card" | "cod";
  discountCode: string;
  isDiscountApplied: boolean;
}

// Helper function to load data from sessionStorage
const loadCheckoutDataFromStorage = (
  orderId: string | null,
): Partial<CheckoutStorageData> | null => {
  if (!orderId) return null;

  const storageKey = getStorageKey(orderId);
  const savedData = sessionStorage.getItem(storageKey);
  if (savedData) {
    try {
      return JSON.parse(savedData) as CheckoutStorageData;
    } catch (error) {
      console.error("Error loading checkout data from storage:", error);
      return null;
    }
  }
  return null;
};

export const useCheckout = (initialOrderId?: string) => {
  const { cartItems } = useCartContext();
  const navigate = useNavigate();

  // Load data from sessionStorage synchronously on initialization
  const savedData = loadCheckoutDataFromStorage(initialOrderId || null);

  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [wantsInvoice, setWantsInvoice] = useState(savedData?.wantsInvoice || false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">(
    savedData?.paymentMethod || "card",
  );
  const [discountCode, setDiscountCode] = useState(savedData?.discountCode || "");
  const [isDiscountApplied, setIsDiscountApplied] = useState(savedData?.isDiscountApplied || false);
  const [discountError, setDiscountError] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState<ShippingFormValues>(
    savedData?.shippingData || initialShippingData,
  );
  const [invoiceData, setInvoiceData] = useState<InvoiceFormValues>(
    savedData?.invoiceData || initialInvoiceData,
  );
  const [orderId, setOrderId] = useState<string | null>(initialOrderId || null);

  // Use orderId from URL if provided and load data from storage
  useEffect(() => {
    if (initialOrderId) {
      // Set orderId if not already set
      if (!orderId) {
        setOrderId(initialOrderId);
      }

      // Load data from storage when initialOrderId changes (e.g., when returning from PaymentPage)
      const newSavedData = loadCheckoutDataFromStorage(initialOrderId);
      if (newSavedData) {
        // Update only if data is different from current (avoid unnecessary updates)
        if (
          newSavedData.shippingData &&
          JSON.stringify(newSavedData.shippingData) !== JSON.stringify(shippingData)
        ) {
          setShippingData(newSavedData.shippingData);
        }
        if (
          newSavedData.invoiceData &&
          JSON.stringify(newSavedData.invoiceData) !== JSON.stringify(invoiceData)
        ) {
          setInvoiceData(newSavedData.invoiceData);
        }
        if (newSavedData.wantsInvoice !== undefined && newSavedData.wantsInvoice !== wantsInvoice) {
          setWantsInvoice(newSavedData.wantsInvoice);
        }
        if (newSavedData.paymentMethod && newSavedData.paymentMethod !== paymentMethod) {
          setPaymentMethod(newSavedData.paymentMethod);
        }
        if (newSavedData.discountCode && newSavedData.discountCode !== discountCode) {
          setDiscountCode(newSavedData.discountCode);
        }
        if (
          newSavedData.isDiscountApplied !== undefined &&
          newSavedData.isDiscountApplied !== isDiscountApplied
        ) {
          setIsDiscountApplied(newSavedData.isDiscountApplied);
        }
      }
    }
  }, [initialOrderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save data to sessionStorage when it changes (but not on first render if data is already in storage)
  useEffect(() => {
    if (orderId) {
      // Check if this is the first render with data from storage
      const storageKey = getStorageKey(orderId);
      const existingData = sessionStorage.getItem(storageKey);

      // If data already exists and is the same as current, don't save (avoid unnecessary saves)
      if (existingData) {
        try {
          const parsed: CheckoutStorageData = JSON.parse(existingData);
          // Compare only key fields to avoid saving if nothing changed
          if (
            JSON.stringify(parsed.shippingData) === JSON.stringify(shippingData) &&
            JSON.stringify(parsed.invoiceData) === JSON.stringify(invoiceData) &&
            parsed.wantsInvoice === wantsInvoice &&
            parsed.paymentMethod === paymentMethod &&
            parsed.discountCode === discountCode &&
            parsed.isDiscountApplied === isDiscountApplied
          ) {
            return; // Don't save if data is identical
          }
        } catch {
          // If cannot parse, save new data
        }
      }

      const dataToSave: CheckoutStorageData = {
        shippingData,
        invoiceData,
        wantsInvoice,
        paymentMethod,
        discountCode,
        isDiscountApplied,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [
    orderId,
    shippingData,
    invoiceData,
    wantsInvoice,
    paymentMethod,
    discountCode,
    isDiscountApplied,
  ]);

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
    // Data will be automatically saved by useEffect
  };

  const handleInvoiceSubmit = (values: InvoiceFormValues) => {
    setInvoiceData(values);
    setInvoiceModalOpen(false);
    // Data will be automatically saved by useEffect
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
      setDiscountError("Invalid discount code");
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
      // Redirect to card payment page with orderId in URL
      const paymentId = crypto.randomUUID();
      navigate(`/payment/${paymentId}/${orderId}`);
    } else {
      // Cash on delivery - redirect directly to confirmation with token
      const confirmationToken = crypto.randomUUID();
      navigate(`/order-confirmation/${orderId}/${confirmationToken}`);
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
