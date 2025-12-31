import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import { Container, Typography } from "@mui/material";

const AddProductPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs items={[{ label: "Admin Panel" }, { label: "Add Product" }]} />
        <Typography variant="h4" gutterBottom>
          Add Product
        </Typography>
        Not implemented yet
      </Container>
    </MainLayout>
  );
};

export default AddProductPage;
