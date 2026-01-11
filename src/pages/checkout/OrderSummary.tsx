import React from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Box, Typography, Card, Divider, Button, alpha, useTheme } from "@mui/material";

interface OrderSummaryProps {
  subtotal: number;
  total: number;
  totalBeforeDiscount?: number;
  discountAmount?: number;
  isDiscountApplied?: boolean;
  canPay: boolean;
  onPay: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  total,
  totalBeforeDiscount,
  discountAmount = 0,
  isDiscountApplied = false,
  canPay,
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
        Summary
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Product value:
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {subtotal.toFixed(2)} PLN
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Shipping cost:
        </Typography>
        <Typography
          variant="h6"
          fontWeight={600}
          color="success.main"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <LocalShippingIcon fontSize="small" />
          GRATIS
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: 3,
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={700}>
            TOTAL:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            {isDiscountApplied && totalBeforeDiscount ? (
              <>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{
                    textDecoration: "line-through",
                    opacity: 0.6,
                    mb: 0.5,
                  }}
                >
                  {totalBeforeDiscount.toFixed(2)} PLN
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight={700}>
                  {total.toFixed(2)} PLN
                </Typography>
                {discountAmount > 0 && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 0.5 }}>
                    You save: {discountAmount.toFixed(2)} PLN
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="h5" color="primary.main" fontWeight={700}>
                {total.toFixed(2)} PLN
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={!canPay}
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
        Pay
      </Button>
    </Card>
  );
};

export default OrderSummary;
