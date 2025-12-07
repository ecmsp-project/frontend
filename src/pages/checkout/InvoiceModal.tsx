import React, { useRef } from "react";
import InvoiceForm, {
  type InvoiceFormValues,
  type InvoiceFormRef,
} from "../../components/forms/InvoiceForm.tsx";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";

interface InvoiceModalProps {
  open: boolean;
  invoiceData: InvoiceFormValues;
  shippingData?: {
    firstName: string;
    lastName: string;
    country: string;
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    postalCode: string;
    city: string;
  };
  onClose: () => void;
  onSubmit: (values: InvoiceFormValues) => void;
  onCloseWithoutData?: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  open,
  invoiceData,
  shippingData,
  onClose,
  onSubmit,
  onCloseWithoutData,
}) => {
  const invoiceFormRef = useRef<InvoiceFormRef>(null);

  const handleClose = () => {
    if (onCloseWithoutData) {
      onCloseWithoutData();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight={600}>
          Dane do faktury
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <InvoiceForm
          ref={invoiceFormRef}
          initialValues={invoiceData}
          onSubmit={onSubmit}
          enableReinitialize
          shippingData={shippingData}
          showSubmitButton={false}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Anuluj</Button>
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
  );
};

export default InvoiceModal;
