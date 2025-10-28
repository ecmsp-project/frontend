import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getStatusColor, type OrderDetailsResponse } from "../../types/orders";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";

interface OrderItemDetailsDto {
  itemId: string;
  productName: string;
  quantity: number;
  price: number;
  isReturnable: boolean;
}

interface GetOrderResponseDto extends OrderDetailsResponse {
  clientName?: string;
  clientEmail?: string;
}

const MOCK_ORDERS: GetOrderResponseDto[] = [
  {
    orderId: "order-001",
    clientId: "user-001",
    clientName: "Jan Kowalski",
    clientEmail: "jan.kowalski@example.com",
    orderStatus: "PAID",
    date: "2025-01-15T10:30:00Z",
    items: [
      {
        itemId: "item-001",
        quantity: 2,
      },
      {
        itemId: "item-002",
        quantity: 1,
      },
    ],
  },
  {
    orderId: "order-002",
    clientId: "user-002",
    clientName: "Anna Nowak",
    clientEmail: "anna.nowak@example.com",
    orderStatus: "SHIPPED",
    date: "2025-01-14T14:20:00Z",
    items: [
      {
        itemId: "item-003",
        quantity: 3,
      },
    ],
  },
  {
    orderId: "order-003",
    clientId: "user-003",
    clientName: "Piotr Wiśniewski",
    clientEmail: "piotr.wisniewski@example.com",
    orderStatus: "DELIVERED",
    date: "2025-01-10T09:15:00Z",
    items: [
      {
        itemId: "item-001",
        quantity: 1,
      },
      {
        itemId: "item-004",
        quantity: 2,
      },
    ],
  },
  {
    orderId: "order-004",
    clientId: "user-004",
    clientName: "Maria Zielińska",
    clientEmail: "maria.zielinska@example.com",
    orderStatus: "PENDING",
    date: "2025-01-16T16:45:00Z",
    items: [
      {
        itemId: "item-005",
        quantity: 1,
      },
    ],
  },
  {
    orderId: "order-005",
    clientId: "user-005",
    clientName: "Tomasz Wójcik",
    clientEmail: "tomasz.wojcik@example.com",
    orderStatus: "RETURN_REQUESTED",
    date: "2025-01-12T11:30:00Z",
    items: [
      {
        itemId: "item-006",
        quantity: 1,
      },
    ],
  },
];

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "RETURN_REQUESTED",
  "RETURN_PROCESSING",
  "RETURNED",
  "CANCELLED",
  "FAILED",
];

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const calculateTotalPrice = (items: { quantity: number }[]): number => {
  return items.reduce((sum, item) => sum + item.quantity * 99.99, 0);
};

interface ExpandableOrderRowProps {
  order: GetOrderResponseDto;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const ExpandableOrderRow: React.FC<ExpandableOrderRowProps> = ({ order, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(order.orderStatus);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value;
    setLocalStatus(newStatus);
    onStatusChange(order.orderId, newStatus);
  };

  const getMockItemDetails = (itemId: string): OrderItemDetailsDto => {
    const mockDetails: Record<string, OrderItemDetailsDto> = {
      "item-001": {
        itemId: "item-001",
        productName: "Produkt A - Czerwony",
        quantity: 2,
        price: 99.99,
        isReturnable: true,
      },
      "item-002": {
        itemId: "item-002",
        productName: "Produkt B - Niebieski",
        quantity: 1,
        price: 149.99,
        isReturnable: true,
      },
      "item-003": {
        itemId: "item-003",
        productName: "Produkt C - Zielony",
        quantity: 3,
        price: 79.99,
        isReturnable: true,
      },
      "item-004": {
        itemId: "item-004",
        productName: "Produkt D - Czarny",
        quantity: 2,
        price: 199.99,
        isReturnable: false,
      },
      "item-005": {
        itemId: "item-005",
        productName: "Produkt E - Biały",
        quantity: 1,
        price: 89.99,
        isReturnable: true,
      },
      "item-006": {
        itemId: "item-006",
        productName: "Produkt F - Szary",
        quantity: 1,
        price: 119.99,
        isReturnable: true,
      },
    };
    return (
      mockDetails[itemId] || {
        itemId,
        productName: `Produkt #${itemId.substring(0, 8)}`,
        quantity: 1,
        price: 99.99,
        isReturnable: true,
      }
    );
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.orderId}</TableCell>
        <TableCell>{order.clientName || "Nieznany"}</TableCell>
        <TableCell>{order.clientEmail || "brak"}</TableCell>
        <TableCell align="right">{formatDate(order.date)}</TableCell>
        <TableCell>
          <Select
            value={localStatus}
            onChange={handleStatusChange}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {ORDER_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </TableCell>
        <TableCell align="right">{calculateTotalPrice(order.items).toFixed(2)} zł</TableCell>
        <TableCell align="right">
          <Chip
            label={localStatus}
            size="small"
            color={getStatusColor(localStatus)}
            sx={{ textTransform: "uppercase", fontWeight: 600 }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, p: 2, borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom component="div" fontWeight={600}>
                Szczegóły Zamówienia
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>ID Klienta:</strong> {order.clientId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>E-mail:</strong> {order.clientEmail || "brak"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Liczba produktów:</strong> {order.items.length}
                </Typography>
              </Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Produkty ({order.items.length})
              </Typography>
              <List dense>
                {order.items.map((item) => {
                  const details = getMockItemDetails(item.itemId);
                  return (
                    <ListItem key={item.itemId}>
                      <ListItemText
                        primary={details.productName}
                        secondary={`ID: ${item.itemId} | Cena: ${details.price} zł | Status zwrotu: ${details.isReturnable ? "Możliwy" : "Niemożliwy"}`}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Ilość: {item.quantity}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                <Typography variant="h6" fontWeight={600}>
                  Suma: {calculateTotalPrice(order.items).toFixed(2)} zł
                </Typography>
              </Box>
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button variant="outlined" size="small">
                  Wygeneruj Fakturę
                </Button>
                <Button variant="outlined" size="small" color="info">
                  Szczegóły Śledzenia
                </Button>
                {getStatusColor(localStatus) === "error" && (
                  <Button variant="outlined" size="small" color="warning">
                    Zarządzaj Zwrotem
                  </Button>
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<GetOrderResponseDto[]>(MOCK_ORDERS);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, orderStatus: newStatus } : order,
      ),
    );
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Zarządzanie Zamówieniami
        </Typography>

        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="orders management table">
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell />
                <TableCell>ID Zamówienia</TableCell>
                <TableCell>Klient</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell align="right">Data</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Wartość</TableCell>
                <TableCell align="center">Status Wizualny</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <ExpandableOrderRow
                  key={order.orderId}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </AdminLayout>
  );
};

export default OrderManagementPage;
