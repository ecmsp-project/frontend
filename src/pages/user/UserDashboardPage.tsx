import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
import { Typography, Paper, Grid, CircularProgress, Alert, Box, Container } from "@mui/material";

const UserDashboardPage: React.FC = () => {
  const { currentUser, loading, error } = useIndividualUser();

  let content;

  if (loading) {
    content = (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  } else if (error) {
    content = (
      <Alert severity="error" sx={{ my: 3 }}>
        {error}
      </Alert>
    );
  } else if (!currentUser) {
    content = (
      <Alert severity="warning" sx={{ my: 3 }}>
        You are not logged in. Please log in.
      </Alert>
    );
  } else {
    content = (
      <>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            My Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here is your information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600} color="primary.main">
                Account Information
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Login:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {currentUser.login}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    User ID:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {currentUser.id}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Role:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {currentUser.roles.length > 0
                      ? currentUser.roles.map((role) => role.name).join(", ")
                      : "No assigned roles"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.primary.main}15 100%)`,
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600} color="primary.main">
                Permissions
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {currentUser.roles.flatMap((role) => role.permissions).length > 0
                    ? currentUser.roles.flatMap((role) => role.permissions).join(", ")
                    : "No special permissions"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs items={[{ label: "User Panel" }, { label: "My Account" }]} />
        <Typography variant="h4" gutterBottom>
          My Account
        </Typography>
        {content}
      </Container>
    </MainLayout>
  );
};

export default UserDashboardPage;
