import React from "react";
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
      <Typography variant="h4" gutterBottom>
        Moje konto
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informacje o koncie
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Login:</strong> {currentUser.login}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>ID użytkownika:</strong> {currentUser.id}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Role:</strong>{" "}
              {currentUser.roles.length > 0
                ? currentUser.roles.map((role) => role.name).join(", ")
                : "Brak przypisanych ról"}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Uprawnienia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentUser.roles.flatMap((role) => role.permissions).length > 0
                ? currentUser.roles
                    .flatMap((role) => role.permissions)
                    .join(", ")
                : "Brak specjalnych uprawnień"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </UserLayout>
  );
};

export default UserDashboardPage;
