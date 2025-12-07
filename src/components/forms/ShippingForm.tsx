import { useImperativeHandle, forwardRef } from "react";
import { Grid, TextField, Typography, Button, Box } from "@mui/material";
import { Formik, Form, Field, type FormikProps } from "formik";
import { MuiTelInput } from "mui-tel-input";
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
  firstName: Yup.string().required("Imię jest wymagane"),
  lastName: Yup.string().required("Nazwisko jest wymagane"),
  company: Yup.string(),
  phone: Yup.string().required("Telefon jest wymagany").min(6, "Numer jest za krótki"),
  country: Yup.string().required("Kraj jest wymagany"),
  street: Yup.string().required("Ulica jest wymagana"),
  buildingNumber: Yup.string(),
  apartmentNumber: Yup.string(),
  postalCode: Yup.string().required("Kod pocztowy jest wymagany"),
  city: Yup.string().required("Miejscowość jest wymagana"),
});

const initialValues: ShippingFormValues = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  country: "Polska",
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
    const formInitialValues = { ...initialValues, ...customInitialValues };
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
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Firma (opcjonalnie)
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="company"
                  placeholder="Wprowadź nazwę firmy"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Telefon komórkowy *
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
                  Kraj *
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="country"
                  placeholder="Wprowadź kraj"
                  error={touched.country && Boolean(errors.country)}
                  helperText={touched.country && errors.country}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Ulica *
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="street"
                  placeholder="Wprowadź ulicę"
                  error={touched.street && Boolean(errors.street)}
                  helperText={touched.street && errors.street}
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
                  error={touched.buildingNumber && Boolean(errors.buildingNumber)}
                  helperText={touched.buildingNumber && errors.buildingNumber}
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
                  Kod pocztowy *
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="postalCode"
                  placeholder="Kod pocztowy"
                  error={touched.postalCode && Boolean(errors.postalCode)}
                  helperText={touched.postalCode && errors.postalCode}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Miejscowość *
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="city"
                  placeholder="Wprowadź miejscowość"
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
                        Anuluj
                      </Button>
                    )}
                    <Button type="submit" variant="contained">
                      Zatwierdź
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
