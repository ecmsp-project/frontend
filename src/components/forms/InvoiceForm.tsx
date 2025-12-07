import React, { useState, useImperativeHandle, forwardRef, useRef } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import { Formik, Form, Field, type FormikProps } from "formik";
import * as Yup from "yup";

export interface InvoiceFormValues {
  type: "company" | "personal";
  companyName?: string;
  nip?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  postalCode?: string;
  city?: string;
  useShippingData?: boolean;
}

const invoiceCompanyValidationSchema = Yup.object({
  companyName: Yup.string().required("Nazwa firmy jest wymagana"),
  nip: Yup.string().required("NIP jest wymagany"),
  street: Yup.string(),
  buildingNumber: Yup.string(),
  apartmentNumber: Yup.string(),
  postalCode: Yup.string(),
  city: Yup.string(),
});

const invoicePersonalValidationSchema = Yup.object().shape({
  useShippingData: Yup.boolean(),
  firstName: Yup.string().when("useShippingData", {
    is: false,
    then: (schema) => schema.required("Imię jest wymagane"),
    otherwise: (schema) => schema,
  }),
  lastName: Yup.string().when("useShippingData", {
    is: false,
    then: (schema) => schema.required("Nazwisko jest wymagane"),
    otherwise: (schema) => schema,
  }),
  street: Yup.string(),
  buildingNumber: Yup.string(),
  apartmentNumber: Yup.string(),
  postalCode: Yup.string(),
  city: Yup.string(),
});

const initialCompanyValues: InvoiceFormValues = {
  type: "company",
  companyName: "",
  nip: "",
  street: "",
  buildingNumber: "",
  apartmentNumber: "",
  postalCode: "",
  city: "",
};

const initialPersonalValues: InvoiceFormValues = {
  type: "personal",
  firstName: "",
  lastName: "",
  street: "",
  buildingNumber: "",
  apartmentNumber: "",
  postalCode: "",
  city: "",
  useShippingData: false,
};

export interface InvoiceFormRef {
  submitForm: () => void;
}

interface InvoiceFormProps {
  initialValues?: Partial<InvoiceFormValues>;
  onSubmit: (values: InvoiceFormValues) => void;
  enableReinitialize?: boolean;
  shippingData?: {
    firstName: string;
    lastName: string;
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    postalCode: string;
    city: string;
  };
  showSubmitButton?: boolean;
  onCancel?: () => void;
}

const InvoiceForm = forwardRef<InvoiceFormRef, InvoiceFormProps>(
  (
    {
      initialValues: customInitialValues,
      onSubmit,
      enableReinitialize = false,
      shippingData,
      showSubmitButton = false,
      onCancel,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [invoiceType, setInvoiceType] = useState<"company" | "personal">(
      customInitialValues?.type || "personal",
    );
    const companyFormikRef = useRef<FormikProps<InvoiceFormValues>>(null);
    const personalFormikRef = useRef<FormikProps<InvoiceFormValues>>(null);

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (invoiceType === "company" && companyFormikRef.current) {
          companyFormikRef.current.submitForm();
        } else if (invoiceType === "personal" && personalFormikRef.current) {
          personalFormikRef.current.submitForm();
        }
      },
    }));

    const handleTypeChange = (_: React.SyntheticEvent, newValue: "company" | "personal") => {
      setInvoiceType(newValue);
    };

    const handleCompanySubmit = (values: InvoiceFormValues) => {
      onSubmit({ ...values, type: "company" });
    };

    const handlePersonalSubmit = (values: InvoiceFormValues) => {
      if (values.useShippingData && shippingData) {
        onSubmit({
          type: "personal",
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          street: shippingData.street,
          buildingNumber: shippingData.buildingNumber,
          apartmentNumber: shippingData.apartmentNumber,
          postalCode: shippingData.postalCode,
          city: shippingData.city,
          useShippingData: true,
        });
      } else {
        onSubmit({ ...values, type: "personal" });
      }
    };

    const companyInitialValues = { ...initialCompanyValues, ...customInitialValues };
    const personalInitialValues = { ...initialPersonalValues, ...customInitialValues };

    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Tabs value={invoiceType} onChange={handleTypeChange} sx={{ mb: 3 }}>
            <Tab label="Firmowa" value="company" />
            <Tab label="Prywatna" value="personal" />
          </Tabs>
        </Box>

        {invoiceType === "company" ? (
          <Formik
            innerRef={companyFormikRef}
            initialValues={companyInitialValues}
            validationSchema={invoiceCompanyValidationSchema}
            onSubmit={handleCompanySubmit}
            enableReinitialize={enableReinitialize}
          >
            {({ errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Nazwa firmy *
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="companyName"
                      placeholder="Wprowadź nazwę firmy"
                      error={touched.companyName && Boolean(errors.companyName)}
                      helperText={touched.companyName && errors.companyName}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      NIP *
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="nip"
                      placeholder="Wprowadź NIP"
                      error={touched.nip && Boolean(errors.nip)}
                      helperText={touched.nip && errors.nip}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Ulica
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="street"
                      placeholder="Wprowadź ulicę"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Nr budynku
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="buildingNumber"
                      placeholder="Nr budynku"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Nr mieszkania
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="apartmentNumber"
                      placeholder="Nr mieszkania"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Kod pocztowy
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="postalCode"
                      placeholder="Kod pocztowy"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Miejscowość
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="city"
                      placeholder="Wprowadź miejscowość"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                </Grid>
                {showSubmitButton && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                      {onCancel && (
                        <Button onClick={onCancel} variant="outlined">
                          Anuluj
                        </Button>
                      )}
                      <Button type="submit" variant="contained">
                        Zatwierdź
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            innerRef={personalFormikRef}
            initialValues={personalInitialValues}
            validationSchema={invoicePersonalValidationSchema}
            onSubmit={handlePersonalSubmit}
            enableReinitialize={enableReinitialize}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                {shippingData && (
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.useShippingData || false}
                          onChange={(e) => {
                            setFieldValue("useShippingData", e.target.checked);
                          }}
                        />
                      }
                      label="Takie same dane jak do przesyłki"
                    />
                  </Box>
                )}

                {!values.useShippingData ? (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Imię *
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="firstName"
                        placeholder="Wprowadź imię"
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Nazwisko *
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="lastName"
                        placeholder="Wprowadź nazwisko"
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Ulica
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="street"
                        placeholder="Wprowadź ulicę"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Nr budynku
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="buildingNumber"
                        placeholder="Nr budynku"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Nr mieszkania
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="apartmentNumber"
                        placeholder="Nr mieszkania"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Kod pocztowy
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="postalCode"
                        placeholder="Kod pocztowy"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Miejscowość
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="city"
                        placeholder="Wprowadź miejscowość"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: alpha(theme.palette.info.main, 0.2),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Zostaną użyte takie same dane jak to wysyłki
                    </Typography>
                  </Box>
                )}
                {showSubmitButton && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                      {onCancel && (
                        <Button onClick={onCancel} variant="outlined">
                          Anuluj
                        </Button>
                      )}
                      <Button type="submit" variant="contained">
                        Zatwierdź
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Form>
            )}
          </Formik>
        )}
      </Box>
    );
  },
);

InvoiceForm.displayName = "InvoiceForm";

export default InvoiceForm;
