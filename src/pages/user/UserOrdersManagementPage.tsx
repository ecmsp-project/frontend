import React, { useEffect, useState } from "react";
import { fetchUserOrders } from "../../api/order-service";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import { OrderRow } from "../../components/orders/OrderRow";
import { type OrderDetailsResponse } from "../../types/orders";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserOrdersManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetailsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await fetchUserOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać zamówień");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  let content;

  if (loading) {
    content = (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  } else if (error) {
    content = (
      <Alert severity="error" sx={{ my: 3 }}>
        {error}
      </Alert>
    );
  } else if (orders.length === 0) {
    content = (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Brak złożonych zamówień.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Rozpocznij zakupy
        </Button>
      </Box>
    );
  } else {
    content = (
      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="user orders table">
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell />
              <TableCell>ID Zamówienia</TableCell>
              <TableCell align="right">Data</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Łączna kwota</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <OrderRow key={order.orderId} order={order} hideUserId={true} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs items={[{ label: "Panel użytkownika" }, { label: "Moje zamówienia" }]} />
        <Typography variant="h4" gutterBottom>
          Moje zamówienia
        </Typography>
        {content}
      </Container>
    </MainLayout>
  );
};

export default UserOrdersManagementPage;
