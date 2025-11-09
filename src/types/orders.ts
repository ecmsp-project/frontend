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

type StatusColor = "default" | "primary" | "secondary" | "error" | "success" | "warning";

export const getStatusColor = (status: string): StatusColor => {
  switch (status) {
    case "ORDER_STATUS_PAID":
    case "ORDER_STATUS_DELIVERED":
      return "success";

    case "ORDER_STATUS_PENDING":
    case "ORDER_STATUS_PROCESSING":
    case "ORDER_STATUS_SHIPPED":
      return "primary";

    case "ORDER_STATUS_RETURN_REQUESTED":
    case "ORDER_STATUS_RETURN_PROCESSING":
      return "warning";

    case "ORDER_STATUS_FAILED":
    case "ORDER_STATUS_CANCELLED":
    case "ORDER_STATUS_RETURNED":
      return "error";

    case "ORDER_STATUS_UNSPECIFIED":
    default:
      return "default";
  }
};
