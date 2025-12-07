import React from "react";
import DiscountIcon from "@mui/icons-material/Discount";
import { Box, Typography, Card, Divider, TextField, Button } from "@mui/material";

interface DiscountSectionProps {
  discountCode: string;
  onDiscountCodeChange: (code: string) => void;
  onApplyDiscount: () => void;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  discountCode,
  onDiscountCodeChange,
  onApplyDiscount,
}) => {
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
            onChange={(e) => onDiscountCodeChange(e.target.value)}
          />
          <Button variant="outlined" disabled={!discountCode} onClick={onApplyDiscount}>
            Zastosuj
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default DiscountSection;
