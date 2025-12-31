import { useImperativeHandle, forwardRef, useMemo } from "react";
import { Grid, TextField, Typography, Button, Box, FormControl, MenuItem } from "@mui/material";
import { Formik, Form, Field, type FormikProps } from "formik";
import { MuiTelInput } from "mui-tel-input";
import countryList from "react-select-country-list";
import * as Yup from "yup";

export interface ShippingFormValues {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  country: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  postalCode: string;
  city: string;
}

const shippingValidationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  company: Yup.string(),
  phone: Yup.string().required("Phone is required").min(6, "Number is too short"),
  country: Yup.string().required("Country is required"),
  street: Yup.string().required("Street is required"),
  buildingNumber: Yup.string(),
  apartmentNumber: Yup.string(),
  postalCode: Yup.string().required("Postal code is required"),
  city: Yup.string().required("City is required"),
});

const countryOptions = countryList().getData();

const initialValues: ShippingFormValues = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  country: "PL",
  street: "",
  buildingNumber: "",
  apartmentNumber: "",
  postalCode: "",
  city: "",
};

export interface ShippingFormRef {
  submitForm: () => void;
}

interface ShippingFormProps {
  initialValues?: Partial<ShippingFormValues>;
  onSubmit: (values: ShippingFormValues) => void;
  enableReinitialize?: boolean;
  showSubmitButton?: boolean;
  onCancel?: () => void;
}

const ShippingForm = forwardRef<ShippingFormRef, ShippingFormProps>(
  (
    {
      initialValues: customInitialValues,
      onSubmit,
      enableReinitialize = false,
      showSubmitButton = false,
      onCancel,
    },
    ref,
  ) => {
    // Use useMemo so formInitialValues reacts to customInitialValues changes
    const formInitialValues = useMemo(
      () => ({ ...initialValues, ...customInitialValues }),
      [customInitialValues],
    );
    let formikRef: FormikProps<ShippingFormValues> | null = null;

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (formikRef) {
          formikRef.submitForm();
        }
      },
    }));

    return (
      <Formik
        innerRef={(formik) => {
          formikRef = formik;
        }}
        initialValues={formInitialValues}
        validationSchema={shippingValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize={enableReinitialize}
      >
        {({ errors, touched }) => (
          <Form>
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
                  Company (optional)
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="company"
                  placeholder="Enter company name"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Mobile Phone *
                </Typography>
                <Field name="phone">
                  {({ field, form, meta }: any) => (
                    <MuiTelInput
                      {...field}
                      fullWidth
                      defaultCountry="PL"
                      label=""
                      disableFormatting={false}
                      onChange={(newValue) => {
                        form.setFieldValue("phone", newValue);
                      }}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      preferredCountries={["PL", "DE", "GB", "US", "BE"]}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                    />
                  )}
                </Field>
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
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
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
                  error={touched.buildingNumber && Boolean(errors.buildingNumber)}
                  helperText={touched.buildingNumber && errors.buildingNumber}
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
            </Grid>
          </Form>
        )}
      </Formik>
    );
  },
);

ShippingForm.displayName = "ShippingForm";

export default ShippingForm;
