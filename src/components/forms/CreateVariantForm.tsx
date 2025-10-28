import React from "react";
import type { VariantCreateRequestDTO } from "../../types/products";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export type VariantFormValues = Omit<VariantCreateRequestDTO, "productId">;

const initialVariantValues: VariantFormValues = {
  price: 0,
  stockQuantity: 0,
  imageUrl: "",
  description: "",
  additionalProperties: {},
};

const variantValidationSchema = Yup.object({
  price: Yup.number()
    .typeError("Cena musi być liczbą")
    .positive("Cena musi być większa od zera")
    .required("Cena jest wymagana"),
  stockQuantity: Yup.number()
    .typeError("Ilość musi być liczbą")
    .min(0, "Ilość nie może być ujemna")
    .required("Ilość jest wymagana"),
  imageUrl: Yup.string().url("Niepoprawny URL").required("Adres URL obrazu jest wymagany"),
  description: Yup.string().optional(),
});

interface CreateVariantFormProps {
  onSubmit: (values: VariantFormValues) => void;
}

const CreateVariantForm: React.FC<CreateVariantFormProps> = ({ onSubmit }) => {
  return (
    <Box sx={{ p: { xs: 3, sm: 4 } }}>
      <Formik
        initialValues={initialVariantValues}
        validationSchema={variantValidationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Cena Wariantu (PLN)*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="price"
                  type="number"
                  placeholder="0.00"
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  inputProps={{ step: "0.01", min: "0.01" }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Ilość w magazynie*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="stockQuantity"
                  type="number"
                  placeholder="0"
                  error={touched.stockQuantity && Boolean(errors.stockQuantity)}
                  helperText={touched.stockQuantity && errors.stockQuantity}
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  URL Obrazu*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="imageUrl"
                  placeholder="https://example.com/obraz.jpg"
                  error={touched.imageUrl && Boolean(errors.imageUrl)}
                  helperText={touched.imageUrl && errors.imageUrl}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Opis Wariantu
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="description"
                  multiline
                  rows={3}
                  placeholder="np. Kolor: Czerwony, Rozmiar: XL"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Dodatkowe Atrybuty (JSON)
                </Typography>
                <TextField
                  fullWidth
                  name="additionalProperties"
                  multiline
                  rows={4}
                  placeholder='np. {"color": "Red", "size": "XL"}'
                />
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Wprowadź poprawny obiekt JSON z dodatkowymi atrybutami wariantu.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained" color="primary">
                    {"Utwórz wariant"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateVariantForm;
