import React from "react";
import CreateVariantForm, { type VariantFormValues } from "../components/forms/CreateVariantForm";
import MainLayout from "../components/layout/MainLayout";
import { Container, Typography, Paper } from "@mui/material";

const CreateVariantPage: React.FC = () => {
  const productId = "1";

  const handleFormSubmit = (values: VariantFormValues) => {
    console.log("Form submitted:", values);
    alert("Form submitted successfully!");
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700} sx={{ mb: 4 }}>
          Dodaj Wariant dla Produktu ID: {productId}
        </Typography>
        <Paper elevation={3}>
          <CreateVariantForm onSubmit={handleFormSubmit} />
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default CreateVariantPage;
