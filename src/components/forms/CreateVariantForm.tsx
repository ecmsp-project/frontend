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
    .typeError("Price must be a number")
    .positive("Price must be greater than zero")
    .required("Price is required"),
  stockQuantity: Yup.number()
    .typeError("Quantity must be a number")
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  imageUrl: Yup.string().url("Invalid URL").required("Image URL is required"),
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
                  Variant Price (PLN)*
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
                  Stock Quantity*
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
                  Image URL*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  error={touched.imageUrl && Boolean(errors.imageUrl)}
                  helperText={touched.imageUrl && errors.imageUrl}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Variant Description
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="description"
                  multiline
                  rows={3}
                  placeholder="e.g. Color: Red, Size: XL"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Additional Attributes (JSON)
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
                  Enter a valid JSON object with additional variant attributes.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained" color="primary">
                    {"Create Variant"}
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
