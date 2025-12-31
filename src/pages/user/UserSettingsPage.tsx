import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Container,
} from "@mui/material";

const UserSettingsPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs items={[{ label: "User Panel" }, { label: "Settings" }]} />
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Repeat New Password"
              type="password"
              margin="normal"
              variant="outlined"
            />
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Change Password
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications about orders"
            />
            <FormControlLabel control={<Switch defaultChecked />} label="Newsletter with promotions" />
            <FormControlLabel control={<Switch />} label="SMS Notifications" />
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="error">
            Danger Zone
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Account deletion is irreversible. All your data will be permanently deleted.
          </Typography>
          <Button variant="outlined" color="error">
            Delete Account
          </Button>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default UserSettingsPage;
