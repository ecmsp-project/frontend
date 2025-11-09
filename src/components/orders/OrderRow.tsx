import React, { useState } from "react";
import {
  getStatusColor,
  type OrderDetailsResponse,
  type OrderItemDetails,
} from "../../types/orders.ts";
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

const OrderRow: React.FC<{ order: OrderDetailsResponse }> = ({ order }) => {
  const [open, setOpen] = useState(false);

  const getMockItemName = (itemId: string) => `Produkt #${itemId.substring(0, 8)}`;

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {order.orderId.substring(0, 16)}...
        </TableCell>
        <TableCell align="right">{formatDate(order.date)}</TableCell>
        <TableCell align="right">
          <Chip
            label={order.orderStatus}
            size="small"
            color={getStatusColor(order.orderStatus)}
            sx={{ textTransform: "uppercase", fontWeight: 600 }}
          />
        </TableCell>
        <TableCell align="right">
          {order.items.reduce((sum, item) => sum + item.quantity * 100, 0).toFixed(2)} zł
        </TableCell>
        <TableCell align="right">
          <Button variant="outlined" size="small">
            Faktura
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom component="div" fontWeight={600}>
                Szczegóły Produktów ({order.items.length})
              </Typography>
              <List dense>
                {order.items.map((item: OrderItemDetails) => (
                  <ListItem key={item.itemId} disablePadding>
                    <ListItemText
                      primary={`${getMockItemName(item.itemId)}`}
                      secondary={`ID: ${item.itemId.substring(0, 8)}...`}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      Ilość: {item.quantity}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default OrderRow;
