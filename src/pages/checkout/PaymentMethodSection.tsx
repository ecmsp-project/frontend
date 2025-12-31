import React from "react";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Box,
  Typography,
  Card,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  alpha,
  useTheme,
} from "@mui/material";

interface PaymentMethodSectionProps {
  paymentMethod: "card" | "cod";
  onPaymentMethodChange: (method: "card" | "cod") => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethod,
  onPaymentMethodChange,
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <PaymentIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Payment Method
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value as "card" | "cod")}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
                  Credit Card
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
                  Cash on Delivery
                </Typography>
              </Box>
            }
            sx={{ width: "100%", m: 0 }}
          />
        </RadioGroup>
      </FormControl>
    </Card>
  );
};

export default PaymentMethodSection;
