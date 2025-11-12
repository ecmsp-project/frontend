import React, { useEffect, useState } from "react";
import { saveGlobalSettings } from "../../api/cms-service";
import { getRootCategories } from "../../api/product-service";
import CMSToolbar from "../../components/cms/CMSToolbar";
import EditableLink from "../../components/cms/EditableLink";
import EditableText from "../../components/cms/EditableText";
import { useCMS } from "../../contexts/CMSContext";
import type { CategoryFromAPI } from "../../types/cms";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import FacebookIcon from "@mui/icons-material/Facebook";
import HomeIcon from "@mui/icons-material/Home";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SpaIcon from "@mui/icons-material/Spa";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TwitterIcon from "@mui/icons-material/Twitter";
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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Tooltip,
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
    socialMedia: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
    copyrightText: "© 2025 E-COMMERCE. Wszelkie prawa zastrzeżone.",
  },
  headerShopName: "E-COMMERCE",
  contactPage: {
    pageTitle: "Kontakt",
    pageSubtitle: "Potrzebujesz pomocy?",
    sectionTitle: "Dane kontaktowe",
    phone: "22 299 00 89",
    phoneHours: "Poniedziałek - Piątek 9:00 - 19:00",
    email: "zamowienia@sklep.pl",
    emailDescription: "Zamówienia",
  },
};

const HomePageEditor: React.FC = () => {
  const { settings, setSettings, isDirty, setDirty, setEditMode } = useCMS();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<CategoryFromAPI[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  useEffect(() => {
    setEditMode(true);
    if (!settings) {
      setSettings(defaultSettings);
    }

    // Load selected category IDs from settings
    if (settings?.selectedCategoryIds) {
      setSelectedCategoryIds(settings.selectedCategoryIds);
    }

    // Fetch categories from API
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await getRootCategories();
        setAvailableCategories(response.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
    return () => setEditMode(false);
  }, [setEditMode, settings, setSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      // Save settings with selected category IDs
      const updatedSettings = {
        ...settings,
        selectedCategoryIds: selectedCategoryIds,
      };
      await saveGlobalSettings(updatedSettings);
      setSettings(updatedSettings);
      setDirty(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving settings:", error);
      setShowError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = (categoryId: string) => {
    if (!selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
      setDirty(true);
    }
    setCategoryDialogOpen(false);
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== categoryId));
    setDirty(true);
  };

  const getSelectedCategories = () => {
    return availableCategories.filter((cat) => selectedCategoryIds.includes(cat.id));
  };

  const getAvailableCategoriesToAdd = () => {
    return availableCategories.filter((cat) => !selectedCategoryIds.includes(cat.id));
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "#1976d2",
      "#9c27b0",
      "#e91e63",
      "#4caf50",
      "#ff9800",
      "#795548",
      "#00bcd4",
      "#f44336",
    ];
    return colors[index % colors.length];
  };

  if (!settings) return null;

  return (
    <>
      <CMSToolbar onSave={handleSave} isDirty={isDirty} isSaving={isSaving} />
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

          {/* Category Selection Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Wybierz kategorie z systemu, które mają być wyświetlane na stronie głównej
            </Typography>

            {isLoadingCategories ? (
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Ładowanie kategorii z API...
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {/* Selected Category Tiles */}
                {getSelectedCategories().map((category, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
                    <Card
                      elevation={2}
                      sx={{
                        height: "100%",
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      {/* Remove Button */}
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "error.main",
                          color: "white",
                          zIndex: 1,
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                        onClick={() => handleRemoveCategory(category.id)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>

                      {/* Category Header with Color */}
                      <Box
                        sx={{
                          height: 120,
                          background: `linear-gradient(135deg, ${getCategoryColor(index)} 0%, ${alpha(
                            getCategoryColor(index),
                            0.7,
                          )} 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <CategoryIcon
                          sx={{
                            fontSize: 64,
                            color: "white",
                            opacity: 0.9,
                          }}
                        />
                      </Box>

                      {/* Category Details */}
                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {category.name}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          <Tooltip title="Liczba produktów">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 1.5,
                                py: 0.5,
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="caption" fontWeight={600} color="primary">
                                {category.productCount}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                produktów
                              </Typography>
                            </Box>
                          </Tooltip>

                          {category.subCategoryCount > 0 && (
                            <Tooltip title="Liczba podkategorii">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  px: 1.5,
                                  py: 0.5,
                                  bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                                  borderRadius: 1,
                                }}
                              >
                                <Typography variant="caption" fontWeight={600} color="secondary">
                                  {category.subCategoryCount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  podkat.
                                </Typography>
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}

                {/* Add Category Button */}
                {getAvailableCategoriesToAdd().length > 0 && (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        minHeight: 220,
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
                        border: "2px dashed",
                        borderColor: "success.main",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                          transform: "scale(1.02)",
                        },
                      }}
                      onClick={() => setCategoryDialogOpen(true)}
                    >
                      <Box sx={{ textAlign: "center", p: 3 }}>
                        <AddIcon sx={{ fontSize: 56, color: "success.main", mb: 2 }} />
                        <Typography variant="h6" color="success.main" fontWeight={600}>
                          Dodaj Kategorię
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {getAvailableCategoriesToAdd().length} dostępnych
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                )}
              </Grid>
            )}

            {!isLoadingCategories && getAvailableCategoriesToAdd().length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Wszystkie dostępne kategorie zostały już dodane.
              </Alert>
            )}
          </Box>
        </Container>

        {/* Footer - edytowalna stopka */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            pt: 6,
            pb: 3,
            mt: "auto",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {/* About Section */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={700}
                  sx={{
                    fontFamily: "monospace",
                    letterSpacing: ".1rem",
                    mb: 2,
                  }}
                >
                  <EditableText
                    value={settings.footer.shopName}
                    onChange={(value) => {
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, shopName: value },
                      });
                      setDirty(true);
                    }}
                    isEditMode={true}
                  />
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, lineHeight: 1.7 }}>
                  <EditableText
                    value={settings.footer.shopDescription}
                    onChange={(value) => {
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, shopDescription: value },
                      });
                      setDirty(true);
                    }}
                    multiline
                    isEditMode={true}
                  />
                </Typography>

                {/* Social Media Icons */}
                <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                  <Box
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                      p: 0.5,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    <EditableLink
                      value={settings.footer.socialMedia.facebook}
                      onChange={(value) => {
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            socialMedia: { ...settings.footer.socialMedia, facebook: value },
                          },
                        });
                        setDirty(true);
                      }}
                      icon={<FacebookIcon fontSize="small" />}
                      label="Link do Facebook"
                      isEditMode={true}
                    />
                  </Box>
                  <Box
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                      p: 0.5,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    <EditableLink
                      value={settings.footer.socialMedia.twitter}
                      onChange={(value) => {
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            socialMedia: { ...settings.footer.socialMedia, twitter: value },
                          },
                        });
                        setDirty(true);
                      }}
                      icon={<TwitterIcon fontSize="small" />}
                      label="Link do Twitter"
                      isEditMode={true}
                    />
                  </Box>
                  <Box
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                      p: 0.5,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    <EditableLink
                      value={settings.footer.socialMedia.instagram}
                      onChange={(value) => {
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            socialMedia: { ...settings.footer.socialMedia, instagram: value },
                          },
                        });
                        setDirty(true);
                      }}
                      icon={<InstagramIcon fontSize="small" />}
                      label="Link do Instagram"
                      isEditMode={true}
                    />
                  </Box>
                  <Box
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                      p: 0.5,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.2)",
                      },
                    }}
                  >
                    <EditableLink
                      value={settings.footer.socialMedia.linkedin}
                      onChange={(value) => {
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            socialMedia: { ...settings.footer.socialMedia, linkedin: value },
                          },
                        });
                        setDirty(true);
                      }}
                      icon={<LinkedInIcon fontSize="small" />}
                      label="Link do LinkedIn"
                      isEditMode={true}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Spacer - dwie puste kolumny */}
              <Grid size={{ xs: 0, md: 4 }}></Grid>

              {/* Customer Service */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                  Obsługa klienta
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  <EditableText
                    value={settings.footer.customerServiceHours[0] || ""}
                    onChange={(value) => {
                      const newHours = [...settings.footer.customerServiceHours];
                      newHours[0] = value;
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, customerServiceHours: newHours },
                      });
                      setDirty(true);
                    }}
                    isEditMode={true}
                  />
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  <EditableText
                    value={settings.footer.customerServiceHours[1] || ""}
                    onChange={(value) => {
                      const newHours = [...settings.footer.customerServiceHours];
                      newHours[1] = value;
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, customerServiceHours: newHours },
                      });
                      setDirty(true);
                    }}
                    isEditMode={true}
                  />
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                  Tel:{" "}
                  <EditableText
                    value={settings.footer.customerServicePhone}
                    onChange={(value) => {
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, customerServicePhone: value },
                      });
                      setDirty(true);
                    }}
                    isEditMode={true}
                  />
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />

            {/* Copyright */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                <EditableText
                  value={settings.footer.copyrightText}
                  onChange={(value) => {
                    setSettings({
                      ...settings,
                      footer: { ...settings.footer, copyrightText: value },
                    });
                    setDirty(true);
                  }}
                  isEditMode={true}
                />
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>

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

      {/* Category Selection Dialog */}
      <Dialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CategoryIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Wybierz kategorię
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setCategoryDialogOpen(false)}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Kliknij kategorię aby dodać ją do strony głównej
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {getAvailableCategoriesToAdd().length === 0 ? (
            <Alert severity="info">Wszystkie kategorie zostały już dodane.</Alert>
          ) : (
            <List sx={{ p: 0 }}>
              {getAvailableCategoriesToAdd().map((category, index) => (
                <ListItem key={category.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleAddCategory(category.id)}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        bgcolor: getCategoryColor(index),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      <CategoryIcon sx={{ color: "white", fontSize: 28 }} />
                    </Box>

                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={600}>
                          {category.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {category.productCount}{" "}
                            {category.productCount === 1 ? "produkt" : "produktów"}
                          </Typography>
                          {category.subCategoryCount > 0 && (
                            <>
                              <Typography variant="caption" color="text.secondary">
                                •
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {category.subCategoryCount}{" "}
                                {category.subCategoryCount === 1 ? "podkategoria" : "podkategorii"}
                              </Typography>
                            </>
                          )}
                        </Box>
                      }
                    />

                    <AddIcon sx={{ color: "success.main", ml: 1 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomePageEditor;
