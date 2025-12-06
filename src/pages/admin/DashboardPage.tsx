import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import { Typography, Paper, Grid, Container } from "@mui/material";

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          items={[{ label: "Panel administracyjny" }, { label: "Pulpit Administratora" }]}
        />
        <Typography variant="h4" gutterBottom>
          Pulpit Administratora
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">Nowe Zamówienia</Typography>
              <Typography variant="h3" color="primary">
                42
              </Typography>
              <Typography variant="body2" color="text.secondary">
                w ciągu ostatnich 24h
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">Zarejestrowani Użytkownicy</Typography>
              <Typography variant="h3">5</Typography>
              <Typography variant="body2" color="text.secondary">
                Administratorzy: 1, Menedżerowie: 1
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
