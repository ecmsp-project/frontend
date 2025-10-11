import React from "react";
import MainLayout from "../components/layout/MainLayout";
import type { Product } from "../types/products.ts";
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
  Rating,
  Button,
} from "@mui/material";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop Gamingowy X",
    price: 4999.99,
    description: "Potężny laptop do gier i pracy.",
    image: "https://via.placeholder.com/100x100?text=Produkt+1",
    rating: 4.5,
    reviews: 120,
  },
  {
    id: 2,
    name: "T-Shirt Bawełniany",
    price: 79.5,
    description: "Wygodny, 100% bawełna.",
    image: "https://via.placeholder.com/100x100?text=Produkt+2",
    rating: 4.2,
    reviews: 55,
  },
  {
    id: 3,
    name: "Krem Nawilżający Ultra",
    price: 120.0,
    description: "Intensywne nawilżenie na cały dzień.",
    image: "https://via.placeholder.com/100x100?text=Produkt+3",
    rating: 4.8,
    reviews: 300,
  },
];

const ProductListItem: React.FC<{ product: Product }> = ({ product }) => (
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
        src={product.image}
        alt={product.name}
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
          {product.description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Rating value={product.rating} readOnly size="small" precision={0.1} />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews} opinii)
          </Typography>
        </Box>
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
        {product.price.toFixed(2)} PLN
      </Typography>
      <Button variant="contained" color="primary" size="small">
        Do Koszyka
      </Button>
    </Box>
  </Paper>
);

const SearchPage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Wyniki wyszukiwania dla "Laptop"
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3} {...({ component: "div" } as any)}>
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
          <Grid item xs={12} md={9} {...({ component: "div" } as any)}>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
              Znaleziono {mockProducts.length} produkty
            </Typography>

            <Box>
              {mockProducts.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default SearchPage;
