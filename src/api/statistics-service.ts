import type {
  VariantInfoDTO,
  VariantSalesOverTimeDTO,
  SalesFilters,
  StockLevelOverTimeDTO,
  StockFilters,
} from "../types/statistics";
import { apiCall } from "./utils";

const STATISTICS_SERVICE_URL = "http://localhost:8700";
const STATISTICS_API = `${STATISTICS_SERVICE_URL}/api/statistics`;

export const getAvailableVariants = async (): Promise<VariantInfoDTO[]> => {
  const response = await apiCall(`${STATISTICS_API}/variants`);
  return await response.json();
};

export const getVariantSalesOverTime = async (
  variantId: string,
  filters?: SalesFilters,
): Promise<VariantSalesOverTimeDTO> => {
  const params = new URLSearchParams();

  if (filters?.fromDate) {
    params.append("fromDate", filters.fromDate);
  }
  if (filters?.toDate) {
    params.append("toDate", filters.toDate);
  }
  if (filters?.trendDays !== undefined) {
    params.append("trendDays", filters.trendDays.toString());
  }

  const url = `${STATISTICS_API}/variants/${variantId}/sales${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await apiCall(url);
  return await response.json();
};

export const getVariantStockOverTime = async (
  variantId: string,
  filters?: StockFilters,
): Promise<StockLevelOverTimeDTO> => {
  const params = new URLSearchParams();

  if (filters?.fromDate) {
    params.append("fromDate", filters.fromDate);
  }
  if (filters?.toDate) {
    params.append("toDate", filters.toDate);
  }
  if (filters?.trendDays !== undefined) {
    params.append("trendDays", filters.trendDays.toString());
  }

  const url = `${STATISTICS_API}/variants/${variantId}/stock${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await apiCall(url);
  return await response.json();
};
