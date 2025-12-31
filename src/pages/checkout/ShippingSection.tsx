import React from "react";
import type { InvoiceFormValues } from "../../components/forms/InvoiceForm.tsx";
import type { ShippingFormValues } from "../../components/forms/ShippingForm.tsx";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  Box,
  Typography,
  Card,
  Button,
  Divider,
  FormControlLabel,
  Checkbox,
  alpha,
  useTheme,
} from "@mui/material";

interface ShippingSectionProps {
  shippingData: ShippingFormValues;
  invoiceData: InvoiceFormValues;
  wantsInvoice: boolean;
  onEditShipping: () => void;
  onInvoiceChange: (checked: boolean) => void;
  onEditInvoice: () => void;
}

const ShippingSection: React.FC<ShippingSectionProps> = ({
  shippingData,
  invoiceData,
  wantsInvoice,
  onEditShipping,
  onInvoiceChange,
  onEditInvoice,
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <LocalShippingIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Recipient
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
          <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={onEditShipping}>
            Edit Data
          </Button>
        </Box>
      ) : (
        <Button variant="contained" fullWidth onClick={onEditShipping} sx={{ py: 1.5 }}>
          Enter Recipient Data
        </Button>
      )}

      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Checkbox checked={wantsInvoice} onChange={(e) => onInvoiceChange(e.target.checked)} />
          }
          label="Do you want to receive an invoice?"
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
              Invoice data entered
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoiceData.type === "company"
                ? `${invoiceData.companyName} (NIP: ${invoiceData.nip})`
                : `${invoiceData.firstName} ${invoiceData.lastName}`}
            </Typography>
            <Button variant="text" size="small" sx={{ mt: 1 }} onClick={onEditInvoice}>
              Edit
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ShippingSection;
