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
  FormControl,
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field, type FormikProps } from "formik";
import countryList from "react-select-country-list";
import * as Yup from "yup";

export interface InvoiceFormValues {
  type: "company" | "personal";
  companyName?: string;
  nip?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  street?: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  postalCode?: string;
  city?: string;
  useShippingData?: boolean;
}

const countryOptions = countryList().getData();

const invoiceCompanyValidationSchema = Yup.object({
  companyName: Yup.string().required("Company name is required"),
  nip: Yup.string().required("NIP is required"),
  country: Yup.string().required("Country is required"),
  street: Yup.string().required("Street is required"),
  buildingNumber: Yup.string(),
  apartmentNumber: Yup.string(),
  postalCode: Yup.string().required("Postal code is required"),
  city: Yup.string().required("City is required"),
});

const invoicePersonalValidationSchema = Yup.object().shape({
  useShippingData: Yup.boolean(),
  firstName: Yup.string().when("useShippingData", {
    is: false,
    then: (schema) => schema.required("First name is required"),
    otherwise: (schema) => schema,
  }),
  lastName: Yup.string().when("useShippingData", {
    is: false,
    then: (schema) => schema.required("Last name is required"),
    otherwise: (schema) => schema,
  }),
  country: Yup.string().when("useShippingData", {
    is: false,
    then: (schema) => schema.required("Country is required"),
    otherwise: (schema) => schema,
  }),
  street: Yup.string().when("useShippingData", {
    is: false,
    then: (schema) => schema.required("Street is required"),
    otherwise: (schema) => schema,
  }),
  buildingNumber: Yup.string(),
  apartmentNumber: Yup.string(),
  postalCode: Yup.string().when("useShippingData", {
    is: false,
    then: (schema) => schema.required("Postal code is required"),
    otherwise: (schema) => schema,
  }),
  city: Yup.string().when("useShippingData", {
    is: false,
    then: (schema) => schema.required("City is required"),
    otherwise: (schema) => schema,
  }),
});

const initialCompanyValues: InvoiceFormValues = {
  type: "company",
  companyName: "",
  nip: "",
  country: "PL",
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
  country: "PL",
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
    country: string;
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
          country: shippingData.country,
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
            <Tab label="Company" value="company" />
            <Tab label="Personal" value="personal" />
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
                      Company Name *
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="companyName"
                      placeholder="Enter company name"
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
                      placeholder="Enter NIP"
                      error={touched.nip && Boolean(errors.nip)}
                      helperText={touched.nip && errors.nip}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Country *
                    </Typography>
                    <FormControl fullWidth error={touched.country && Boolean(errors.country)}>
                      <Field
                        as={TextField}
                        select
                        fullWidth
                        name="country"
                        error={touched.country && Boolean(errors.country)}
                        helperText={touched.country && errors.country}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      >
                        {countryOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field>
                      {touched.country && errors.country && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {errors.country}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Street *
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="street"
                      placeholder="Enter street"
                      error={touched.street && Boolean(errors.street)}
                      helperText={touched.street && errors.street}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Building Number
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="buildingNumber"
                      placeholder="Building number"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Apartment Number
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="apartmentNumber"
                      placeholder="Apartment number"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Postal Code *
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="postalCode"
                      placeholder="Postal code"
                      error={touched.postalCode && Boolean(errors.postalCode)}
                      helperText={touched.postalCode && errors.postalCode}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      City *
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      name="city"
                      placeholder="Enter city"
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  </Grid>
                </Grid>
                {showSubmitButton && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                      {onCancel && (
                        <Button onClick={onCancel} variant="outlined">
                          Cancel
                        </Button>
                      )}
                      <Button type="submit" variant="contained">
                        Confirm
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
                      label="Same data as shipping"
                    />
                  </Box>
                )}

                {!values.useShippingData ? (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        First Name *
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="firstName"
                        placeholder="Enter first name"
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Last Name *
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="lastName"
                        placeholder="Enter last name"
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Country *
                      </Typography>
                      <FormControl fullWidth error={touched.country && Boolean(errors.country)}>
                        <Field
                          as={TextField}
                          select
                          fullWidth
                          name="country"
                          error={touched.country && Boolean(errors.country)}
                          helperText={touched.country && errors.country}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                        >
                          {countryOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field>
                        {touched.country && errors.country && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {errors.country}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Street *
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="street"
                        placeholder="Enter street"
                        error={touched.street && Boolean(errors.street)}
                        helperText={touched.street && errors.street}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Building Number
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="buildingNumber"
                        placeholder="Building number"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Apartment Number
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="apartmentNumber"
                        placeholder="Apartment number"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Postal Code *
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="postalCode"
                        placeholder="Postal code"
                        error={touched.postalCode && Boolean(errors.postalCode)}
                        helperText={touched.postalCode && errors.postalCode}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        City *
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        name="city"
                        placeholder="Enter city"
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
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
                      The same data as shipping will be used
                    </Typography>
                  </Box>
                )}
                {showSubmitButton && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                      {onCancel && (
                        <Button onClick={onCancel} variant="outlined">
                          Cancel
                        </Button>
                      )}
                      <Button type="submit" variant="contained">
                        Confirm
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
