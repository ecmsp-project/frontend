import React from "react";
import MainLayout from "../components/layout/MainLayout.tsx";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Card,
  Divider,
  Link as MuiLink,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Standard registration...");
  };

  return (
    <MainLayout minimalist={true}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card sx={{ p: 4, textAlign: "center", boxShadow: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={500}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Nice to meet you!
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            sx={{ mb: 2, borderColor: "#ccc", color: "text.primary" }}
            startIcon={<GoogleIcon />}
            onClick={() => console.log("Google registration...")}
          >
            Sign up with Google
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoFocus
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
          </Box>

          <MuiLink
            component="button"
            variant="body2"
            onClick={() => navigate("/login")}
            sx={{ cursor: "pointer", mt: 1 }}
          >
            Already have an account? Sign in!
          </MuiLink>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default Register;
