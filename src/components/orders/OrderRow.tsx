import { useState } from "react";
import { type OrderDetailsResponse, type OrderItemDetails } from "../../types/orders.ts";
import { getStatusColor, getStatusLabel } from "../../types/orders.ts";
import { formatDate } from "../../utils/string.ts";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const calculateTotalPrice = (items: OrderItemDetails[]): number => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
};

interface OrderDetailsHeaderProps {
  order: OrderDetailsResponse;
}

const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({ order }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
        Order Details
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            Client ID
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {order.clientId}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            Number of Products
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {order.items.length}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

interface OrderItemRowProps {
  item: OrderItemDetails;
  index: number;
}

const OrderItemRow: React.FC<OrderItemRowProps> = ({ item, index }) => {
  return (
    <Box>
      <ListItem
        sx={{
          bgcolor: "background.paper",
          borderRadius: 1,
          mb: 1,
          py: 1.5,
          px: 2,
        }}
      >
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                Product #{index + 1}
              </Typography>
              <Chip
                label={`${item.quantity}x`}
                size="small"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
              {item.isReturnable && (
                <Chip
                  label="Returnable"
                  size="small"
                  color="success"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              )}
            </Box>
          }
          secondary={
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                <strong>Product ID:</strong> {item.itemId}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                <strong>Variant ID:</strong> {item.variantId}
              </Typography>
              {item.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  <strong>Description:</strong> {item.description}
                </Typography>
              )}
            </Box>
          }
        />
        <Box sx={{ textAlign: "right", ml: 2 }}>
          <Typography variant="body2" fontWeight={600} color="primary">
            {(item.price * item.quantity).toFixed(2)} PLN
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.price.toFixed(2)} PLN / pcs.
          </Typography>
        </Box>
      </ListItem>
    </Box>
  );
};

interface OrderItemsListProps {
  order: OrderDetailsResponse;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ order }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
        Products ({order.items.length})
      </Typography>
      <List disablePadding>
        {order.items.map((item, index) => (
          <OrderItemRow key={item.itemId} item={item} index={index} />
        ))}
      </List>
    </Box>
  );
};

interface OrderSummaryProps {
  totalPrice: number;
  orderStatus: string;
  orderId: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice, orderStatus, orderId }) => {
  const navigate = useNavigate();
  const isPending = orderStatus === "ORDER_STATUS_PENDING";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Total Amount
        </Typography>
        <Typography variant="h6" fontWeight={700} color="primary">
          {totalPrice.toFixed(2)} PLN
        </Typography>
      </Box>
      {isPending && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<PaymentIcon />}
          onClick={() => navigate(`/payment/${orderId}`)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Pay Now
        </Button>
      )}
    </Box>
  );
};

interface OrderDetailsProps {
  order: OrderDetailsResponse;
  totalPrice: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, totalPrice }) => {
  return (
    <Box sx={{ margin: 2 }}>
      <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <OrderDetailsHeader order={order} />
        <Divider sx={{ my: 3 }} />
        <OrderItemsList order={order} />
        <Divider sx={{ my: 3 }} />
        <OrderSummary
          totalPrice={totalPrice}
          orderStatus={order.orderStatus}
          orderId={order.orderId}
        />
      </Paper>
    </Box>
  );
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
        <TableCell align="right">{calculateTotalPrice(order.items).toFixed(2)} PLN</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <OrderDetails order={order} totalPrice={calculateTotalPrice(order.items)} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
