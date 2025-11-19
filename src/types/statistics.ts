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
  slope: number;
  intercept: number;
  validFrom: string;
  validTo: string;
  estimatedDepletionDate: string | null;
  rSquared: number;
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

// Stock data DTOs
export interface StockDataPointDTO {
  date: string;
  stockLevel: number;
}

export interface StockLevelOverTimeDTO {
  variantId: string;
  productName: string;
  dataPoints: StockDataPointDTO[];
  regressionLines: LinearRegressionLineDTO[];
  trendLine: LinearRegressionLineDTO | null;
}

export interface StockFilters {
  fromDate?: string;
  toDate?: string;
  trendDays?: number;
}

// Date range types
export interface DateRange {
  fromDate: Date | null;
  toDate: Date | null;
}

// Local storage types
export interface RecentlyViewedVariant {
  variantId: string;
  productName: string;
  viewedAt: string;
}
