import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import { useCartContext, type CartItem } from "../contexts/CartContext";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";

const SHIPPING_COST = 19.99;
const FREE_SHIPPING_THRESHOLD = 500;

const CartProductCard: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateProductQuantity, overwriteProductQuantity, removeProduct } = useCartContext();

  const [localQuantity, setLocalQuantity] = useState(String(item.quantity));

  useEffect(() => {
    setLocalQuantity(String(item.quantity));
  }, [item.quantity]);

  const handleQuantityChange = async (delta: number) => {
    try {
      await updateProductQuantity(item.id, item.quantity, delta);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuantity(event.target.value);
  };

  const handleQuantityOverwrite = async (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newQuantity = parseInt(value, 10);
    try {
      await overwriteProductQuantity(item.id, newQuantity);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      await removeProduct(item.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        boxShadow: 1,
        transition: "0.2s",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, objectFit: "cover" }}
        image={item.image}
        alt={item.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent
          sx={{
            flex: "1 0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
          }}
        >
          <Box sx={{ minWidth: 200 }}>
            <Typography component="div" variant="subtitle1" fontWeight={600}>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.price.toFixed(2)} PLN / szt.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
            <IconButton
              size="small"
              aria-label="decrease quantity"
              disabled={item.quantity <= 1}
              onClick={() => handleQuantityChange(-1)}
            >
              <RemoveIcon fontSize="inherit" />
            </IconButton>
            <TextField
              value={localQuantity}
              size="small"
              variant="outlined"
              sx={{ width: 50, mx: 0.5 }}
              inputProps={{ style: { textAlign: "center", padding: "4px" } }}
              onChange={handleLocalChange}
              onBlur={handleQuantityOverwrite}
            />
            <IconButton
              size="small"
              aria-label="increase quantity"
              onClick={() => handleQuantityChange(1)}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ minWidth: 90, textAlign: "right", fontWeight: 700 }}>
              {(item.price * item.quantity).toFixed(2)} PLN
            </Typography>
            <IconButton aria-label="delete" color="error" sx={{ ml: 2 }} onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

const CartPage: React.FC = () => {
  const { cartItems, loading, error } = useCartContext();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Ładowanie koszyka...</Typography>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs items={[{ label: "Twój Koszyk" }]} />
        <Typography variant="h4" gutterBottom>
          Twój Koszyk
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Produkty w Koszyku ({cartItems.length})
            </Typography>
            {cartItems.length > 0 ? (
              cartItems.map((item) => <CartProductCard key={item.id} item={item} />)
            ) : (
              <Box sx={{ p: 3, bgcolor: "grey.50", borderRadius: 1, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                  Twój koszyk jest pusty.
                </Typography>
              </Box>
            )}

            {FREE_SHIPPING_THRESHOLD - subtotal > 0 && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Typography color="primary.main">
                  Brakuje {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} PLN do darmowej wysyłki.
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ p: 3, position: "sticky", top: 20 }}>
              <Typography variant="h5" gutterBottom fontWeight={500}>
                Podsumowanie Zamówienia
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1">Wartość Produktów:</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {subtotal.toFixed(2)} PLN
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body1">Koszty Wysyłki:</Typography>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color={shipping === 0 ? "success.main" : "text.primary"}
                >
                  {shipping === 0 ? "GRATIS" : `${shipping.toFixed(2)} PLN`}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                  RAZEM:
                </Typography>
                <Typography variant="h5" color="primary.main" fontWeight={700}>
                  {total.toFixed(2)} PLN
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => console.log("Przejdź do kasy")}
              >
                Przejdź do Kasy
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default CartPage;
