import React, { useState } from "react";
import type { VariantSalesOverTimeDTO, LinearRegressionLineDTO } from "../../types/statistics";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Card,
  CardContent,
  Stack,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { format, differenceInDays, parseISO } from "date-fns";
import { pl } from "date-fns/locale/pl";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  salesData: VariantSalesOverTimeDTO | null;
  loading?: boolean;
}

type ChartType = "line" | "area";

// Color palette for regression lines
const REGRESSION_COLORS = [
  "#ff9800", // Orange
  "#9c27b0", // Purple
  "#e91e63", // Pink
  "#f44336", // Red
  "#3f51b5", // Indigo
];

const SalesChart: React.FC<SalesChartProps> = ({ salesData, loading }) => {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [showRegressionLines, setShowRegressionLines] = useState(false);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={120} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={120} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={120} />
          </Box>
        </Stack>
      </Box>
    );
  }

  if (!salesData || salesData.dataPoints.length === 0) {
    return (
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
          Nie znaleziono danych sprzedażowych dla wybranego produktu
        </Typography>
      </Paper>
    );
  }

  // Process data for charts
  const chartData = salesData.dataPoints.map((point) => ({
    date: new Date(point.date).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "short",
    }),
    fullDate: new Date(point.date).toLocaleDateString("pl-PL"),
    quantity: point.quantity,
    revenue: Number(point.totalRevenue),
  }));

  // Calculate KPIs
  const totalQuantity = salesData.dataPoints.reduce((sum, point) => sum + point.quantity, 0);
  const totalRevenue = salesData.dataPoints.reduce(
    (sum, point) => sum + Number(point.totalRevenue),
    0,
  );
  const averagePrice = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;

  // Calculate trend
  const recentSales = salesData.dataPoints.slice(-7);
  const olderSales = salesData.dataPoints.slice(
    Math.max(0, salesData.dataPoints.length - 14),
    Math.max(0, salesData.dataPoints.length - 7),
  );
  const recentAvg = recentSales.reduce((sum, p) => sum + p.quantity, 0) / recentSales.length;
  const olderAvg = olderSales.reduce((sum, p) => sum + p.quantity, 0) / (olderSales.length || 1);
  const trendPercentage = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

  // Calculate regression line points for visualization
  const getRegressionLineData = (
    regression: LinearRegressionLineDTO,
    dataType: "quantity" | "revenue",
  ) => {
    const validFrom = parseISO(regression.validFrom);
    const validTo = parseISO(regression.validTo);

    // Find the reference date (earliest date in the dataset)
    const referenceDate = new Date(salesData.dataPoints[0].date);

    // Calculate y values for the start and end of the regression period
    const calculateY = (date: Date) => {
      const daysSinceReference = differenceInDays(date, referenceDate);
      return regression.slope * daysSinceReference + regression.intercept;
    };

    return [
      {
        date: format(validFrom, "dd MMM", { locale: pl }),
        fullDate: format(validFrom, "dd.MM.yyyy", { locale: pl }),
        [dataType]: calculateY(validFrom),
        timestamp: validFrom.getTime(),
      },
      {
        date: format(validTo, "dd MMM", { locale: pl }),
        fullDate: format(validTo, "dd.MM.yyyy", { locale: pl }),
        [dataType]: calculateY(validTo),
        timestamp: validTo.getTime(),
      },
    ];
  };

  // Custom tooltip

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 1.5,
            bgcolor: "background.paper",
            boxShadow: 3,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            {payload[0].payload.fullDate}
          </Typography>
          {}
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}:{" "}
              <strong>
                {entry.name === "Przychód"
                  ? `${Number(entry.value).toFixed(2)} zł`
                  : `${entry.value} szt.`}
              </strong>
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* KPI Cards */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ShoppingCartIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Całkowita sprzedaż
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {totalQuantity}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                sztuk
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Całkowity przychód
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {totalRevenue.toFixed(2)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                PLN
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Średnia cena
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {averagePrice.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  PLN/szt.
                </Typography>
                {trendPercentage !== 0 && (
                  <Chip
                    label={`${trendPercentage > 0 ? "+" : ""}${trendPercentage.toFixed(1)}%`}
                    size="small"
                    sx={{
                      bgcolor: trendPercentage > 0 ? "success.main" : "error.main",
                      color: "white",
                      fontSize: "0.7rem",
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Chart Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6">{salesData.productName}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {salesData.regressionLines && salesData.regressionLines.length > 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={showRegressionLines}
                  onChange={(e) => setShowRegressionLines(e.target.checked)}
                  size="small"
                />
              }
              label="Pokaż linie regresji"
            />
          )}
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_e, newType) => newType && setChartType(newType)}
            size="small"
          >
            <ToggleButton value="line">Linia</ToggleButton>
            <ToggleButton value="area">Obszar</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* Charts */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Ilość sprzedanych sztuk w czasie
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" style={{ fontSize: "0.85rem" }} />
              <YAxis stroke="#666" style={{ fontSize: "0.85rem" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="quantity"
                name="Ilość"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ fill: "#8884d8", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />

              {/* Regression lines */}
              {showRegressionLines &&
                salesData.regressionLines &&
                salesData.regressionLines.map((regression, index) => {
                  const lineData = getRegressionLineData(regression, "quantity");
                  return (
                    <Line
                      key={`regression-${index}`}
                      data={lineData}
                      type="linear"
                      dataKey="quantity"
                      stroke={REGRESSION_COLORS[index % REGRESSION_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name={`Regresja ${index + 1}`}
                      animationDuration={500}
                    />
                  );
                })}
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" style={{ fontSize: "0.85rem" }} />
              <YAxis stroke="#666" style={{ fontSize: "0.85rem" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="quantity"
                name="Ilość"
                stroke="#8884d8"
                strokeWidth={2}
                fill="url(#colorQuantity)"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />

              {/* Regression lines */}
              {showRegressionLines &&
                salesData.regressionLines &&
                salesData.regressionLines.map((regression, index) => {
                  const lineData = getRegressionLineData(regression, "quantity");
                  return (
                    <Line
                      key={`regression-${index}`}
                      data={lineData}
                      type="linear"
                      dataKey="quantity"
                      stroke={REGRESSION_COLORS[index % REGRESSION_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name={`Regresja ${index + 1}`}
                      animationDuration={500}
                    />
                  );
                })}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Przychód w czasie
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" style={{ fontSize: "0.85rem" }} />
              <YAxis stroke="#666" style={{ fontSize: "0.85rem" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Przychód"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={{ fill: "#82ca9d", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />

              {/* Regression lines */}
              {showRegressionLines &&
                salesData.regressionLines &&
                salesData.regressionLines.map((regression, index) => {
                  const lineData = getRegressionLineData(regression, "revenue");
                  return (
                    <Line
                      key={`regression-revenue-${index}`}
                      data={lineData}
                      type="linear"
                      dataKey="revenue"
                      stroke={REGRESSION_COLORS[index % REGRESSION_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name={`Regresja ${index + 1}`}
                      animationDuration={500}
                    />
                  );
                })}
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" style={{ fontSize: "0.85rem" }} />
              <YAxis stroke="#666" style={{ fontSize: "0.85rem" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Przychód"
                stroke="#82ca9d"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />

              {/* Regression lines */}
              {showRegressionLines &&
                salesData.regressionLines &&
                salesData.regressionLines.map((regression, index) => {
                  const lineData = getRegressionLineData(regression, "revenue");
                  return (
                    <Line
                      key={`regression-revenue-${index}`}
                      data={lineData}
                      type="linear"
                      dataKey="revenue"
                      stroke={REGRESSION_COLORS[index % REGRESSION_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name={`Regresja ${index + 1}`}
                      animationDuration={500}
                    />
                  );
                })}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default SalesChart;
