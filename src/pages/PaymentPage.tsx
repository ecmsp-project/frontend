import React, { useRef, useState } from "react";
import { getPaymentLink, processPayment } from "../api/payment-service.ts";
import Breadcrumbs from "../components/common/Breadcrumbs.tsx";
import CardForm, { type CardFormRef } from "../components/forms/CardForm.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import { useCartContext } from "../contexts/CartContext";
import { usePayment, type CardFormValues } from "../hooks/usePayment.ts";
import PaymentSummary from "./payment/PaymentSummary.tsx";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  Box,
  Typography,
  Container,
  Grid,
  Alert,
  Card,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { cartItems, clearFullCart } = useCartContext();
  const { subtotal, total, paymentError, isProcessing, handlePayment, clearPaymentError } =
    usePayment();
  const cardFormRef = useRef<CardFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (values: CardFormValues) => {
    clearPaymentError();
    const success = await handlePayment(values);
    if (success) {
      // Set redirecting flag to prevent showing empty cart message
      setIsRedirecting(true);
      // Clear cart before navigation
      await clearFullCart();
      // Redirect to order confirmation page with security token
      if (orderId) {
        const paymentLink = await getPaymentLink(orderId);
        await processPayment(paymentLink);
        const confirmationToken = crypto.randomUUID();
        navigate(`/order-confirmation/${orderId}/${confirmationToken}`);
      } else {
        // Fallback - if there's no orderId, redirect to home page
        navigate("/");
      }
    }
  };

  const handleFormSubmit = () => {
    if (cardFormRef.current) {
      cardFormRef.current.submitForm();
    }
  };

  // Show loading screen while redirecting after successful payment
  if (isRedirecting) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              Processing your payment...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Redirecting to confirmation page
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  // Don't show empty cart message if we're processing payment or have an orderId
  // (user might be returning to pay for a pending order)
  if (cartItems.length === 0 && !isProcessing && !orderId) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h5" color="text.secondary">
            Your cart is empty. Cannot proceed to payment.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/cart")}>
            Back to Cart
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs
            items={[
              { label: "Cart", path: "/cart" },
              { label: "Shipping and Payment", path: orderId ? `/order/${orderId}` : "/order" },
              { label: "Payment" },
            ]}
          />
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Card Payment
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <CreditCardIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Payment Card Information
                </Typography>
              </Box>

              {paymentError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={clearPaymentError}>
                  {paymentError}
                </Alert>
              )}

              <CardForm
                ref={cardFormRef}
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
                onValidationChange={setIsFormValid}
              />
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PaymentSummary
              subtotal={subtotal}
              total={total}
              canPay={isFormValid}
              isProcessing={isProcessing}
              onPay={handleFormSubmit}
            />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default PaymentPage;
