import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Gallery from "../components/common/Gallery";
import MainLayout from "../components/layout/MainLayout.tsx";
import { useProductContext } from "../contexts/ProductContext";
import { useProductPage } from "../hooks/useProductPage";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Divider,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

const ProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [searchParams] = useSearchParams();
  const { categories } = useProductContext();

  const {
    variant,
    selectablePropertyNames,
    selectedProperties,
    selectableProperties,
    requiredProperties,
    infoProperties,
    loading,
    error,
    showMoreParams,
    setShowMoreParams,
    handlePropertyChange,
    getAvailableValues,
  } = useProductPage();

  // Get categoryId from URL params or from localStorage (if user came from category)
  const categoryIdFromUrl = searchParams.get("categoryId");
  const [productCategoryId, setProductCategoryId] = useState<string | null>(
    categoryIdFromUrl ||
      (variant?.variantId ? localStorage.getItem(`product_${variant.variantId}_category`) : null) ||
      null,
  );

  const leftRef = useRef<HTMLDivElement | null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const syncHeights = () => {
      const left = leftRef.current;
      const sidebarWrapper = sidebarWrapperRef.current;
      if (left && sidebarWrapper) {
        sidebarWrapper.style.minHeight = `${left.offsetHeight}px`;
      }
    };
    syncHeights();
    window.addEventListener("resize", syncHeights);
    setTimeout(syncHeights, 500);
    return () => window.removeEventListener("resize", syncHeights);
  }, [variant]);

  useEffect(() => {
    if (categoryIdFromUrl && variant?.variantId) {
      localStorage.setItem(`product_${variant.variantId}_category`, categoryIdFromUrl);
      setProductCategoryId(categoryIdFromUrl);
    } else if (variant?.variantId && !productCategoryId) {
      const savedCategoryId = localStorage.getItem(`product_${variant.variantId}_category`);
      if (savedCategoryId) {
        setProductCategoryId(savedCategoryId);
      }
    }
  }, [categoryIdFromUrl, variant?.variantId, productCategoryId]);

  const categoryName = productCategoryId
    ? categories.find((cat) => cat.id === productCategoryId)?.name
    : null;

  const productImages =
    variant?.variantImages && variant.variantImages.length > 0
      ? variant.variantImages
          .map((img) => img.url)
          .sort((a, b) => {
            const imgA = variant.variantImages.find((i) => i.url === a);
            const imgB = variant.variantImages.find((i) => i.url === b);
            return (imgA?.position || 0) - (imgB?.position || 0);
          })
      : ["https://via.placeholder.com/600x600?text=No+Image"];

  const displayedParams = showMoreParams
    ? [...selectableProperties, ...requiredProperties, ...infoProperties]
    : [...requiredProperties, ...selectableProperties];

  const descriptionPoints = variant?.description
    ? variant.description.split("\n").filter((line) => line.trim())
    : [];

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading product...
          </Typography>
        </Container>
      </MainLayout>
    );
  }

  if (error || !variant) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert severity="error">{error || "Product not found"}</Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 },
          py: 4,
          width: "100%",
        }}
      >
        <Breadcrumbs
          items={[
            ...(categoryName
              ? [{ label: categoryName, path: `/category/${productCategoryId}` }]
              : []),
            { label: variant.name },
          ]}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
          E-COMMERCE
        </Typography>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 3,
            fontWeight: 500,
            lineHeight: 1.3,
            wordBreak: "break-word",
            maxWidth: "100%",
          }}
        >
          {variant.name}
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, sm: 4, md: 6 }}
          alignItems="flex-start"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.5fr) minmax(300px, 0.8fr)",
              lg: "minmax(0, 1.8fr) minmax(350px, 0.9fr)",
              xl: "minmax(0, 2fr) minmax(400px, 1fr)",
            },
            gap: theme.spacing(5),
          }}
        >
          <Box ref={leftRef}>
            <Gallery images={productImages} />
            <Divider sx={{ my: 4 }} />

            {displayedParams.length > 0 && (
              <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Parameters
                </Typography>
                <List dense sx={{ maxWidth: 600 }}>
                  {displayedParams.map((prop) => {
                    const getValue = () => {
                      if (prop.displayText) return prop.displayText;
                      if (prop.valueText) return prop.valueText;
                      if (prop.valueDecimal !== null && prop.valueDecimal !== undefined)
                        return String(prop.valueDecimal);
                      if (prop.valueBoolean !== null && prop.valueBoolean !== undefined)
                        return prop.valueBoolean ? "Yes" : "No";
                      if (prop.valueDate)
                        return new Date(prop.valueDate).toLocaleDateString("en-US");
                      return "-";
                    };

                    return (
                      <React.Fragment key={prop.id}>
                        <ListItem disablePadding>
                          <ListItemText
                            primary={prop.propertyName}
                            secondary={getValue()}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontWeight: 500,
                                width: "40%",
                                display: "inline-block",
                              },
                              "& .MuiListItemText-secondary": {
                                width: "60%",
                                display: "inline-block",
                                ml: 2,
                              },
                            }}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    );
                  })}
                </List>
                {(selectableProperties.length > 0 || infoProperties.length > 0) && (
                  <Button
                    variant="text"
                    onClick={() => setShowMoreParams(!showMoreParams)}
                    sx={{
                      mt: 2,
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    {showMoreParams ? "Show Less" : "ALL PARAMETERS"}
                  </Button>
                )}
              </Paper>
            )}

            {descriptionPoints.length > 0 && (
              <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Product Description
                </Typography>
                <List dense>
                  {descriptionPoints.map((point, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText primary={`• ${point}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          <Box ref={sidebarWrapperRef} sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "static",
                height: "fit-content",
              }}
            >
              <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h4" color="primary.main" fontWeight={700} sx={{ mb: 1 }}>
                  {variant.price.toFixed(2)} PLN
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Stock level: {variant.stockQuantity}
                </Typography>

                {selectablePropertyNames.map((propertyName) => {
                  const availableValues = getAvailableValues(propertyName);
                  const selectedValue = selectedProperties[propertyName];

                  if (availableValues.length === 0) return null;

                  return (
                    <Box key={propertyName} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {propertyName}
                      </Typography>
                      <ToggleButtonGroup
                        exclusive
                        value={selectedValue || ""}
                        onChange={(_, val) => val && handlePropertyChange(propertyName, val)}
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        {availableValues.map((value) => (
                          <ToggleButton key={value} value={value} disabled={!value}>
                            {value}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>
                  );
                })}

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Number of units
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    sx={{ border: "1px solid #ccc" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      mx: 1,
                      width: 40,
                      textAlign: "center",
                      border: "1px solid #ccc",
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    sx={{ border: "1px solid #ccc" }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    mb: 1,
                    bgcolor: "#ff6600",
                    "&:hover": { bgcolor: "#e65c00" },
                  }}
                >
                  ADD TO CART
                </Button>
                <Button variant="contained" color="primary" fullWidth size="large">
                  BUY AND PAY
                </Button>
              </Paper>
            </Box>
          </Box>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default ProductPage;
