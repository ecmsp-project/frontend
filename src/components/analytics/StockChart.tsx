import React, { useState } from "react";
import type { StockLevelOverTimeDTO, LinearRegressionLineDTO } from "../../types/statistics";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
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
  Chip,
  Alert,
  AlertTitle,
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
  ReferenceLine,
} from "recharts";

interface StockChartProps {
  stockData: StockLevelOverTimeDTO | null;
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

const TREND_LINE_COLOR = "#4caf50"; // Green

const StockChart: React.FC<StockChartProps> = ({ stockData, loading }) => {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [showRegressionLines, setShowRegressionLines] = useState(true);

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
          Brak danych magazynowych
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nie znaleziono danych o stanie magazynowym dla wybranego produktu
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

  // Calculate regression line points for visualization
  const getRegressionLineData = (regression: LinearRegressionLineDTO) => {
    const validFrom = parseISO(regression.validFrom);
    const validTo = parseISO(regression.validTo);

    // Find the reference date (earliest date in the dataset)
    const referenceDate = parseISO(stockData.dataPoints[0].date);

    // Calculate y values for the start and end of the regression period
    const calculateY = (date: Date) => {
      const daysSinceReference = differenceInDays(date, referenceDate);
      return regression.slope * daysSinceReference + regression.intercept;
    };

    return [
      {
        date: format(validFrom, "dd MMM", { locale: pl }),
        fullDate: format(validFrom, "dd.MM.yyyy", { locale: pl }),
        stockLevel: calculateY(validFrom),
        timestamp: validFrom.getTime(),
      },
      {
        date: format(validTo, "dd MMM", { locale: pl }),
        fullDate: format(validTo, "dd.MM.yyyy", { locale: pl }),
        stockLevel: calculateY(validTo),
        timestamp: validTo.getTime(),
      },
    ];
  };

  // Extend chart domain to include depletion date if needed
  let extendedChartData = chartData;
  if (depletionDate && showRegressionLines) {
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
              Stan magazynowy: <strong>{entry.value} szt.</strong>
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
              ? "Krytyczny stan magazynowy!"
              : daysToDepletion && daysToDepletion < 30
                ? "Niski stan magazynowy"
                : "Informacja o stanie magazynowym"}
          </AlertTitle>
          Szacowana data wyczerpania produktu:{" "}
          <strong>{format(depletionDate, "dd MMMM yyyy", { locale: pl })}</strong>
          {daysToDepletion !== null && (
            <>
              {" "}
              (za <strong>{daysToDepletion}</strong> {daysToDepletion === 1 ? "dzień" : "dni"})
            </>
          )}
          <br />
          <Typography variant="caption">
            Predykcja oparta na aktualnym trendzie (R² = {rSquared.toFixed(3)})
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
                  Aktualny stan
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {currentStock}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                sztuk w magazynie
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
                  Średnia zmiana dzienna
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {averageDailyChange.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                szt./dzień
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
                  Jakość predykcji (R²)
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {(rSquared * 100).toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {rSquared > 0.9 ? "Bardzo dobra" : rSquared > 0.7 ? "Dobra" : "Umiarkowana"}
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
                    Do wyczerpania
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
        <Typography variant="h6">{stockData.productName} - Stan magazynowy</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
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

      {/* Stock Level Chart */}
      <Paper sx={{ p: 2 }}>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === "line" ? (
            <LineChart data={extendedChartData}>
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

              {/* Main stock line */}
              <Line
                type="monotone"
                dataKey="stockLevel"
                name="Stan magazynowy"
                stroke="#2196f3"
                strokeWidth={3}
                dot={{ fill: "#2196f3", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />

              {/* Regression lines */}
              {showRegressionLines &&
                stockData.regressionLines.map((regression, index) => {
                  const lineData = getRegressionLineData(regression);
                  return (
                    <Line
                      key={`regression-${index}`}
                      data={lineData}
                      type="linear"
                      dataKey="stockLevel"
                      stroke={REGRESSION_COLORS[index % REGRESSION_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name={`Regresja ${index + 1}`}
                      animationDuration={500}
                    />
                  );
                })}

              {/* Trend line */}
              {showRegressionLines &&
                stockData.trendLine &&
                (() => {
                  const trendData = getRegressionLineData(stockData.trendLine);
                  return (
                    <Line
                      data={trendData}
                      type="linear"
                      dataKey="stockLevel"
                      stroke={TREND_LINE_COLOR}
                      strokeWidth={3}
                      dot={false}
                      strokeDasharray="10 5"
                      name="Trend (ostatnie dni)"
                      animationDuration={500}
                    />
                  );
                })()}

              {/* Depletion date reference line */}
              {depletionDate && showRegressionLines && (
                <ReferenceLine
                  x={format(depletionDate, "dd MMM", { locale: pl })}
                  stroke="red"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: "⚠️ Wyczerpanie",
                    position: "top",
                    fill: "red",
                    fontSize: 12,
                  }}
                  ifOverflow="extendDomain"
                />
              )}
            </LineChart>
          ) : (
            <AreaChart data={extendedChartData}>
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

              {/* Main stock area */}
              <Area
                type="monotone"
                dataKey="stockLevel"
                name="Stan magazynowy"
                stroke="#2196f3"
                strokeWidth={2}
                fill="url(#colorStock)"
                animationDuration={1000}
                animationEasing="ease-in-out"
              />

              {/* Regression lines */}
              {showRegressionLines &&
                stockData.regressionLines.map((regression, index) => {
                  const lineData = getRegressionLineData(regression);
                  return (
                    <Line
                      key={`regression-${index}`}
                      data={lineData}
                      type="linear"
                      dataKey="stockLevel"
                      stroke={REGRESSION_COLORS[index % REGRESSION_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 5"
                      name={`Regresja ${index + 1}`}
                      animationDuration={500}
                    />
                  );
                })}

              {/* Trend line */}
              {showRegressionLines &&
                stockData.trendLine &&
                (() => {
                  const trendData = getRegressionLineData(stockData.trendLine);
                  return (
                    <Line
                      data={trendData}
                      type="linear"
                      dataKey="stockLevel"
                      stroke={TREND_LINE_COLOR}
                      strokeWidth={3}
                      dot={false}
                      strokeDasharray="10 5"
                      name="Trend (ostatnie dni)"
                      animationDuration={500}
                    />
                  );
                })()}

              {/* Depletion date reference line */}
              {depletionDate && showRegressionLines && (
                <ReferenceLine
                  x={format(depletionDate, "dd MMM", { locale: pl })}
                  stroke="red"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: "⚠️ Wyczerpanie",
                    position: "top",
                    fill: "red",
                    fontSize: 12,
                  }}
                  ifOverflow="extendDomain"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Paper>

      {/* Regression Lines Legend */}
      {showRegressionLines && (stockData.regressionLines.length > 0 || stockData.trendLine) && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: "background.default" }}>
          <Typography variant="subtitle2" gutterBottom>
            Linie regresji liniowej:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {stockData.regressionLines.map((regression, index) => (
              <Chip
                key={`chip-${index}`}
                label={`Okres ${format(parseISO(regression.validFrom), "dd.MM")} - ${format(parseISO(regression.validTo), "dd.MM")} (R²=${regression.rSquared.toFixed(2)})`}
                size="small"
                sx={{
                  borderLeft: "4px solid",
                  borderColor: REGRESSION_COLORS[index % REGRESSION_COLORS.length],
                }}
              />
            ))}
            {stockData.trendLine && (
              <Chip
                label={`Trend ostatnie dni (R²=${stockData.trendLine.rSquared.toFixed(2)})`}
                size="small"
                sx={{
                  borderLeft: "4px solid",
                  borderColor: TREND_LINE_COLOR,
                  fontWeight: "bold",
                }}
              />
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default StockChart;
