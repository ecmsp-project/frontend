import React, { useState, useEffect, useCallback } from "react";
import { getVariantSalesOverTime, getVariantStockOverTime } from "../../../api/statistics-service";
import DateRangeSelector from "../../../components/analytics/DateRangeSelector";
import SalesChart from "../../../components/analytics/SalesChart";
import StockChart from "../../../components/analytics/StockChart";
import VariantSearchAutocomplete from "../../../components/analytics/VariantSearchAutocomplete";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import MainLayout from "../../../components/layout/MainLayout";
import type {
  VariantInfoDTO,
  VariantSalesOverTimeDTO,
  StockLevelOverTimeDTO,
  DateRange,
} from "../../../types/statistics";
import BarChartIcon from "@mui/icons-material/BarChart";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Container, Typography, Paper, Box, Alert, Fade, Grow, Tabs, Tab } from "@mui/material";

type TabValue = "sales" | "stock";

const SalesStatisticsPage: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<VariantInfoDTO | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("sales");
  const [salesData, setSalesData] = useState<VariantSalesOverTimeDTO | null>(null);
  const [stockData, setStockData] = useState<StockLevelOverTimeDTO | null>(null);
  const [salesLoading, setSalesLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 90);
    return { fromDate, toDate: today };
  });

  const loadSalesData = useCallback(
    async (variantId: string) => {
      setSalesLoading(true);
      setError(null);
      try {
        const data = await getVariantSalesOverTime(variantId, {
          fromDate: dateRange.fromDate?.toISOString().split("T")[0],
          toDate: dateRange.toDate?.toISOString().split("T")[0],
          trendDays: 30,
        });

        setSalesData(data);
      } catch (err) {
        console.error("Error loading sales data:", err);
        setError("Failed to load sales data. Please check the server connection.");
      } finally {
        setSalesLoading(false);
      }
    },
    [dateRange],
  );

  const loadStockData = useCallback(
    async (variantId: string) => {
      setStockLoading(true);
      setError(null);
      try {
        const data = await getVariantStockOverTime(variantId, {
          fromDate: dateRange.fromDate?.toISOString().split("T")[0],
          toDate: dateRange.toDate?.toISOString().split("T")[0],
          trendDays: 30,
        });

        setStockData(data);
      } catch (err) {
        console.error("Error loading stock data:", err);
        setError("Failed to load stock data. Please check the server connection.");
      } finally {
        setStockLoading(false);
      }
    },
    [dateRange],
  );

  useEffect(() => {
    if (selectedVariant) {
      if (activeTab === "sales") {
        loadSalesData(selectedVariant.variantId);
      } else {
        loadStockData(selectedVariant.variantId);
      }
    } else {
      setSalesData(null);
      setStockData(null);
    }
  }, [selectedVariant, dateRange, activeTab, loadSalesData, loadStockData]);

  const handleVariantSelect = (variant: VariantInfoDTO | null) => {
    setSelectedVariant(variant);
  };

  const handleStockChipClick = () => {
    if (selectedVariant?.hasStockData) {
      setActiveTab("stock");
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          items={[
            { label: "Admin Panel", path: "/admin" },
            { label: "Analytics", path: "/admin/analytics" },
            { label: "Statistics" },
          ]}
        />

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Product Statistics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search for a product to display detailed sales and stock statistics
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 2,
            position: "sticky",
            top: 70,
            zIndex: 10,
            bgcolor: "background.paper",
          }}
        >
          <VariantSearchAutocomplete
            onVariantSelect={handleVariantSelect}
            selectedVariant={selectedVariant}
            onStockChipClick={handleStockChipClick}
          />
        </Paper>

        {selectedVariant && (
          <Fade in>
            <Box sx={{ mb: 3 }}>
              <DateRangeSelector dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
            </Box>
          </Fade>
        )}

        {error && (
          <Fade in>
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </Fade>
        )}

        {selectedVariant ? (
          <Grow in timeout={500}>
            <Box>
              <Paper elevation={2} sx={{ mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab
                    label="Sales"
                    value="sales"
                    icon={<ShoppingCartIcon />}
                    iconPosition="start"
                    disabled={!selectedVariant.hasSalesData}
                  />
                  <Tab
                    label="Stock level"
                    value="stock"
                    icon={<InventoryIcon />}
                    iconPosition="start"
                    disabled={!selectedVariant.hasStockData}
                  />
                </Tabs>
              </Paper>

              {activeTab === "sales" ? (
                <Fade in key="sales">
                  <Box>
                    {selectedVariant.hasSalesData ? (
                      <SalesChart salesData={salesData} loading={salesLoading} />
                    ) : (
                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          bgcolor: "background.default",
                          border: "2px dashed",
                          borderColor: "divider",
                        }}
                      >
                        <ShoppingCartIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No sales data
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This product doesn't have any sales data yet
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Fade>
              ) : (
                <Fade in key="stock">
                  <Box>
                    {selectedVariant.hasStockData ? (
                      <StockChart stockData={stockData} loading={stockLoading} />
                    ) : (
                      <Paper
                        sx={{
                          p: 4,
                          textAlign: "center",
                          bgcolor: "background.default",
                          border: "2px dashed",
                          borderColor: "divider",
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No stock data
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This product doesn't have any stock data yet
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Fade>
              )}
            </Box>
          </Grow>
        ) : (
          <Fade in>
            <Paper
              sx={{
                p: 8,
                textAlign: "center",
                bgcolor: "background.default",
                border: "2px dashed",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.1,
                  }}
                >
                  <BarChartIcon sx={{ fontSize: 60, color: "primary.main" }} />
                </Box>
              </Box>
              <Typography variant="h5" gutterBottom color="text.secondary">
                Start by searching for a product
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Use the search above to find a product and display its statistics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can filter products, sort results and use recently viewed history
              </Typography>
            </Paper>
          </Fade>
        )}
      </Container>
    </MainLayout>
  );
};

export default SalesStatisticsPage;
