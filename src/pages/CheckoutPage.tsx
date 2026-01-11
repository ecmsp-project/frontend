import React from "react";
import Breadcrumbs from "../components/common/Breadcrumbs.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import { useCartContext } from "../contexts/CartContext";
import { useCheckout } from "../hooks/useCheckout.ts";
import DiscountSection from "./checkout/DiscountSection.tsx";
import InvoiceModal from "./checkout/InvoiceModal.tsx";
import OrderSummary from "./checkout/OrderSummary.tsx";
import ShippingModal from "./checkout/ShippingModal.tsx";
import ShippingSection from "./checkout/ShippingSection.tsx";
import { Box, Typography, Container, Grid, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId: urlOrderId } = useParams<{ orderId: string }>();
  const { cartItems } = useCartContext();
  const {
    shippingModalOpen,
    invoiceModalOpen,
    wantsInvoice,
    discountCode,
    shippingData,
    invoiceData,
    subtotal,
    shipping,
    total,
    totalBeforeDiscount,
    discountAmount,
    isDiscountApplied,
    discountError,
    canPay,
    setShippingModalOpen,
    setInvoiceModalOpen,
    setDiscountCode,
    handleShippingSubmit,
    handleInvoiceSubmit,
    handleInvoiceChange,
    handleInvoiceModalClose,
    handleApplyDiscount,
    handleClearDiscountError,
    handlePay,
    getShippingDataForInvoice,
  } = useCheckout(urlOrderId || undefined);

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h5" color="text.secondary">
            Your cart is empty. Cannot proceed to checkout.
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
            items={[{ label: "Cart", path: "/cart" }, { label: "Shipping and Payment" }]}
          />
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Shipping and Payment
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ShippingSection
              shippingData={shippingData}
              invoiceData={invoiceData}
              wantsInvoice={wantsInvoice}
              onEditShipping={() => setShippingModalOpen(true)}
              onInvoiceChange={handleInvoiceChange}
              onEditInvoice={() => setInvoiceModalOpen(true)}
            />
            <DiscountSection
              discountCode={discountCode}
              isDiscountApplied={isDiscountApplied}
              discountError={discountError}
              onDiscountCodeChange={setDiscountCode}
              onApplyDiscount={handleApplyDiscount}
              onClearError={handleClearDiscountError}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              totalBeforeDiscount={totalBeforeDiscount}
              discountAmount={discountAmount}
              isDiscountApplied={isDiscountApplied}
              canPay={canPay}
              onPay={handlePay}
            />
          </Grid>
        </Grid>

        <ShippingModal
          open={shippingModalOpen}
          shippingData={shippingData}
          onClose={() => setShippingModalOpen(false)}
          onSubmit={handleShippingSubmit}
        />

        <InvoiceModal
          open={invoiceModalOpen}
          invoiceData={invoiceData}
          shippingData={getShippingDataForInvoice()}
          onClose={() => setInvoiceModalOpen(false)}
          onSubmit={handleInvoiceSubmit}
          onCloseWithoutData={handleInvoiceModalClose}
        />
      </Container>
    </MainLayout>
  );
};

export default CheckoutPage;
