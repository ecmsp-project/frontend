import React, { useEffect, useState } from "react";
import { createOrder } from "../api/order-service.ts";
import { getVariantDetails } from "../api/product-service";
import Breadcrumbs from "../components/common/Breadcrumbs.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import { useCartContext, type CartItem } from "../contexts/CartContext";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SHIPPING_COST = 19.99;
const FREE_SHIPPING_THRESHOLD = 500;

const CartProductCard: React.FC<{ item: CartItem; onClick: () => void }> = ({ item, onClick }) => {
  const { updateProductQuantity, overwriteProductQuantity, removeProduct } = useCartContext();
  const theme = useTheme();

  const [localQuantity, setLocalQuantity] = useState(String(item.quantity));
  const [productName, setProductName] = useState(item.name || "");

  useEffect(() => {
    setLocalQuantity(String(item.quantity));
  }, [item.quantity]);

  useEffect(() => {
    if (item.name === null) {
      getVariantDetails(item.id)
        .then((variant) => {
          setProductName(variant.variant.name);
        })
        .catch((err) => {
          console.error("Failed to fetch variant name:", err);
          setProductName(item.name);
        });
    } else {
      setProductName(item.name);
    }
  }, [item.id, item.name]);

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
        borderRadius: 2,
        boxShadow: 1,
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: 140, sm: 180 },
          height: "100%",
          minHeight: { xs: 140, sm: 180 },
          objectFit: "cover",
          flexShrink: 0,
        }}
        image={item.image}
        alt={item.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
        <CardContent
          sx={{
            flex: "1 0 auto",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
            p: 3,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="div"
              variant="h6"
              fontWeight={600}
              onClick={onClick}
              sx={{
                mb: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                  textDecorationColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              {productName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.price.toFixed(2)} PLN / pcs.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "row", sm: "column" },
              alignItems: { xs: "center", sm: "flex-end" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 0.5,
                bgcolor: "background.paper",
              }}
            >
              <IconButton
                size="small"
                aria-label="decrease quantity"
                disabled={item.quantity <= 1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(-1);
                }}
                sx={{
                  "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
                  "&.Mui-disabled": { opacity: 0.3 },
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <TextField
                value={localQuantity}
                size="small"
                variant="standard"
                onClick={(e) => e.stopPropagation()}
                sx={{
                  width: 50,
                  "& .MuiInput-underline:before": { display: "none" },
                  "& .MuiInput-underline:after": { display: "none" },
                  "& .MuiInputBase-input": {
                    textAlign: "center",
                    py: 0.5,
                    fontWeight: 600,
                  },
                }}
                inputProps={{ style: { textAlign: "center", padding: "4px" } }}
                onChange={handleLocalChange}
                onBlur={handleQuantityOverwrite}
              />
              <IconButton
                size="small"
                aria-label="increase quantity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(1);
                }}
                sx={{
                  "&:hover": { bgcolor: alpha(theme.palette.success.main, 0.1) },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-end" },
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  minWidth: { xs: "auto", sm: 100 },
                  textAlign: { xs: "center", sm: "right" },
                }}
              >
                {(item.price * item.quantity).toFixed(2)} PLN
              </Typography>
              <IconButton
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                sx={{
                  color: "error.main",
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                  },
                  transition: "background-color 0.2s ease",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

const CartPage: React.FC = () => {
  const { cartItems, loading, error } = useCartContext();
  const theme = useTheme();
  const navigate = useNavigate();

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeCartItems.reduce((sum, item) => {
    if (!item || typeof item.price !== "number" || typeof item.quantity !== "number") {
      return sum;
    }
    return sum + item.price * item.quantity;
  }, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    const order = await createOrder({
      items: safeCartItems.map((item) => ({
        itemId: item.id,
        name: item.name,
        variantId: item.id,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.image,
        description: item.name,
        isReturnable: true,
      })),
    });
    const orderId = order.orderId;
    navigate(`/order/${orderId}`);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs items={[{ label: "Your Cart" }]} />
          <Typography variant="h4" gutterBottom>
            Your Cart
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading cart...</Typography>
          </Box>
        )}

        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Products in Cart
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {safeCartItems.length} {safeCartItems.length === 1 ? "product" : "products"}
                </Typography>
              </Box>

              {safeCartItems.length > 0 ? (
                <>
                  {safeCartItems.map((item) => {
                    if (!item || !item.id) return null;
                    return (
                      <CartProductCard
                        key={item.id}
                        item={item}
                        onClick={() => navigate(`/product/${item.id}`)}
                      />
                    );
                  })}

                  {FREE_SHIPPING_THRESHOLD - subtotal > 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 3,
                        p: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: "2px solid",
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <LocalShippingIcon color="primary" sx={{ fontSize: 40 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
                          Free shipping within reach!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Add products worth{" "}
                          <strong>{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} PLN</strong>{" "}
                          more and get free shipping!
                        </Typography>
                      </Box>
                    </Paper>
                  )}

                  {shipping === 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        border: "1px solid",
                        borderColor: "success.main",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <LocalShippingIcon color="success" />
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        Congratulations! You have free shipping!
                      </Typography>
                    </Paper>
                  )}
                </>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: "center",
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                    borderRadius: 3,
                    border: "2px dashed",
                    borderColor: "divider",
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    Your cart is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add products to your cart to continue shopping
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={4}
                sx={{
                  p: 3,
                  position: "sticky",
                  top: 20,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha("#fff", 0.95)} 0%, ${alpha("#f5f5f5", 0.95)} 100%)`,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
                  Summary
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Product value:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {subtotal.toFixed(2)} PLN
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    Shipping cost:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={shipping === 0 ? "success.main" : "text.primary"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    {shipping === 0 && <LocalShippingIcon fontSize="small" />}
                    {shipping === 0 ? "GRATIS" : `${shipping.toFixed(2)} PLN`}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    TOTAL:
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
                  onClick={handleCheckout}
                  disabled={safeCartItems.length === 0}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 3,
                    },
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </MainLayout>
  );
};

export default CartPage;
