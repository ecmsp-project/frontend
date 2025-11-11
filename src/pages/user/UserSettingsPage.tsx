import React from "react";
import UserLayout from "../../components/layout/UserLayout";
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";

const UserSettingsPage: React.FC = () => {
  return (
    <UserLayout>
      <Typography variant="h4" gutterBottom>
        Ustawienia
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Zmiana hasła
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Aktualne hasło"
            type="password"
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Nowe hasło"
            type="password"
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Powtórz nowe hasło"
            type="password"
            margin="normal"
            variant="outlined"
          />
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Zmień hasło
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Powiadomienia
        </Typography>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Powiadomienia e-mail o zamówieniach"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Newsletter z promocjami"
          />
          <FormControlLabel
            control={<Switch />}
            label="Powiadomienia SMS"
          />
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Strefa niebezpieczna
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.
        </Typography>
        <Button variant="outlined" color="error">
          Usuń konto
        </Button>
      </Paper>
    </UserLayout>
  );
};

export default UserSettingsPage;
