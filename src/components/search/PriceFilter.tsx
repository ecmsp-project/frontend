import React from "react";
import { Box, Typography, Slider, Menu } from "@mui/material";

interface PriceFilterProps {
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  min?: number;
  max?: number;
  step?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  onPriceRangeChange,
  anchorEl,
  onClose,
  min = 0,
  max = 15_000,
  step = 50,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          p: 2,
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Zakres cen
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => onPriceRangeChange(newValue as number[])}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          step={step}
          valueLabelFormat={(value) => `${value} zł`}
          sx={{
            color: "primary.main",
            "& .MuiSlider-thumb": {
              width: 18,
              height: 18,
            },
            "& .MuiSlider-track": {
              height: 4,
            },
            "& .MuiSlider-rail": {
              height: 4,
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {priceRange[0]} zł
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {priceRange[1]} zł
          </Typography>
        </Box>
      </Box>
    </Menu>
  );
};

export default PriceFilter;
