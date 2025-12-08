import React, { useRef } from "react";
import ShippingForm, {
  type ShippingFormValues,
  type ShippingFormRef,
} from "../../components/forms/ShippingForm.tsx";
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

interface ShippingModalProps {
  open: boolean;
  shippingData: ShippingFormValues;
  onClose: () => void;
  onSubmit: (values: ShippingFormValues) => void;
}

const ShippingModal: React.FC<ShippingModalProps> = ({ open, shippingData, onClose, onSubmit }) => {
  const shippingFormRef = useRef<ShippingFormRef>(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          Dane odbiorcy przesyłki
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <ShippingForm
          key={JSON.stringify(shippingData)} // Wymuś remontowanie gdy dane się zmieniają
          ref={shippingFormRef}
          initialValues={shippingData}
          onSubmit={onSubmit}
          enableReinitialize
          showSubmitButton={false}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Anuluj</Button>
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
  );
};

export default ShippingModal;
