import { useState } from "react";
import { type OrderDetailsResponse, type OrderItemDetails } from "../../types/orders.ts";
import { getStatusColor, getStatusLabel } from "../../types/orders.ts";
import { formatDate } from "../../utils/string.ts";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

const calculateTotalPrice = (items: OrderItemDetails[]): number => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
};

interface OrderRowProps {
  order: OrderDetailsResponse;
  hideUserId?: boolean;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, hideUserId }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.orderId}</TableCell>
        {!hideUserId && <TableCell>{order.clientId}</TableCell>}
        <TableCell align="right">{formatDate(order.date)}</TableCell>
        <TableCell align="center">
          <Chip
            label={getStatusLabel(order.orderStatus)}
            size="small"
            color={getStatusColor(order.orderStatus)}
            sx={{ textTransform: "uppercase", fontWeight: 600 }}
          />
        </TableCell>
        <TableCell align="right">{calculateTotalPrice(order.items).toFixed(2)} zł</TableCell>
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
                  <strong>Liczba produktów:</strong> {order.items.length}
                </Typography>
              </Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Produkty ({order.items.length})
              </Typography>
              <List dense>
                {order.items.map((item) => {
                  return (
                    <ListItem key={item.itemId}>
                      <ListItemText
                        primary={`ID Produktu: ${item.itemId} | ID Wariantu ${item.variantId}`}
                        secondary={`Cena: ${item.price} zł | Możliwość zwrotu: ${item.isReturnable ? "Tak" : "Nie"} | Ilość: ${item.quantity}`}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        Opis: {item.description}
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
                {getStatusColor(order.orderStatus) === "error" && (
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
