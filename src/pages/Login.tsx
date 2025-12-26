import React, { useState } from "react";
import { login } from "../api/auth-service.ts";
import MainLayout from "../components/layout/MainLayout.tsx";
import { useIndividualUser } from "../contexts/IndividualUserContext";
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
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { refreshCurrentUser } = useIndividualUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Login i hasło są wymagane");
      return;
    }

    try {
      const loginData = await login(email, password);
      console.log("peeeeeeeennnnnn", loginData);
      localStorage.setItem("token", loginData.token);
      await refreshCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Logowanie nie powiodło się. Sprawdź login i hasło.");
    }
  };

  return (
    <MainLayout minimalist={true}>
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, py: 6 }}>
          <Card
            sx={{
              p: { xs: 3, sm: 5 },
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.98)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                fontWeight={700}
                color="primary.main"
              >
                Zaloguj się
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Witaj ponownie w E-COMMERCE
              </Typography>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{
                mb: 2,
                borderColor: "divider",
                color: "text.primary",
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: (theme) => theme.palette.primary.light + "10",
                  transform: "translateY(-2px)",
                  boxShadow: 2,
                },
                transition: "all 0.3s",
              }}
              startIcon={<GoogleIcon />}
              onClick={() => console.log("Logowanie Google...")}
            >
              Zaloguj przez Google
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontWeight: 500 }}>
                lub
              </Typography>
            </Divider>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    fontSize: 24,
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adres Email"
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Hasło"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <MuiLink
                component="button"
                type="button"
                variant="body2"
                sx={{
                  cursor: "pointer",
                  textAlign: "right",
                  display: "block",
                  mb: 3,
                  fontWeight: 500,
                }}
              >
                Zapomniałeś hasła?
              </MuiLink>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mb: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px 0 rgba(0,118,255,0.5)",
                  },
                  transition: "all 0.3s",
                }}
              >
                Zaloguj się
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary" component="span">
                Nie masz konta?{" "}
              </Typography>
              <MuiLink
                component="button"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Zarejestruj się!
              </MuiLink>
            </Box>
          </Card>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default Login;
