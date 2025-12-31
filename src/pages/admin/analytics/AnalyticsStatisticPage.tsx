import Breadcrumbs from "../../../components/common/Breadcrumbs";
import MainLayout from "../../../components/layout/MainLayout";
import { Container, Typography } from "@mui/material";

const AnalyticsStatisticPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          items={[{ label: "Admin Panel" }, { label: "Analytics" }, { label: "Product Analysis" }]}
        />
        <Typography variant="h4" gutterBottom>
          Product Analysis
        </Typography>
        Not implemented yet
      </Container>
    </MainLayout>
  );
};

export default AnalyticsStatisticPage;
