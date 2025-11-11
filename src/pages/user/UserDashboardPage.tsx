import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import UserLayout from "../../components/layout/UserLayout";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
import { Typography, Paper, Grid, CircularProgress, Alert, Box } from "@mui/material";

const UserDashboardPage: React.FC = () => {
  const { currentUser, loading, error } = useIndividualUser();

  if (loading) {
    return (
      <UserLayout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <Alert severity="error" sx={{ my: 3 }}>
          {error}
        </Alert>
      </UserLayout>
    );
  }

  if (!currentUser) {
    return (
      <UserLayout>
        <Alert severity="warning" sx={{ my: 3 }}>
          Nie jesteś zalogowany. Proszę się zalogować.
        </Alert>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Breadcrumbs items={[{ label: "Moje konto" }]} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Moje konto
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Witaj ponownie! Oto Twoje informacje
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
              Informacje o koncie
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
                  ID użytkownika:
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
                    : "Brak przypisanych ról"}
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
              Uprawnienia
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {currentUser.roles.flatMap((role) => role.permissions).length > 0
                  ? currentUser.roles.flatMap((role) => role.permissions).join(", ")
                  : "Brak specjalnych uprawnień"}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </UserLayout>
  );
};

export default UserDashboardPage;
