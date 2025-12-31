import React from "react";
import type { CategoryFromAPI } from "../../types/cms";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Button, Chip } from "@mui/material";

interface SearchFiltersProps {
  categoryId: string | null;
  categories: CategoryFromAPI[];
  priceRange: number[];
  onSortMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onCategoryMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onPriceMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onCategoryChipDelete?: () => void;
  onPriceChipDelete?: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  categoryId,
  categories,
  priceRange,
  onSortMenuOpen,
  onCategoryMenuOpen,
  onPriceMenuOpen,
  onCategoryChipDelete,
  onPriceChipDelete,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 2,
      }}
    >
      <Button
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        onClick={onSortMenuOpen}
        sx={{
          textTransform: "none",
          borderColor: "divider",
          color: "text.primary",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
      >
        Sort
      </Button>

      <Button
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        onClick={onCategoryMenuOpen}
        sx={{
          textTransform: "none",
          borderColor: "divider",
          color: "text.primary",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
      >
        Category
        {categoryId && (
          <Chip
            label={categories.find((c) => c.id === categoryId)?.name}
            size="small"
            onDelete={onCategoryChipDelete}
            sx={{ ml: 1, height: 20 }}
          />
        )}
      </Button>

      <Button
        variant="outlined"
        endIcon={<ArrowDropDownIcon />}
        onClick={onPriceMenuOpen}
        sx={{
          textTransform: "none",
          borderColor: "divider",
          color: "text.primary",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
      >
        Price
        {(priceRange[0] > 0 || priceRange[1] < 15_000) && (
          <Chip
            label={`${priceRange[0]}-${priceRange[1]} PLN`}
            size="small"
            onDelete={onPriceChipDelete}
            sx={{ ml: 1, height: 20 }}
          />
        )}
      </Button>
    </Box>
  );
};

export default SearchFilters;
