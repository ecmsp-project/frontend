// Statistics Service DTOs

export interface VariantInfoDTO {
  variantId: string;
  productId: string;
  productName: string;
  hasSalesData: boolean;
  hasStockData: boolean;
  lastSaleDate: string | null;
  currentStock: number | null;
}

export interface SalesDataPointDTO {
  date: string;
  quantity: number;
  totalRevenue: number;
}

export interface LinearRegressionLineDTO {
  startDate: string;
  endDate: string;
  startValue: number;
  endValue: number;
  slope: number;
  intercept: number;
}

export interface VariantSalesOverTimeDTO {
  variantId: string;
  productName: string;
  dataPoints: SalesDataPointDTO[];
  regressionLines: LinearRegressionLineDTO[];
}

export interface SalesFilters {
  fromDate?: string;
  toDate?: string;
  trendDays?: number;
}

// Local storage types
export interface RecentlyViewedVariant {
  variantId: string;
  productName: string;
  viewedAt: string;
}
