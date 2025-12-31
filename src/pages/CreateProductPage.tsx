import React from "react";
import CreateProductForm, {
  type ProductFormValues,
} from "../components/forms/CreateProductForm.tsx";
import MainLayout from "../components/layout/MainLayout";
import { Container, Typography, Paper } from "@mui/material";

const CreateProductPage: React.FC = () => {
  const handleFormSubmit = (values: ProductFormValues) => {
    console.log("Form submitted:", values);
    alert("Form submitted successfully!");
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700} sx={{ mb: 4 }}>
          Add New Product
        </Typography>
        <Paper elevation={3}>
          <CreateProductForm onSubmit={handleFormSubmit} />
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default CreateProductPage;
