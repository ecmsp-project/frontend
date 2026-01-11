import React from "react";
import Breadcrumbs from "../components/common/Breadcrumbs.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Box, Typography, Container, Card, Button, Divider, alpha, useTheme } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const OrderConfirmationPage: React.FC = () => {
  const { orderId, token } = useParams<{ orderId: string; token: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const finalOrderId = orderId || "N/A";

  if (!token) {
    return (
      <MainLayout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography variant="h5" color="error">
            Invalid order confirmation link.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
            Main page
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs items={[{ label: "Order Confirmation" }]} />
        </Box>

        <Card
          elevation={4}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha("#fff", 0.95)} 100%)`,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 100,
                color: "success.main",
                animation: "scaleIn 0.5s ease-out",
                "@keyframes scaleIn": {
                  "0%": {
                    transform: "scale(0)",
                    opacity: 0,
                  },
                  "100%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
            Thank you for your purchase!
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your order has been successfully placed
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 2,
              mb: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Order Number
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary.main"
              sx={{
                fontFamily: "monospace",
                letterSpacing: 1,
              }}
            >
              {finalOrderId}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Order confirmation has been sent to your email address.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You can track your order status in the "My Orders" section.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingBagIcon />}
              onClick={() => navigate("/orders")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              My Orders
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              Home
            </Button>
          </Box>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default OrderConfirmationPage;
