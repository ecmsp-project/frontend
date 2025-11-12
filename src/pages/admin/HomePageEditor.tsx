import React, { useEffect, useState } from "react";
import { saveGlobalSettings } from "../../api/cms-service";
import CMSToolbar from "../../components/cms/CMSToolbar";
import EditableText from "../../components/cms/EditableText";
import MainLayout from "../../components/layout/MainLayout";
import { useCMS } from "../../contexts/CMSContext";
import AddIcon from "@mui/icons-material/Add";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SpaIcon from "@mui/icons-material/Spa";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Typography,
  Container,
  Grid,
  Card,
  Box,
  alpha,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";

const iconMap: { [key: string]: React.ComponentType } = {
  TrendingUpIcon,
  LocalShippingIcon,
  VerifiedUserIcon,
  PhoneAndroidIcon,
  CheckroomIcon,
  SpaIcon,
  HomeIcon,
  SportsBasketballIcon,
  MenuBookIcon,
};

// Mock initial data
const defaultSettings = {
  hero: {
    title: "Witaj w E-COMMERCE",
    subtitle: "Odkryj najlepsze produkty w najlepszych cenach",
    primaryButtonText: "Rozpocznij Zakupy",
    secondaryButtonText: "Dowiedz Się Więcej",
  },
  features: [
    {
      id: "f1",
      icon: "TrendingUpIcon",
      title: "Najlepsze Ceny",
      description: "Konkurencyjne ceny na rynku",
    },
    {
      id: "f2",
      icon: "LocalShippingIcon",
      title: "Darmowa Dostawa",
      description: "Przy zamówieniach powyżej 100 zł",
    },
    {
      id: "f3",
      icon: "VerifiedUserIcon",
      title: "Bezpieczne Zakupy",
      description: "Gwarancja zwrotu pieniędzy",
    },
  ],
  categories: [
    {
      id: 1,
      name: "Elektronika",
      image: "https://via.placeholder.com/400x300/1976d2/ffffff?text=Elektronika",
      icon: "PhoneAndroidIcon",
      color: "#1976d2",
    },
    {
      id: 2,
      name: "Ubrania",
      image: "https://via.placeholder.com/400x300/9c27b0/ffffff?text=Ubrania",
      icon: "CheckroomIcon",
      color: "#9c27b0",
    },
    {
      id: 3,
      name: "Kosmetyki",
      image: "https://via.placeholder.com/400x300/e91e63/ffffff?text=Kosmetyki",
      icon: "SpaIcon",
      color: "#e91e63",
    },
    {
      id: 4,
      name: "Dom i Ogród",
      image: "https://via.placeholder.com/400x300/4caf50/ffffff?text=Dom+i+Ogród",
      icon: "HomeIcon",
      color: "#4caf50",
    },
    {
      id: 5,
      name: "Sport",
      image: "https://via.placeholder.com/400x300/ff9800/ffffff?text=Sport",
      icon: "SportsBasketballIcon",
      color: "#ff9800",
    },
    {
      id: 6,
      name: "Książki",
      image: "https://via.placeholder.com/400x300/795548/ffffff?text=Książki",
      icon: "MenuBookIcon",
      color: "#795548",
    },
  ],
  categoriesTitle: "Popularne Kategorie",
  categoriesSubtitle: "Odkryj nasze najlepsze kategorie produktów",
  footer: {
    shopName: "E-COMMERCE",
    shopDescription:
      "Wszystko co potrzebujesz w jednym miejscu. Jakość, niskie ceny i szybka dostawa. Twoje zakupy, nasza pasja.",
    customerServiceHours: ["Pon-Pt: 8:00 - 20:00", "Sob: 9:00 - 17:00"],
    customerServicePhone: "+48 123 456 789",
  },
};

const HomePageEditor: React.FC = () => {
  const { settings, setSettings, isDirty, setDirty, setEditMode } = useCMS();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setEditMode(true);
    if (!settings) {
      setSettings(defaultSettings);
    }
    return () => setEditMode(false);
  }, [setEditMode, settings, setSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await saveGlobalSettings(settings);
      setDirty(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving settings:", error);
      setShowError(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) return null;

  return (
    <>
      <CMSToolbar onSave={handleSave} isDirty={isDirty} isSaving={isSaving} />

      <MainLayout>
        <Box sx={{ pt: 8 }}>
          {/* Hero Section */}
          <Box
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              py: 8,
              mb: 6,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                align="center"
                sx={{ fontWeight: 700, mb: 2 }}
              >
                <EditableText
                  value={settings.hero.title}
                  onChange={(value) =>
                    setSettings({ ...settings, hero: { ...settings.hero, title: value } })
                  }
                  variant="h2"
                  isEditMode={true}
                />
              </Typography>
              <Typography variant="h5" align="center" sx={{ mb: 4 }}>
                <EditableText
                  value={settings.hero.subtitle}
                  onChange={(value) =>
                    setSettings({ ...settings, hero: { ...settings.hero, subtitle: value } })
                  }
                  variant="h5"
                  isEditMode={true}
                />
              </Typography>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ mb: 8 }}>
            {/* Features */}
            <Grid container spacing={3} sx={{ mb: 8 }}>
              {settings.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || TrendingUpIcon;
                return (
                  <Grid size={{ xs: 12, md: 4 }} key={feature.id}>
                    <Card
                      elevation={0}
                      sx={{
                        textAlign: "center",
                        p: 3,
                        height: "100%",
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                        position: "relative",
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "error.main",
                          color: "white",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                        onClick={() => {
                          const newFeatures = settings.features.filter((_, i) => i !== index);
                          setSettings({ ...settings, features: newFeatures });
                          setDirty(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>

                      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <Box
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            borderRadius: "50%",
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent />
                        </Box>
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        <EditableText
                          value={feature.title}
                          onChange={(value) => {
                            const newFeatures = [...settings.features];
                            newFeatures[index] = { ...newFeatures[index], title: value };
                            setSettings({ ...settings, features: newFeatures });
                            setDirty(true);
                          }}
                          isEditMode={true}
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <EditableText
                          value={feature.description}
                          onChange={(value) => {
                            const newFeatures = [...settings.features];
                            newFeatures[index] = { ...newFeatures[index], description: value };
                            setSettings({ ...settings, features: newFeatures });
                            setDirty(true);
                          }}
                          multiline
                          isEditMode={true}
                        />
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}

              {settings.features.length < 6 && (
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card
                    elevation={0}
                    sx={{
                      textAlign: "center",
                      p: 3,
                      height: "100%",
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
                      border: "2px dashed",
                      borderColor: "success.main",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 200,
                      "&:hover": {
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                      },
                    }}
                    onClick={() => {
                      const newFeature = {
                        id: `f${Date.now()}`,
                        icon: "TrendingUpIcon",
                        title: "Nowy Kafelek",
                        description: "Opis kafelka",
                      };
                      setSettings({ ...settings, features: [...settings.features, newFeature] });
                      setDirty(true);
                    }}
                  >
                    <Box>
                      <AddIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
                      <Typography variant="h6" color="success.main">
                        Dodaj Kafelek
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Categories */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
                <EditableText
                  value={settings.categoriesTitle}
                  onChange={(value) => {
                    setSettings({ ...settings, categoriesTitle: value });
                    setDirty(true);
                  }}
                  isEditMode={true}
                />
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                <EditableText
                  value={settings.categoriesSubtitle}
                  onChange={(value) => {
                    setSettings({ ...settings, categoriesSubtitle: value });
                    setDirty(true);
                  }}
                  isEditMode={true}
                />
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              Kategorie są obecnie edytowalne tylko przez mockowane dane. Wybór kategorii z API
              będzie dostępny wkrótce.
            </Alert>
          </Container>
        </Box>
      </MainLayout>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Zmiany zostały zapisane pomyślnie!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          Błąd podczas zapisywania zmian
        </Alert>
      </Snackbar>
    </>
  );
};

export default HomePageEditor;
