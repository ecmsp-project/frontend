import Breadcrumbs from "../../../components/common/Breadcrumbs";
import MainLayout from "../../../components/layout/MainLayout";
import { Container, Typography } from "@mui/material";

const RaportsStatisticPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          items={[
            { label: "Admin Panel" },
            { label: "Analytics" },
            { label: "Statistics Reports" },
          ]}
        />
        <Typography variant="h4" gutterBottom>
          Statistics Reports
        </Typography>
        Not implemented yet
      </Container>
    </MainLayout>
  );
};

export default RaportsStatisticPage;
