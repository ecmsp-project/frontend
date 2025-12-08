import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import type { CardFormValues } from "../../hooks/usePayment";
import { Grid, TextField, Typography, Box, Button } from "@mui/material";
import { Formik, Form, Field, type FormikProps, useFormikContext } from "formik";
import * as Yup from "yup";

export interface CardFormRef {
  submitForm: () => void;
}

interface CardFormProps {
  onSubmit: (values: CardFormValues) => Promise<void>;
  isProcessing?: boolean;
  showSubmitButton?: boolean;
  onCancel?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

const cardValidationSchema = Yup.object({
  cardNumber: Yup.string()
    .required("Numer karty jest wymagany")
    .matches(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Numer karty musi mieć 16 cyfr"),
  cardholderName: Yup.string()
    .required("Imię i nazwisko jest wymagane")
    .min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki"),
  expiryDate: Yup.string()
    .required("Data ważności jest wymagana")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/RR"),
  cvv: Yup.string()
    .required("CVV jest wymagany")
    .matches(/^\d{3,4}$/, "CVV musi mieć 3 lub 4 cyfry"),
});

const initialValues: CardFormValues = {
  cardNumber: "",
  cardholderName: "",
  expiryDate: "",
  cvv: "",
};

// Komponent pomocniczy do śledzenia walidacji
const ValidationTracker: React.FC<{ onValidationChange?: (isValid: boolean) => void }> = ({
  onValidationChange,
}) => {
  const { isValid, values } = useFormikContext<CardFormValues>();

  useEffect(() => {
    if (onValidationChange) {
      const allFieldsFilled =
        values.cardNumber.trim() !== "" &&
        values.cardholderName.trim() !== "" &&
        values.expiryDate.trim() !== "" &&
        values.cvv.trim() !== "";
      onValidationChange(isValid && allFieldsFilled);
    }
  }, [isValid, values, onValidationChange]);

  return null;
};

const CardForm = forwardRef<CardFormRef, CardFormProps>(
  (
    { onSubmit, isProcessing = false, showSubmitButton = false, onCancel, onValidationChange },
    ref,
  ) => {
    const formikRef = useRef<FormikProps<CardFormValues>>(null);

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (formikRef.current) {
          formikRef.current.submitForm();
        }
      },
    }));

    const formatCardNumber = (value: string): string => {
      const cleaned = value.replace(/\s/g, "");
      const groups = cleaned.match(/.{1,4}/g) || [];
      return groups.join(" ").substring(0, 19); // Max 16 digits + 3 spaces
    };

    const formatExpiryDate = (value: string): string => {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length >= 2) {
        return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
      }
      return cleaned;
    };

    const handleCardNumberChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (field: string, value: string) => void,
    ) => {
      const formatted = formatCardNumber(e.target.value);
      setFieldValue("cardNumber", formatted);
    };

    const handleExpiryDateChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (field: string, value: string) => void,
    ) => {
      const formatted = formatExpiryDate(e.target.value);
      setFieldValue("expiryDate", formatted);
    };

    const handleCvvChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (field: string, value: string) => void,
    ) => {
      const cleaned = e.target.value.replace(/\D/g, "").substring(0, 4);
      setFieldValue("cvv", cleaned);
    };

    return (
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={cardValidationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue }) => {
          return (
            <Form>
              <ValidationTracker onValidationChange={onValidationChange} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Numer karty *
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    error={touched.cardNumber && Boolean(errors.cardNumber)}
                    helperText={touched.cardNumber && errors.cardNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCardNumberChange(e, setFieldValue)
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Imię i nazwisko na karcie *
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    name="cardholderName"
                    placeholder="JAN KOWALSKI"
                    error={touched.cardholderName && Boolean(errors.cardholderName)}
                    helperText={touched.cardholderName && errors.cardholderName}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Data ważności *
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    name="expiryDate"
                    placeholder="MM/RR"
                    error={touched.expiryDate && Boolean(errors.expiryDate)}
                    helperText={touched.expiryDate && errors.expiryDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleExpiryDateChange(e, setFieldValue)
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    CVV *
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    name="cvv"
                    placeholder="123"
                    type="password"
                    error={touched.cvv && Boolean(errors.cvv)}
                    helperText={touched.cvv && errors.cvv}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCvvChange(e, setFieldValue)
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                  />
                </Grid>
              </Grid>

              {showSubmitButton && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
                    {onCancel && (
                      <Button onClick={onCancel} variant="outlined" disabled={isProcessing}>
                        Anuluj
                      </Button>
                    )}
                    <Button type="submit" variant="contained" disabled={isProcessing}>
                      {isProcessing ? "Przetwarzanie..." : "Zatwierdź płatność"}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Form>
          );
        }}
      </Formik>
    );
  },
);

CardForm.displayName = "CardForm";

export default CardForm;
