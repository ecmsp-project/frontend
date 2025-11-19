import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Alert,
  Fade,
  Grow,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminLayout from "../../../components/layout/AdminLayout";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import VariantSearchAutocomplete from "../../../components/analytics/VariantSearchAutocomplete";
import SalesChart from "../../../components/analytics/SalesChart";
import type { VariantInfoDTO, VariantSalesOverTimeDTO } from "../../../types/statistics";
import { getVariantSalesOverTime } from "../../../api/statistics-service";

const SalesStatisticsPage: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<VariantInfoDTO | null>(
    null,
  );
  const [salesData, setSalesData] = useState<VariantSalesOverTimeDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sales data when variant is selected
  useEffect(() => {
    if (selectedVariant) {
      loadSalesData(selectedVariant.variantId);
    } else {
      setSalesData(null);
    }
  }, [selectedVariant]);

  const loadSalesData = async (variantId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Get sales data for last 90 days with 30-day trend
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 90);

      const data = await getVariantSalesOverTime(variantId, {
        fromDate: fromDate.toISOString().split("T")[0],
        toDate: toDate.toISOString().split("T")[0],
        trendDays: 30,
      });

      setSalesData(data);
    } catch (err) {
      console.error("Error loading sales data:", err);
      setError(
        "Nie udało się załadować danych sprzedażowych. Sprawdź połączenie z serwerem.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variant: VariantInfoDTO | null) => {
    setSelectedVariant(variant);
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Panel administracyjny", path: "/admin" },
            { label: "Analytics", path: "/admin/analytics" },
            { label: "Statystyki Sprzedaży" },
          ]}
        />

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <BarChartIcon fontSize="large" />
            Statystyki Sprzedaży
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Wyszukaj produkt, aby wyświetlić szczegółowe statystyki sprzedaży,
            przychody i trendy
          </Typography>
        </Box>

        {/* Search Section - Sticky */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            position: "sticky",
            top: 70,
            zIndex: 10,
            bgcolor: "background.paper",
          }}
        >
          <VariantSearchAutocomplete
            onVariantSelect={handleVariantSelect}
            selectedVariant={selectedVariant}
          />
        </Paper>

        {/* Error Alert */}
        {error && (
          <Fade in>
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Charts Section */}
        {selectedVariant ? (
          <Grow in timeout={500}>
            <Box>
              <SalesChart salesData={salesData} loading={loading} />
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
                Użyj wyszukiwarki powyżej, aby znaleźć produkt i wyświetlić jego
                statystyki sprzedaży
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Możesz filtrować produkty, sortować wyniki i korzystać z historii
                ostatnio przeglądanych
              </Typography>
            </Paper>
          </Fade>
        )}
      </Container>
    </AdminLayout>
  );
};

export default SalesStatisticsPage;
