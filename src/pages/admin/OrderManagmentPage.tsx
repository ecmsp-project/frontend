import React, { useEffect, useState } from "react";
import { fetchAllOrders } from "../../api/order-service";
import Breadcrumbs from "../../components/common/Breadcrumbs";
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
  } else {
    content = (
      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="orders management table">
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell />
              <TableCell>Order ID</TableCell>
              <TableCell>Client ID</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <OrderRow key={order.orderId} order={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          items={[
            { label: "Admin Panel", path: "/admin" },
            { label: "Order Management" },
          ]}
        />
        <Typography variant="h4" gutterBottom>
          Order Management
        </Typography>
        {content}
      </Container>
    </MainLayout>
  );
};

export default OrderManagementPage;
