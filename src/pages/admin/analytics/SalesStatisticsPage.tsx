import React, { useState, useEffect } from "react";
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

  // Date range state - default to last 90 days
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 90);
    return { fromDate, toDate: today };
  });

  // Load data when variant or date range changes
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
  }, [selectedVariant, dateRange, activeTab]);

  const loadSalesData = async (variantId: string) => {
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
      setError("Nie udało się załadować danych sprzedażowych. Sprawdź połączenie z serwerem.");
    } finally {
      setSalesLoading(false);
    }
  };

  const loadStockData = async (variantId: string) => {
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
      setError("Nie udało się załadować danych magazynowych. Sprawdź połączenie z serwerem.");
    } finally {
      setStockLoading(false);
    }
  };

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
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Panel administracyjny", path: "/admin" },
            { label: "Analytics", path: "/admin/analytics" },
            { label: "Statystyki" },
          ]}
        />

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Statystyki produktów
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Wyszukaj produkt, aby wyświetlić szczegółowe statystyki sprzedaży i stanów magazynowych
          </Typography>
        </Box>

        {/* Search Section - Sticky */}
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

        {/* Date Range Selector */}
        {selectedVariant && (
          <Fade in>
            <Box sx={{ mb: 3 }}>
              <DateRangeSelector dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
            </Box>
          </Fade>
        )}

        {/* Error Alert */}
        {error && (
          <Fade in>
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Tabs and Charts Section */}
        {selectedVariant ? (
          <Grow in timeout={500}>
            <Box>
              {/* Tabs */}
              <Paper elevation={2} sx={{ mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab
                    label="Sprzedaż"
                    value="sales"
                    icon={<ShoppingCartIcon />}
                    iconPosition="start"
                    disabled={!selectedVariant.hasSalesData}
                  />
                  <Tab
                    label="Stan magazynowy"
                    value="stock"
                    icon={<InventoryIcon />}
                    iconPosition="start"
                    disabled={!selectedVariant.hasStockData}
                  />
                </Tabs>
              </Paper>

              {/* Chart Content */}
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
                          Brak danych sprzedażowych
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ten produkt nie ma jeszcze żadnych danych sprzedażowych
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
                          Brak danych magazynowych
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ten produkt nie ma jeszcze żadnych danych magazynowych
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Fade>
              )}
            </Box>
          </Grow>
        ) : (
          /* Empty State */
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
                Zacznij od wyszukania produktu
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Użyj wyszukiwarki powyżej, aby znaleźć produkt i wyświetlić jego statystyki
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Możesz filtrować produkty, sortować wyniki i korzystać z historii ostatnio
                przeglądanych
              </Typography>
            </Paper>
          </Fade>
        )}
      </Container>
    </MainLayout>
  );
};

export default SalesStatisticsPage;
