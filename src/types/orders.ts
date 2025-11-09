export interface OrderItemDetails {
  itemId: string;
  variantId: string;
  quantity: number;
  price: number;
  imageUrl: string;
  description: string;
  isReturnable: boolean;
}

export interface OrderDetailsResponse {
  orderId: string;
  clientId: string;
  orderStatus: string;
  date: string;
  items: OrderItemDetails[];
}

export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status as OrderStatus] || status;
};

export const getStatusColor = (status: string): StatusColor => {
  return STATUS_COLORS[status as OrderStatus] || "default";
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return status in STATUS_LABELS;
};

export type OrderStatus =
  | "ORDER_STATUS_PAID"
  | "ORDER_STATUS_DELIVERED"
  | "ORDER_STATUS_PENDING"
  | "ORDER_STATUS_PROCESSING"
  | "ORDER_STATUS_SHIPPED"
  | "ORDER_STATUS_RETURN_REQUESTED"
  | "ORDER_STATUS_RETURN_PROCESSING"
  | "ORDER_STATUS_FAILED"
  | "ORDER_STATUS_CANCELLED"
  | "ORDER_STATUS_RETURNED"
  | "ORDER_STATUS_UNSPECIFIED";

const STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_STATUS_PAID: "Opłacone",
  ORDER_STATUS_DELIVERED: "Dostarczone",
  ORDER_STATUS_PENDING: "Oczekujące",
  ORDER_STATUS_PROCESSING: "W trakcie realizacji",
  ORDER_STATUS_SHIPPED: "Wysłane",
  ORDER_STATUS_RETURN_REQUESTED: "Zwrot zgłoszony",
  ORDER_STATUS_RETURN_PROCESSING: "Zwrot w trakcie",
  ORDER_STATUS_FAILED: "Nieudane",
  ORDER_STATUS_CANCELLED: "Anulowane",
  ORDER_STATUS_RETURNED: "Zwrócone",
  ORDER_STATUS_UNSPECIFIED: "Nieokreślone",
};

export type StatusColor = "default" | "primary" | "secondary" | "error" | "success" | "warning";

const STATUS_COLORS: Record<OrderStatus, StatusColor> = {
  ORDER_STATUS_PAID: "success",
  ORDER_STATUS_DELIVERED: "success",
  ORDER_STATUS_PENDING: "primary",
  ORDER_STATUS_PROCESSING: "primary",
  ORDER_STATUS_SHIPPED: "primary",
  ORDER_STATUS_RETURN_REQUESTED: "warning",
  ORDER_STATUS_RETURN_PROCESSING: "warning",
  ORDER_STATUS_FAILED: "error",
  ORDER_STATUS_CANCELLED: "error",
  ORDER_STATUS_RETURNED: "error",
  ORDER_STATUS_UNSPECIFIED: "default",
};
