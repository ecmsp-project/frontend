import React from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Box, Typography, Card, Divider, Button, alpha, useTheme } from "@mui/material";

interface PaymentSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  canPay: boolean;
  isProcessing: boolean;
  onPay: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  shipping,
  total,
  canPay,
  isProcessing,
  onPay,
}) => {
  const theme = useTheme();

  return (
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
        Podsumowanie płatności
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
          alignItems: "center",
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: 2,
          mb: 3,
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
        disabled={!canPay || isProcessing}
        onClick={onPay}
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
        {isProcessing ? "Przetwarzanie..." : "Zatwierdź płatność"}
      </Button>
    </Card>
  );
};

export default PaymentSummary;
