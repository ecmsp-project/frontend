import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DiscountIcon from "@mui/icons-material/Discount";
import { Box, Typography, Card, Divider, TextField, Button, alpha, useTheme } from "@mui/material";

interface DiscountSectionProps {
  discountCode: string;
  isDiscountApplied: boolean;
  discountError: string | null;
  onDiscountCodeChange: (code: string) => void;
  onApplyDiscount: () => void;
  onClearError: () => void;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  discountCode,
  isDiscountApplied,
  discountError,
  onDiscountCodeChange,
  onApplyDiscount,
  onClearError,
}) => {
  const theme = useTheme();

  const handleCodeChange = (value: string) => {
    onDiscountCodeChange(value);
    if (discountError) {
      onClearError();
    }
  };

  return (
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
            onChange={(e) => handleCodeChange(e.target.value)}
            disabled={isDiscountApplied}
            error={!!discountError}
            helperText={discountError || ""}
          />
          <Button
            variant="outlined"
            disabled={!discountCode || isDiscountApplied}
            onClick={onApplyDiscount}
          >
            {isDiscountApplied ? "Zastosowano" : "Zastosuj"}
          </Button>
        </Box>
        {isDiscountApplied && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              borderRadius: 2,
              border: "1px solid",
              borderColor: alpha(theme.palette.success.main, 0.3),
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              Zastosowano rabat 20%!
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default DiscountSection;
