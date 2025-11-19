import React, { useState } from "react";
import { Box, Stack, Typography, Paper, Chip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { pl } from "date-fns/locale/pl";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { DateRange } from "../../types/statistics";

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

type Preset = "7d" | "30d" | "90d" | "1y" | "all";

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const [activePreset, setActivePreset] = useState<Preset | null>("90d");

  const applyPreset = (preset: Preset) => {
    const today = new Date();
    let fromDate: Date;

    switch (preset) {
      case "7d":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        break;
      case "30d":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 30);
        break;
      case "90d":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 90);
        break;
      case "1y":
        fromDate = new Date(today);
        fromDate.setFullYear(today.getFullYear() - 1);
        break;
      case "all":
        fromDate = new Date(today);
        fromDate.setFullYear(today.getFullYear() - 10); // 10 years ago
        break;
    }

    setActivePreset(preset);
    onDateRangeChange({ fromDate, toDate: today });
  };

  const handleFromDateChange = (date: Date | null) => {
    setActivePreset(null); // Clear preset when manual date selected
    onDateRangeChange({ ...dateRange, fromDate: date });
  };

  const handleToDateChange = (date: Date | null) => {
    setActivePreset(null); // Clear preset when manual date selected
    onDateRangeChange({ ...dateRange, toDate: date });
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
        <Stack spacing={2}>
          {/* Header */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
          >
            <CalendarTodayIcon color="action" />
            <Typography variant="subtitle1" fontWeight="medium">
              Zakres dat
            </Typography>
          </Box>

          {/* Date Pickers */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <DatePicker
              label="Data od"
              value={dateRange.fromDate}
              onChange={handleFromDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
            <DatePicker
              label="Data do"
              value={dateRange.toDate}
              onChange={handleToDateChange}
              minDate={dateRange.fromDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </Stack>

          {/* Preset Buttons */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Szybki wybór:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label="7 dni"
                onClick={() => applyPreset("7d")}
                color={activePreset === "7d" ? "primary" : "default"}
                variant={activePreset === "7d" ? "filled" : "outlined"}
                size="small"
                clickable
              />
              <Chip
                label="30 dni"
                onClick={() => applyPreset("30d")}
                color={activePreset === "30d" ? "primary" : "default"}
                variant={activePreset === "30d" ? "filled" : "outlined"}
                size="small"
                clickable
              />
              <Chip
                label="90 dni"
                onClick={() => applyPreset("90d")}
                color={activePreset === "90d" ? "primary" : "default"}
                variant={activePreset === "90d" ? "filled" : "outlined"}
                size="small"
                clickable
              />
              <Chip
                label="Rok"
                onClick={() => applyPreset("1y")}
                color={activePreset === "1y" ? "primary" : "default"}
                variant={activePreset === "1y" ? "filled" : "outlined"}
                size="small"
                clickable
              />
              <Chip
                label="Wszystko"
                onClick={() => applyPreset("all")}
                color={activePreset === "all" ? "primary" : "default"}
                variant={activePreset === "all" ? "filled" : "outlined"}
                size="small"
                clickable
              />
            </Stack>
          </Box>
        </Stack>
      </LocalizationProvider>
    </Paper>
  );
};

export default DateRangeSelector;
