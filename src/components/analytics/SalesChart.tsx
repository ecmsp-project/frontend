import React, { useState } from "react";
import type { VariantSalesOverTimeDTO } from "../../types/statistics";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalculateIcon from "@mui/icons-material/Calculate";
import ClearIcon from "@mui/icons-material/Clear";
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
  Button,
  Alert,
  Grow,
  Divider,
} from "@mui/material";
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

interface SalesChartProps {
  salesData: VariantSalesOverTimeDTO | null;
  loading?: boolean;
}

type ChartType = "line" | "area";

const SalesChart: React.FC<SalesChartProps> = ({ salesData, loading }) => {
  const [chartType, setChartType] = useState<ChartType>("area");

  // Integration mode state
  const [integrationMode, setIntegrationMode] = useState(false);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [integrationResult, setIntegrationResult] = useState<{
    quantity: number;
    revenue: number;
    days: number;
  } | null>(null);

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
          No sales data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No sales data found for the selected product
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
    const totalQuantity = selectedData.reduce((sum, d) => sum + d.quantity, 0);
    const totalRevenue = selectedData.reduce((sum, d) => sum + d.revenue, 0);
    const days = selectedData.length;

    setIntegrationResult({
      quantity: totalQuantity,
      revenue: totalRevenue,
      days: days,
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
                {entry.name === "Revenue"
                  ? `${Number(entry.value).toFixed(2)} PLN`
                  : `${entry.value} pcs.`}
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
                  Total Sales
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {totalQuantity}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                units
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
                  Total Revenue
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
                  Average Price
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {averagePrice.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  PLN/unit
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
          Click and drag on the chart to select a period for integration calculation
        </Alert>
      )}

      {/* Integration Result */}
      {integrationResult && (
        <Grow in timeout={500}>
          <Paper
            sx={{
              p: 3,
              mb: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              📊 Integration Results ({integrationResult.days} days)
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
                    <ShoppingCartIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Units Sold
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {integrationResult.quantity} pcs.
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
                    <AttachMoneyIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Revenue
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {integrationResult.revenue.toFixed(2)} PLN
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
                      Daily Average (Quantity)
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {(integrationResult.quantity / integrationResult.days).toFixed(1)} pcs./day
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
                    <AttachMoneyIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Daily Average (Revenue)
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {(integrationResult.revenue / integrationResult.days).toFixed(2)} PLN/day
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Paper>
        </Grow>
      )}

      {/* Charts */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Quantity Sold Over Time
        </Typography>
        <ResponsiveContainer
          width="100%"
          height={300}
          style={{
            userSelect: isSelecting ? "none" : "auto",
            cursor: integrationMode ? "crosshair" : "default",
          }}
        >
          {chartType === "line" ? (
            <LineChart
              data={chartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
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

              {refAreaLeft && refAreaRight && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              )}

              <Line
                type="monotone"
                dataKey="quantity"
                name="Quantity"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ fill: "#8884d8", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          ) : (
            <AreaChart
              data={chartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
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

              {refAreaLeft && refAreaRight && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              )}

              <Area
                type="monotone"
                dataKey="quantity"
                name="Quantity"
                stroke="#8884d8"
                strokeWidth={2}
                fill="url(#colorQuantity)"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Revenue Over Time
        </Typography>
        <ResponsiveContainer
          width="100%"
          height={300}
          style={{
            userSelect: isSelecting ? "none" : "auto",
            cursor: integrationMode ? "crosshair" : "default",
          }}
        >
          {chartType === "line" ? (
            <LineChart
              data={chartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
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

              {refAreaLeft && refAreaRight && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              )}

              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={{ fill: "#82ca9d", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          ) : (
            <AreaChart
              data={chartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
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

              {refAreaLeft && refAreaRight && (
                <ReferenceArea
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              )}

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#82ca9d"
                strokeWidth={2}
                fill="url(#colorRevenue)"
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

export default SalesChart;
