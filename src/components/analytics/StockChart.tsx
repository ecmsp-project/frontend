import React, { useState } from "react";
import type { StockLevelOverTimeDTO } from "../../types/statistics";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalculateIcon from "@mui/icons-material/Calculate";
import ClearIcon from "@mui/icons-material/Clear";
import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
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
  Alert,
  AlertTitle,
  Button,
  Grow,
  Divider,
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
  ReferenceArea,
} from "recharts";

interface StockChartProps {
  stockData: StockLevelOverTimeDTO | null;
  loading?: boolean;
}

type ChartType = "line" | "area";

const StockChart: React.FC<StockChartProps> = ({ stockData, loading }) => {
  const [chartType, setChartType] = useState<ChartType>("area");

  // Integration mode state
  const [integrationMode, setIntegrationMode] = useState(false);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [integrationResult, setIntegrationResult] = useState<{
    averageStock: number;
    minStock: number;
    maxStock: number;
    days: number;
  } | null>(null);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={120} />
          </Box>
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
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (!stockData || stockData.dataPoints.length === 0) {
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
        <InventoryIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No stock data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No stock information found for the selected product.
        </Typography>
      </Paper>
    );
  }

  // Process data for charts
  const chartData = stockData.dataPoints.map((point) => ({
    date: format(parseISO(point.date), "dd MMM", { locale: pl }),
    fullDate: format(parseISO(point.date), "dd.MM.yyyy", { locale: pl }),
    stockLevel: point.stockLevel,
    timestamp: parseISO(point.date).getTime(),
  }));

  // Integration mode handlers
  const handleMouseDown = (e: any) => {
    if (integrationMode && e && e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setRefAreaRight(null);
      setIntegrationResult(null);
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: any) => {
    if (integrationMode && isSelecting && refAreaLeft && e && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (
      integrationMode &&
      isSelecting &&
      refAreaLeft &&
      refAreaRight &&
      refAreaLeft !== refAreaRight
    ) {
      calculateIntegration();
    }
    setIsSelecting(false);
  };

  const calculateIntegration = () => {
    if (!refAreaLeft || !refAreaRight) return;

    const leftIndex = chartData.findIndex((d) => d.date === refAreaLeft);
    const rightIndex = chartData.findIndex((d) => d.date === refAreaRight);

    const startIndex = Math.min(leftIndex, rightIndex);
    const endIndex = Math.max(leftIndex, rightIndex);

    if (startIndex === -1 || endIndex === -1) return;

    const selectedData = chartData.slice(startIndex, endIndex + 1);
    const stockLevels = selectedData.map((d) => d.stockLevel);
    const averageStock = stockLevels.reduce((sum, level) => sum + level, 0) / stockLevels.length;
    const minStock = Math.min(...stockLevels);
    const maxStock = Math.max(...stockLevels);
    const days = selectedData.length;

    setIntegrationResult({
      averageStock,
      minStock,
      maxStock,
      days,
    });
  };

  const clearIntegration = () => {
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIntegrationResult(null);
    setIsSelecting(false);
  };

  const toggleIntegrationMode = () => {
    setIntegrationMode(!integrationMode);
    clearIntegration();
  };

  // Calculate KPIs
  const currentStock = stockData.dataPoints[stockData.dataPoints.length - 1]?.stockLevel || 0;

  // Average daily change from trend line
  const averageDailyChange = stockData.trendLine?.slope || 0;

  // R-squared from trend line
  const rSquared = stockData.trendLine?.rSquared || 0;

  // Depletion info from trend line
  const depletionDate = stockData.trendLine?.estimatedDepletionDate
    ? parseISO(stockData.trendLine.estimatedDepletionDate)
    : null;

  const daysToDepletion = depletionDate ? differenceInDays(depletionDate, new Date()) : null;

  // Determine alert severity based on days to depletion
  const getAlertSeverity = () => {
    if (!daysToDepletion) return "info";
    if (daysToDepletion < 14) return "error";
    if (daysToDepletion < 30) return "warning";
    return "info";
  };

  // Extend chart domain to include depletion date if needed
  let extendedChartData = chartData;
  if (depletionDate) {
    const lastDataPoint = chartData[chartData.length - 1];
    const lastTimestamp = lastDataPoint.timestamp;
    const depletionTimestamp = depletionDate.getTime();

    // If depletion date is beyond current data, add a point at depletion
    if (depletionTimestamp > lastTimestamp) {
      extendedChartData = [
        ...chartData,
        {
          date: format(depletionDate, "dd MMM", { locale: pl }),
          fullDate: format(depletionDate, "dd.MM.yyyy", { locale: pl }),
          stockLevel: 0,
          timestamp: depletionTimestamp,
        },
      ];
    }
  }

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
              Stock level: <strong>{entry.value} units</strong>
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Alert Banner */}
      {depletionDate && (
        <Alert severity={getAlertSeverity()} sx={{ mb: 3 }} icon={<WarningIcon />}>
          <AlertTitle>
            {daysToDepletion && daysToDepletion < 14
              ? "Critical stock level!"
              : daysToDepletion && daysToDepletion < 30
                ? "Low stock level"
                : "Information about stock level"}
          </AlertTitle>
          Estimated depletion date:{" "}
          <strong>{format(depletionDate, "dd MMMM yyyy", { locale: pl })}</strong>
          {daysToDepletion !== null && (
            <>
              {" "}
              (in <strong>{daysToDepletion}</strong> {daysToDepletion === 1 ? "day" : "days"})
            </>
          )}
          <br />
          <Typography variant="caption">
            Prediction based on current trend (R² = {rSquared.toFixed(3)})
          </Typography>
        </Alert>
      )}

      {/* KPI Cards */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <InventoryIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Current Stock
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {currentStock}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                units in stock
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background:
                averageDailyChange < 0
                  ? "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
                  : "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingDownIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Average Daily Change
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {averageDailyChange.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                units/day
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Prediction Quality (R²)
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {(rSquared * 100).toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {rSquared > 0.9 ? "Very Good" : rSquared > 0.7 ? "Good" : "Moderate"}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {daysToDepletion !== null && (
          <Box sx={{ flex: 1 }}>
            <Card
              sx={{
                background:
                  daysToDepletion < 14
                    ? "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)"
                    : daysToDepletion < 30
                      ? "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
                      : "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                color: "white",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <WarningIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Until Depletion
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {daysToDepletion}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {format(depletionDate!, "dd.MM.yyyy")}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
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
        <Typography variant="h6">{stockData.productName} - Stock Level</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant={integrationMode ? "contained" : "outlined"}
            size="small"
            startIcon={integrationMode ? <ClearIcon /> : <CalculateIcon />}
            onClick={toggleIntegrationMode}
            color={integrationMode ? "secondary" : "primary"}
          >
            {integrationMode ? "Cancel Integration" : "Integration"}
          </Button>
          {integrationMode && refAreaLeft && refAreaRight && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearIntegration}
            >
              Clear Selection
            </Button>
          )}
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_e, newType) => newType && setChartType(newType)}
            size="small"
          >
            <ToggleButton value="line">Line</ToggleButton>
            <ToggleButton value="area">Area</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* Integration Instructions */}
      {integrationMode && !integrationResult && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Click and drag on the chart to select a period for statistics calculation
        </Alert>
      )}

      {/* Integration Result */}
      {integrationResult && (
        <Grow in timeout={500}>
          <Paper
            sx={{
              p: 3,
              mb: 2,
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              color: "white",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              📊 Statistics for Selected Period ({integrationResult.days} days)
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
                />
              }
            >
              <Card
                sx={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <InventoryIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Average Stock
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {integrationResult.averageStock.toFixed(1)} units
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <TrendingDownIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Minimum stock
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {integrationResult.minStock} units
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <TrendingUpIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Maximum stock
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {integrationResult.maxStock} units
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Paper>
        </Grow>
      )}

      {/* Stock Level Chart */}
      <Paper sx={{ p: 2 }}>
        <ResponsiveContainer
          width="100%"
          height={400}
          style={{
            userSelect: isSelecting ? "none" : "auto",
            cursor: integrationMode ? "crosshair" : "default",
          }}
        >
          {chartType === "line" ? (
            <LineChart
              data={extendedChartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2196f3" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" style={{ fontSize: "0.85rem" }} />
              <YAxis stroke="#666" style={{ fontSize: "0.85rem" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {refAreaLeft && refAreaRight && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill="#2196f3"
                  fillOpacity={0.3}
                />
              )}

              {/* Main stock line */}
              <Line
                type="monotone"
                dataKey="stockLevel"
                name="Stock level"
                stroke="#2196f3"
                strokeWidth={3}
                dot={{ fill: "#2196f3", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          ) : (
            <AreaChart
              data={extendedChartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2196f3" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" style={{ fontSize: "0.85rem" }} />
              <YAxis stroke="#666" style={{ fontSize: "0.85rem" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {refAreaLeft && refAreaRight && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill="#2196f3"
                  fillOpacity={0.3}
                />
              )}

              {/* Main stock area */}
              <Area
                type="monotone"
                dataKey="stockLevel"
                name="Stock level"
                stroke="#2196f3"
                strokeWidth={2}
                fill="url(#colorStock)"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default StockChart;
