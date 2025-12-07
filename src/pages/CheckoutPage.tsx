import React, { useState, useRef } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs.tsx";
import InvoiceForm, {
  type InvoiceFormValues,
  type InvoiceFormRef,
} from "../components/forms/InvoiceForm.tsx";
import ShippingForm, {
  type ShippingFormValues,
  type ShippingFormRef,
} from "../components/forms/ShippingForm.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import { useCartContext } from "../contexts/CartContext";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DiscountIcon from "@mui/icons-material/Discount";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  Button,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  useTheme,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SHIPPING_COST = 19.99;
const FREE_SHIPPING_THRESHOLD = 500;

// Używamy typów z formularzy
type ShippingData = ShippingFormValues;
type InvoiceData = InvoiceFormValues;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cartItems } = useCartContext();

  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [discountCode, setDiscountCode] = useState("");

  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    country: "Polska",
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
    postalCode: "",
    city: "",
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    type: "personal",
  });

  const shippingFormRef = useRef<ShippingFormRef>(null);
  const invoiceFormRef = useRef<InvoiceFormRef>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleShippingSubmit = (values: ShippingFormValues) => {
    setShippingData(values);
    setShippingModalOpen(false);
  };

  const handleInvoiceSubmit = (values: InvoiceFormValues) => {
    setInvoiceData(values);
    setInvoiceModalOpen(false);
  };

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h5" color="text.secondary">
            Twój koszyk jest pusty. Nie można przejść do kasy.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/cart")}>
            Wróć do koszyka
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
            items={[{ label: "Koszyk", path: "/cart" }, { label: "Dostawa i Płatność" }]}
          />
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Dostawa i Płatność
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <LocalShippingIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Odbiorca przesyłki
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {shippingData.firstName ? (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  }}
                >
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    {shippingData.firstName} {shippingData.lastName}
                  </Typography>
                  {shippingData.company && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {shippingData.company}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {shippingData.street} {shippingData.buildingNumber}
                    {shippingData.apartmentNumber && `/${shippingData.apartmentNumber}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {shippingData.postalCode} {shippingData.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {shippingData.phone}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => setShippingModalOpen(true)}
                  >
                    Edytuj dane
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setShippingModalOpen(true)}
                  sx={{ py: 1.5 }}
                >
                  Wprowadź dane odbiorcy
                </Button>
              )}

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={wantsInvoice}
                      onChange={(e) => {
                        setWantsInvoice(e.target.checked);
                        if (e.target.checked) {
                          setInvoiceModalOpen(true);
                        }
                      }}
                    />
                  }
                  label="Chcesz otrzymać fakturę?"
                />
                {wantsInvoice && (invoiceData.companyName || invoiceData.firstName) && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: alpha(theme.palette.success.main, 0.2),
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} color="success.main" gutterBottom>
                      Dane do faktury wprowadzone
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {invoiceData.type === "company"
                        ? `${invoiceData.companyName} (NIP: ${invoiceData.nip})`
                        : `${invoiceData.firstName} ${invoiceData.lastName}`}
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => setInvoiceModalOpen(true)}
                    >
                      Edytuj
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>

            <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <PaymentIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Metoda płatności
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as "card" | "cod")}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                          p: 2,
                          border: "1px solid",
                          borderColor: paymentMethod === "card" ? "primary.main" : "divider",
                          borderRadius: 2,
                          bgcolor:
                            paymentMethod === "card"
                              ? alpha(theme.palette.primary.main, 0.05)
                              : "transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        <CreditCardIcon color={paymentMethod === "card" ? "primary" : "action"} />
                        <Typography fontWeight={paymentMethod === "card" ? 600 : 400}>
                          Karta płatnicza
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2, width: "100%", m: 0 }}
                  />
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                          p: 2,
                          border: "1px solid",
                          borderColor: paymentMethod === "cod" ? "primary.main" : "divider",
                          borderRadius: 2,
                          bgcolor:
                            paymentMethod === "cod"
                              ? alpha(theme.palette.primary.main, 0.05)
                              : "transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        <LocalAtmIcon color={paymentMethod === "cod" ? "primary" : "action"} />
                        <Typography fontWeight={paymentMethod === "cod" ? 600 : 400}>
                          Płatność przy odbiorze
                        </Typography>
                      </Box>
                    }
                    sx={{ width: "100%", m: 0 }}
                  />
                </RadioGroup>
              </FormControl>
            </Card>

            <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <DiscountIcon color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  Zniżki
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Kod rabatowy
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Wprowadź kod rabatowy"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <Button variant="outlined" disabled={!discountCode}>
                    Zastosuj
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={4}
              sx={{
                p: 3,
                position: "sticky",
                top: 20,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha("#fff", 0.95)} 0%, ${alpha("#f5f5f5", 0.95)} 100%)`,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
                Podsumowanie
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Wartość produktów:
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {subtotal.toFixed(2)} PLN
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Koszt wysyłki:
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color={shipping === 0 ? "success.main" : "text.primary"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {shipping === 0 && <LocalShippingIcon fontSize="small" />}
                  {shipping === 0 ? "GRATIS" : `${shipping.toFixed(2)} PLN`}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  RAZEM:
                </Typography>
                <Typography variant="h5" color="primary.main" fontWeight={700}>
                  {total.toFixed(2)} PLN
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={!shippingData.firstName}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 3,
                  },
                  transition: "box-shadow 0.2s ease",
                }}
              >
                Zapłać
              </Button>
            </Card>
          </Grid>
        </Grid>

        <Dialog
          open={shippingModalOpen}
          onClose={() => setShippingModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="h6" fontWeight={600}>
              Dane odbiorcy przesyłki
            </Typography>
            <IconButton onClick={() => setShippingModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <ShippingForm
              ref={shippingFormRef}
              initialValues={shippingData}
              onSubmit={handleShippingSubmit}
              enableReinitialize
              showSubmitButton={false}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShippingModalOpen(false)}>Anuluj</Button>
            <Button
              variant="contained"
              onClick={() => {
                shippingFormRef.current?.submitForm();
              }}
            >
              Zatwierdź
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal: Dane do faktury */}
        <Dialog
          open={invoiceModalOpen}
          onClose={() => {
            setInvoiceModalOpen(false);
            if (!invoiceData.firstName && !invoiceData.companyName) {
              setWantsInvoice(false);
            }
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="h6" fontWeight={600}>
              Dane do faktury
            </Typography>
            <IconButton
              onClick={() => {
                setInvoiceModalOpen(false);
                if (!invoiceData.firstName && !invoiceData.companyName) {
                  setWantsInvoice(false);
                }
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <InvoiceForm
              ref={invoiceFormRef}
              initialValues={invoiceData}
              onSubmit={handleInvoiceSubmit}
              enableReinitialize
              shippingData={
                shippingData.firstName
                  ? {
                      firstName: shippingData.firstName,
                      lastName: shippingData.lastName,
                      street: shippingData.street,
                      buildingNumber: shippingData.buildingNumber,
                      apartmentNumber: shippingData.apartmentNumber,
                      postalCode: shippingData.postalCode,
                      city: shippingData.city,
                    }
                  : undefined
              }
              showSubmitButton={false}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => {
                setInvoiceModalOpen(false);
                if (!invoiceData.firstName && !invoiceData.companyName) {
                  setWantsInvoice(false);
                }
              }}
            >
              Anuluj
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                invoiceFormRef.current?.submitForm();
              }}
            >
              Zatwierdź
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default CheckoutPage;
