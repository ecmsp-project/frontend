import React from "react";
import MainLayout from "../components/layout/MainLayout.tsx";
import CheckroomIcon from "@mui/icons-material/Checkroom";
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
  CardContent,
  CardMedia,
  Box,
  Button,
  Chip,
  alpha,
} from "@mui/material";

const categories = [
  {
    id: 1,
    name: "Elektronika",
    image: "https://via.placeholder.com/400x300/1976d2/ffffff?text=Elektronika",
    icon: PhoneAndroidIcon,
    color: "#1976d2",
  },
  {
    id: 2,
    name: "Ubrania",
    image: "https://via.placeholder.com/400x300/9c27b0/ffffff?text=Ubrania",
    icon: CheckroomIcon,
    color: "#9c27b0",
  },
  {
    id: 3,
    name: "Kosmetyki",
    image: "https://via.placeholder.com/400x300/e91e63/ffffff?text=Kosmetyki",
    icon: SpaIcon,
    color: "#e91e63",
  },
  {
    id: 4,
    name: "Dom i Ogród",
    image: "https://via.placeholder.com/400x300/4caf50/ffffff?text=Dom+i+Ogród",
    icon: HomeIcon,
    color: "#4caf50",
  },
  {
    id: 5,
    name: "Sport",
    image: "https://via.placeholder.com/400x300/ff9800/ffffff?text=Sport",
    icon: SportsBasketballIcon,
    color: "#ff9800",
  },
  {
    id: 6,
    name: "Książki",
    image: "https://via.placeholder.com/400x300/795548/ffffff?text=Książki",
    icon: MenuBookIcon,
    color: "#795548",
  },
];

const features = [
  {
    icon: TrendingUpIcon,
    title: "Najlepsze Ceny",
    description: "Konkurencyjne ceny na rynku",
  },
  {
    icon: LocalShippingIcon,
    title: "Darmowa Dostawa",
    description: "Przy zamówieniach powyżej 100 zł",
  },
  {
    icon: VerifiedUserIcon,
    title: "Bezpieczne Zakupy",
    description: "Gwarancja zwrotu pieniędzy",
  },
];

const HomePage: React.FC = () => {
  return (
    <MainLayout>
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
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Witaj w E-COMMERCE
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 4,
              fontWeight: 300,
              opacity: 0.95,
            }}
          >
            Odkryj najlepsze produkty w najlepszych cenach
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                },
                transition: "all 0.3s",
              }}
            >
              Rozpocznij Zakupy
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "white",
                borderColor: "white",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s",
              }}
            >
              Dowiedz Się Więcej
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* Features */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
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
                    <feature.icon sx={{ fontSize: 40 }} />
                  </Box>
                </Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Categories Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
            Popularne Kategorie
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Odkryj nasze najlepsze kategorie produktów
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
                <Card
                  sx={{
                    height: 280,
                    position: "relative",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                      "& .category-overlay": {
                        opacity: 1,
                      },
                      "& .category-content": {
                        transform: "translateY(0)",
                      },
                      "& .category-image": {
                        transform: "scale(1.1)",
                      },
                    },
                  }}
                  onClick={() => console.log(`Przejdź do kategorii: ${category.name}`)}
                >
                  <CardMedia
                    component="img"
                    height="280"
                    image={category.image}
                    alt={category.name}
                    className="category-image"
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.4s",
                    }}
                  />
                  <Box
                    className="category-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: alpha(category.color, 0.85),
                      opacity: 0,
                      transition: "opacity 0.4s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      className="category-content"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        transform: "translateY(20px)",
                        transition: "transform 0.4s",
                      }}
                    >
                      <IconComponent sx={{ fontSize: 60, mb: 2 }} />
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        {category.name}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "white",
                          color: category.color,
                          mt: 2,
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.9)",
                          },
                        }}
                      >
                        Przeglądaj
                      </Button>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      bgcolor: alpha("#000", 0.6),
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography variant="h6" color="white" fontWeight={600} align="center">
                      {category.name}
                    </Typography>
                  </Box>
                  <Chip
                    label="Popularne"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: category.color,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default HomePage;
