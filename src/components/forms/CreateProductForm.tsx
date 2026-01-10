import React from "react";
import type { ProductCreateRequestDTO } from "../../types/products";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export type ProductFormValues = ProductCreateRequestDTO;

const initialProductValues: ProductFormValues = {
  name: "",
  categoryId: "",
  approximatePrice: 0,
  deliveryPrice: 0,
  description: "",
};

const productValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name is too long")
    .required("Product name is required"),

  categoryId: Yup.string().required("Category ID is required"),

  approximatePrice: Yup.number()
    .typeError("Estimated price must be a number")
    .positive("Estimated price must be positive")
    .required("Estimated price is required"),

  deliveryPrice: Yup.number()
    .typeError("Delivery price must be a number")
    .min(0, "Delivery price cannot be negative")
    .required("Delivery price is required"),

  description: Yup.string().optional(),
});

interface CreateProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({ onSubmit }) => {
  return (
    <Box sx={{ p: { xs: 3, sm: 4 } }}>
      <Formik
        initialValues={initialProductValues}
        validationSchema={productValidationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Product Name*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  placeholder="Enter product name"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  ID Kategorii
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="categoryId"
                  placeholder="Enter category ID"
                  error={touched.categoryId && Boolean(errors.categoryId)}
                  helperText={touched.categoryId && errors.categoryId}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0.25rem" } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Estimated Price (PLN)*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="approximatePrice"
                  type="number"
                  placeholder="0.00"
                  error={touched.approximatePrice && Boolean(errors.approximatePrice)}
                  helperText={touched.approximatePrice && errors.approximatePrice}
                  inputProps={{ step: "0.01", min: "0.01" }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Delivery Price (PLN)*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="deliveryPrice"
                  type="number"
                  placeholder="0.00"
                  error={touched.deliveryPrice && Boolean(errors.deliveryPrice)}
                  helperText={touched.deliveryPrice && errors.deliveryPrice}
                  inputProps={{ step: "0.01", min: "0.0" }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="description"
                  multiline
                  rows={4}
                  placeholder="Detailed product description"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained" color="primary">
                    {"Create and Add Variants"}
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

export default CreateProductForm;
