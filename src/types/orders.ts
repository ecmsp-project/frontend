export interface OrderItemDetails {
  itemId: string;
  quantity: number;
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
    case "PAID":
    case "DELIVERED":
      return "success";

    case "PENDING":
    case "PROCESSING":
    case "SHIPPED":
      return "primary";

    case "RETURN_REQUESTED":
    case "RETURN_PROCESSING":
      return "warning";

    case "FAILED":
    case "CANCELLED":
    case "RETURNED":
      return "error";

    case "UNSPECIFIED":
    default:
      return "default";
  }
};
