import Breadcrumbs from "../../../components/common/Breadcrumbs";
import MainLayout from "../../../components/layout/MainLayout";
import { Container, Typography } from "@mui/material";

const AnalyticsStatisticPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          items={[
            { label: "Panel administracyjny" },
            { label: "Analytics" },
            { label: "Analiza Produktów" },
          ]}
        />
        <Typography variant="h4" gutterBottom>
          Analiza Produktów
        </Typography>
        Not implemented yet
      </Container>
    </MainLayout>
  );
};

export default AnalyticsStatisticPage;
