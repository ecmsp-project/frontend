import React, { useEffect, useState } from "react";
import { fetchHomeSettings } from "../api/cms-service";
import { getRootCategories } from "../api/product-service";
import MainLayout from "../components/layout/MainLayout.tsx";
import type { HomePageContent, CategoryFromAPI } from "../types/cms";
import CategoryIcon from "@mui/icons-material/Category";
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
  Box,
  Button,
  Chip,
  alpha,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const CACHE_KEY_HOME = "homepage_cache";
const CACHE_KEY_CATEGORIES = "homepage_categories";
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheData<T> {
  data: T;
  timestamp: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [homeContent, setHomeContent] = useState<HomePageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesFromAPI, setCategoriesFromAPI] = useState<CategoryFromAPI[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);

        const cachedHome = sessionStorage.getItem(CACHE_KEY_HOME);
        const cachedCategories = sessionStorage.getItem(CACHE_KEY_CATEGORIES);

        let cmsData: HomePageContent | null = null;
        let categoriesResponse: { categories: CategoryFromAPI[] } | null = null;

        if (cachedHome) {
          const parsed: CacheData<HomePageContent> = JSON.parse(cachedHome);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            cmsData = parsed.data;
          }
        }

        if (cachedCategories) {
          const parsed: CacheData<{ categories: CategoryFromAPI[] }> = JSON.parse(cachedCategories);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            categoriesResponse = parsed.data;
          }
        }

        const promises: Promise<any>[] = [];
        if (!cmsData) {
          promises.push(
            fetchHomeSettings().then((data) => {
              cmsData = data;
              sessionStorage.setItem(
                CACHE_KEY_HOME,
                JSON.stringify({ data, timestamp: Date.now() } as CacheData<HomePageContent>),
              );
            }),
          );
        }
        if (!categoriesResponse) {
          promises.push(
            getRootCategories().then((data) => {
              categoriesResponse = data;
              sessionStorage.setItem(
                CACHE_KEY_CATEGORIES,
                JSON.stringify({
                  data,
                  timestamp: Date.now(),
                } as CacheData<{ categories: CategoryFromAPI[] }>),
              );
            }),
          );
        }

        if (cmsData) {
          setHomeContent(cmsData);
        }
        if (categoriesResponse) {
          setCategoriesFromAPI(categoriesResponse.categories);
        }

        if (promises.length > 0) {
          await Promise.all(promises);
          if (cmsData) {
            setHomeContent(cmsData);
          }
          if (categoriesResponse) {
            setCategoriesFromAPI(categoriesResponse.categories);
          }
        }
      } catch (error) {
        console.error("Failed to load home content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const getSelectedCategories = () => {
    if (!homeContent?.selectedCategoryIds || homeContent.selectedCategoryIds.length === 0) {
      return [];
    }
    return categoriesFromAPI.filter((cat) => homeContent.selectedCategoryIds?.includes(cat.id));
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

  if (isLoading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </MainLayout>
    );
  }

  const selectedCategories = getSelectedCategories();
  const displayCategories = selectedCategories.length > 0 ? selectedCategories : [];
  const displayFeatures = homeContent?.features || features;

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
            {homeContent?.hero.title || "Witaj w E-COMMERCE"}
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
            {homeContent?.hero.subtitle || "Odkryj najlepsze produkty w najlepszych cenach"}
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
              {homeContent?.hero.primaryButtonText || "Rozpocznij Zakupy"}
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
              {homeContent?.hero.secondaryButtonText || "Dowiedz Się Więcej"}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {displayFeatures.map((feature, index) => {
            const IconComponent =
              typeof feature.icon === "string"
                ? iconMap[feature.icon] || TrendingUpIcon
                : feature.icon || TrendingUpIcon;
            return (
              <Grid
                size={{ xs: 12, md: 4 }}
                key={"id" in feature ? feature.id : `feature-${index}`}
              >
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
                      <IconComponent sx={{ fontSize: 40 }} />
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
            );
          })}
        </Grid>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={700} sx={{ mb: 1 }}>
            {homeContent?.categoriesTitle || "Popularne Kategorie"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {homeContent?.categoriesSubtitle || "Odkryj nasze najlepsze kategorie produktów"}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {displayCategories.map((category, index) => {
            const IconComponent = (category as any).icon
              ? iconMap[(category as any).icon] || PhoneAndroidIcon
              : CategoryIcon;
            const categoryColor = getCategoryColor(index);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
                <Card
                  sx={{
                    height: 280,
                    position: "relative",
                    cursor: "pointer",
                    background: `linear-gradient(135deg, ${alpha(categoryColor, 0.15)} 0%, ${alpha(categoryColor, 0.05)} 100%)`,
                    border: `2px solid ${alpha(categoryColor, 0.2)}`,
                    borderRadius: 3,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 24px ${alpha(categoryColor, 0.3)}`,
                      borderColor: categoryColor,
                      background: `linear-gradient(135deg, ${alpha(categoryColor, 0.2)} 0%, ${alpha(categoryColor, 0.1)} 100%)`,
                      "& .category-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                      "& .category-button": {
                        bgcolor: categoryColor,
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                    },
                  }}
                  onClick={() => navigate(`/category/${category.id}`)}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      width: "100%",
                    }}
                  >
                    <Box
                      className="category-icon"
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        bgcolor: alpha(categoryColor, 0.15),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        mx: "auto",
                        transition: "all 0.4s",
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 50,
                          color: categoryColor,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      gutterBottom
                      sx={{ color: "text.primary" }}
                    >
                      {category.name}
                    </Typography>
                    {(category as CategoryFromAPI).productCount !== undefined && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {(category as CategoryFromAPI).productCount} produktów
                      </Typography>
                    )}
                    <Button
                      className="category-button"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/category/${category.id}`);
                      }}
                      sx={{
                        borderColor: categoryColor,
                        color: categoryColor,
                        fontWeight: 600,
                        px: 4,
                        py: 1,
                        mt: 1,
                        transition: "all 0.3s",
                        "&:hover": {
                          borderColor: categoryColor,
                          bgcolor: categoryColor,
                          color: "white",
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 12px ${alpha(categoryColor, 0.4)}`,
                        },
                      }}
                    >
                      Przeglądaj
                    </Button>
                  </Box>
                  <Chip
                    label="Popularne"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: categoryColor,
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
