import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import EditIcon from "@mui/icons-material/Edit";
import WebIcon from "@mui/icons-material/Web";
import {
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CMSPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Zarządzanie Treścią Strony
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Edytuj zawartość stron internetowych w prosty sposób
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
                  }}
                >
                  <WebIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Strona Główna
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Edytuj hero section, kafelki i kategorie
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Dostosuj wygląd strony głównej: teksty, obrazy, kafelki z funkcjami oraz wyświetlane
                kategorie produktów.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                fullWidth
                onClick={() => navigate("/admin/cms/home/edit")}
                sx={{ textTransform: "none", py: 1 }}
              >
                Edytuj Stronę Główną
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: "secondary.light",
                    color: "secondary.contrastText",
                    borderRadius: "50%",
                    p: 1.5,
                    mr: 2,
                  }}
                >
                  <WebIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Strona Kontaktowa
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Edytuj informacje kontaktowe
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Zaktualizuj dane kontaktowe: adres, telefon, email oraz godziny otwarcia biura
                obsługi klienta.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                fullWidth
                onClick={() => navigate("/admin/cms/contact/edit")}
                sx={{ textTransform: "none", py: 1 }}
                disabled
              >
                Wkrótce Dostępne
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: "info.light", color: "info.contrastText" }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Instrukcja
        </Typography>
        <Typography variant="body2">
          • Kliknij na tekst aby go edytować
          <br />
          • Użyj narzędzi edycji aby zmienić rozmiar czcionki i formatowanie
          <br />
          • Kafelki można usuwać klikając krzyżyk w prawym górnym rogu
          <br />
          • Dodaj nowe kafelki klikając przycisk "+ Dodaj"
          <br />• Pamiętaj o zapisaniu zmian przed opuszczeniem strony
        </Typography>
      </Paper>
    </AdminLayout>
  );
};

export default CMSPage;
