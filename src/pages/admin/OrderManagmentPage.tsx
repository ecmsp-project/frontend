import React, { useEffect, useState } from "react";
import { fetchAllOrders } from "../../api/order-service";
import MainLayout from "../../components/layout/MainLayout";
import { OrderRow } from "../../components/orders/OrderRow";
import { type OrderDetailsResponse } from "../../types/orders";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetailsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await fetchAllOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  } else if (error) {
    return (
      <Alert severity="error" sx={{ my: 3 }}>
        {error}
      </Alert>
    );
  } else {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Zarządzanie Zamówieniami
          </Typography>

          <TableContainer component={Paper} elevation={3}>
            <Table aria-label="orders management table">
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell />
                  <TableCell>ID Zamówienia</TableCell>
                  <TableCell>ID Klienta</TableCell>
                  <TableCell align="right">Data</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Łączna kwota</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <OrderRow key={order.orderId} order={order} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </MainLayout>
    );
  }
};

export default OrderManagementPage;
