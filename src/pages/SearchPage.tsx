import React, { useEffect, useState } from "react";
import { getProductsByCategory, searchProducts } from "../api/product-service";
import MainLayout from "../components/layout/MainLayout";
import { useProductContext } from "../contexts/ProductContext.tsx";
import type { CategoryFromAPI } from "../types/cms";
import type { ProductRepresentationDTO } from "../types/products.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useLocation, useParams, useNavigate } from "react-router-dom";

interface CategoryFilterProps {
  categories: CategoryFromAPI[];
  selectedCategoryId: string | null;
  onCategoryClick: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onCategoryClick,
}) => {
  const [categorySearchTerm, setCategorySearchTerm] = useState<string>("");

  const mainCategories = categories.filter((cat) => cat.parentCategoryId === null);
  const subCategoriesMap = new Map<string, CategoryFromAPI[]>();

  categories.forEach((cat) => {
    if (cat.parentCategoryId) {
      if (!subCategoriesMap.has(cat.parentCategoryId)) {
        subCategoriesMap.set(cat.parentCategoryId, []);
      }
      subCategoriesMap.get(cat.parentCategoryId)!.push(cat);
    }
  });

  const searchLower = categorySearchTerm.toLowerCase();
  const filteredMainCategories = mainCategories.filter((mainCat) => {
    if (!categorySearchTerm) return true;

    const mainMatches = mainCat.name.toLowerCase().includes(searchLower);
    const subCategories = subCategoriesMap.get(mainCat.id) || [];
    const hasMatchingSubCategory = subCategories.some((subCat) =>
      subCat.name.toLowerCase().includes(searchLower),
    );

    return mainMatches || hasMatchingSubCategory;
  });

  const getFilteredSubCategories = (mainCategoryId: string): CategoryFromAPI[] => {
    const subCategories = subCategoriesMap.get(mainCategoryId) || [];
    if (!categorySearchTerm) return subCategories;

    return subCategories.filter((subCat) => subCat.name.toLowerCase().includes(searchLower));
  };

  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Kategoria
      </Typography>
      <TextField
        size="small"
        fullWidth
        placeholder="Szukaj kategorii..."
        value={categorySearchTerm}
        onChange={(e) => setCategorySearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          maxHeight: "500px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
          },
        }}
      >
        {filteredMainCategories.length > 0 ? (
          filteredMainCategories.map((mainCategory) => {
            const filteredSubCategories = getFilteredSubCategories(mainCategory.id);
            const hasSubCategories = filteredSubCategories.length > 0;

            return (
              <Accordion
                key={mainCategory.id}
                disableGutters
                elevation={0}
                defaultExpanded={Boolean(categorySearchTerm && filteredSubCategories.length > 0)}
                sx={{
                  border: "none",
                  "&:before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={hasSubCategories ? <ExpandMoreIcon /> : null}
                  sx={{
                    minHeight: 40,
                    "&.Mui-expanded": {
                      minHeight: 40,
                    },
                    px: 0,
                  }}
                >
                  <ListItemButton
                    sx={{
                      py: 0.5,
                      px: 1,
                      backgroundColor:
                        selectedCategoryId === mainCategory.id ? "action.selected" : "transparent",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryClick(mainCategory.id);
                    }}
                  >
                    <ListItemText
                      primary={mainCategory.name}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: selectedCategoryId === mainCategory.id ? 600 : 400,
                      }}
                      secondary={
                        mainCategory.productCount > 0
                          ? `${mainCategory.productCount} produktów`
                          : undefined
                      }
                    />
                  </ListItemButton>
                </AccordionSummary>
                {hasSubCategories && (
                  <AccordionDetails sx={{ py: 0, px: 0 }}>
                    <List dense sx={{ pl: 2 }}>
                      {filteredSubCategories.map((subCategory) => (
                        <ListItem key={subCategory.id} disablePadding>
                          <ListItemButton
                            sx={{
                              py: 0.5,
                              backgroundColor:
                                selectedCategoryId === subCategory.id
                                  ? "action.selected"
                                  : "transparent",
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                            onClick={() => onCategoryClick(subCategory.id)}
                          >
                            <ListItemText
                              primary={subCategory.name}
                              primaryTypographyProps={{
                                fontSize: "0.8125rem",
                                fontWeight: selectedCategoryId === subCategory.id ? 500 : 400,
                              }}
                              secondary={
                                subCategory.productCount > 0
                                  ? `${subCategory.productCount} produktów`
                                  : undefined
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                )}
              </Accordion>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2, py: 2 }}>
            {categorySearchTerm ? "Nie znaleziono kategorii" : "Brak kategorii"}
          </Typography>
        )}
      </Box>
    </>
  );
};

const ProductListItem: React.FC<{ product: ProductRepresentationDTO }> = ({ product }) => (
  <Paper
    sx={{
      p: 2,
      mb: 2,
      display: "flex",
      alignItems: "center",
      transition: "0.3s",
      "&:hover": { boxShadow: 3 },
    }}
  >
    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
      <img
        src={product.variantDetail.imageUrl}
        alt={product.variantDetail.description}
        style={{
          width: 100,
          height: 100,
          objectFit: "cover",
          marginRight: 16,
          borderRadius: 4,
        }}
      />
      <Box>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            my: 0.5,
            maxWidth: 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Stan magazynowy: {product.variantDetail.stockQuantity}
        </Typography>
      </Box>
    </Box>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        ml: 2,
      }}
    >
      <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700, mb: 1 }}>
        {product.variantDetail.price.toFixed(2)} PLN
      </Typography>
      <Button variant="contained" color="primary" size="small">
        Do Koszyka
      </Button>
    </Box>
  </Paper>
);

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<ProductRepresentationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { categories } = useProductContext();
  const params = useParams<{ slug: string }>();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");

    if (queryParam) {
      setSearchTerm(queryParam);
      setCategoryId(null);
      loadSearchResults(queryParam);
      return;
    }
    if (params.slug) {
      setSearchTerm("");
      setCategoryId(params.slug);
      loadProductsByCategory(params.slug);
      return;
    }
    setSearchTerm("");
    setCategoryId(null);
    setProducts([]);
  }, [location.search, location.pathname, params.slug]);

  const loadProductsByCategory = async (catId: string) => {
    setLoading(true);
    try {
      const response = await getProductsByCategory(catId, {
        pageNumber: 0,
        pageSize: 20,
      });
      setProducts(response.productsRepresentation || []);
    } catch (error) {
      console.error("Error loading products by category:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSearchResults = async (query: string) => {
    setLoading(true);
    try {
      const response = await searchProducts(query, {
        pageNumber: 0,
        pageSize: 20,
      });
      setProducts(response.productsRepresentation || []);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {searchTerm && (
          <Typography padding={4} paddingBottom={0} variant="h4" component="h1" gutterBottom>
            Wyniki wyszukiwania dla "{searchTerm}"
          </Typography>
        )}
        {categoryId && !searchTerm && (
          <Typography padding={4} paddingBottom={0} variant="h4" component="h1" gutterBottom>
            Produkty z kategorii {categories.find((category) => category.id === categoryId)?.name}
          </Typography>
        )}

        <Grid padding={4} container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Filtry
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <CategoryFilter
                categories={categories}
                selectedCategoryId={categoryId}
                onCategoryClick={handleCategoryClick}
              />

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Cena
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Od 0 zł do 5000 zł
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography variant="subtitle1" gutterBottom color="text.secondary">
                  Znaleziono {products.length} {products.length === 1 ? "produkt" : "produktów"}
                </Typography>

                <Box>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductListItem key={product.variantDetail.variant_id} product={product} />
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
                      Brak produktów do wyświetlenia
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default SearchPage;
