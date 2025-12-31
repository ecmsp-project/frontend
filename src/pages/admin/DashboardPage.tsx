import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import { Typography, Paper, Grid, Container } from "@mui/material";

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs items={[{ label: "Admin Panel" }, { label: "Admin Dashboard" }]} />
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">New Orders</Typography>
              <Typography variant="h3" color="primary">
                42
              </Typography>
              <Typography variant="body2" color="text.secondary">
                in the last 24h
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">Registered Users</Typography>
              <Typography variant="h3">5</Typography>
              <Typography variant="body2" color="text.secondary">
                Administrators: 1, Managers: 1
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
