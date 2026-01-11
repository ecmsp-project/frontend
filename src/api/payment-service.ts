import { API_BASE_URL, apiCall } from "./utils";

export const getPaymentLink = async (orderId: string): Promise<string> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/payment/order/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get payment link: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.paymentLink;
  } catch (error) {
    console.error("API Error getting payment link:", error);
    throw error;
  }
};

export const processPayment = async (paymentLink: string): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/payment/${paymentLink}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to process payment: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error processing payment:", error);
    throw error;
  }
};
