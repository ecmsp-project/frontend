import React, { useEffect, useState } from "react";
import { getProductsByCategory, searchProducts } from "../api/product-service";
import MainLayout from "../components/layout/MainLayout";
import { useProductContext } from "../contexts/ProductContext.tsx";
import type { ProductRepresentationDTO } from "../types/products.ts";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

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
  const { categories } = useProductContext();
  const params = useParams<{ slug: string }>();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");

    if (queryParam) {
      setSearchTerm(queryParam);
      setCategoryId(null);
      loadSearchResults(queryParam);
    } else if (params.slug) {
      setSearchTerm("");
      setCategoryId(params.slug);
      loadProductsByCategory(params.slug);
    } else {
      setSearchTerm("");
      setCategoryId(null);
      setProducts([]);
    }
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

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Kategoria
              </Typography>
              <List dense>
                {["Elektronika", "Akcesoria", "Gry"].map((text) => (
                  <ListItem key={text} button sx={{ py: 0 }} {...({ component: "div" } as any)}>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>

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
