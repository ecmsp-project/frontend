import React, { useRef, useState } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs.tsx";
import CardForm, { type CardFormRef } from "../components/forms/CardForm.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import { useCartContext } from "../contexts/CartContext";
import { usePayment, type CardFormValues } from "../hooks/usePayment.ts";
import PaymentSummary from "./payment/PaymentSummary.tsx";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Box, Typography, Container, Grid, Alert, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartContext();
  const {
    subtotal,
    shipping,
    total,
    paymentError,
    isProcessing,
    handlePayment,
    clearPaymentError,
  } = usePayment();
  const cardFormRef = useRef<CardFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSubmit = async (values: CardFormValues) => {
    clearPaymentError();
    const success = await handlePayment(values);
    if (success) {
      // Wyczyść koszyk po udanej płatności
      await clearCart();
      // Przekieruj do strony głównej
      navigate("/");
    }
  };

  const handleFormSubmit = () => {
    if (cardFormRef.current) {
      cardFormRef.current.submitForm();
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs
            items={[
              { label: "Koszyk", path: "/cart" },
              { label: "Dostawa i Płatność", path: "/transaction/order" },
              { label: "Płatność" },
            ]}
          />
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Płatność kartą
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
                  Dane karty płatniczej
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
              shipping={shipping}
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
