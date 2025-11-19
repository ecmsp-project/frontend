import React, { useState, useEffect, useMemo } from "react";
import { getAvailableVariants } from "../../api/statistics-service";
import type { VariantInfoDTO, RecentlyViewedVariant } from "../../types/statistics";
import HistoryIcon from "@mui/icons-material/History";
import InventoryIcon from "@mui/icons-material/Inventory";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SortIcon from "@mui/icons-material/Sort";
import {
  Autocomplete,
  TextField,
  Box,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from "@mui/material";

interface VariantSearchAutocompleteProps {
  onVariantSelect: (variant: VariantInfoDTO | null) => void;
  selectedVariant: VariantInfoDTO | null;
  onStockChipClick?: () => void;
}

type FilterType = "all" | "sales" | "stock";
type SortType = "name" | "lastSale" | "stock";

const RECENT_VARIANTS_KEY = "recentlyViewedVariants";
const MAX_RECENT_ITEMS = 5;

const VariantSearchAutocomplete: React.FC<VariantSearchAutocompleteProps> = ({
  onVariantSelect,
  selectedVariant,
  onStockChipClick,
}) => {
  const [variants, setVariants] = useState<VariantInfoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("name");
  const [recentVariants, setRecentVariants] = useState<RecentlyViewedVariant[]>([]);

  // Load variants on mount
  useEffect(() => {
    loadVariants();
    loadRecentVariants();
  }, []);

  const loadVariants = async () => {
    setLoading(true);
    try {
      const data = await getAvailableVariants();
      setVariants(data);
    } catch (error) {
      console.error("Error loading variants:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentVariants = () => {
    try {
      const stored = localStorage.getItem(RECENT_VARIANTS_KEY);
      if (stored) {
        setRecentVariants(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recent variants:", error);
    }
  };

  const saveRecentVariant = (variant: VariantInfoDTO) => {
    try {
      const newRecent: RecentlyViewedVariant = {
        variantId: variant.variantId,
        productName: variant.productName,
        viewedAt: new Date().toISOString(),
      };

      const updated = [
        newRecent,
        ...recentVariants.filter((r) => r.variantId !== variant.variantId),
      ].slice(0, MAX_RECENT_ITEMS);

      localStorage.setItem(RECENT_VARIANTS_KEY, JSON.stringify(updated));
      setRecentVariants(updated);
    } catch (error) {
      console.error("Error saving recent variant:", error);
    }
  };

  // Filter variants based on selected filter
  const filteredVariants = useMemo(() => {
    let filtered = [...variants];

    // Apply filter
    if (filter === "sales") {
      filtered = filtered.filter((v) => v.hasSalesData);
    } else if (filter === "stock") {
      filtered = filtered.filter((v) => v.hasStockData);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.productName.localeCompare(b.productName);
        case "lastSale":
          if (!a.lastSaleDate) return 1;
          if (!b.lastSaleDate) return -1;
          return new Date(b.lastSaleDate).getTime() - new Date(a.lastSaleDate).getTime();
        case "stock":
          return (b.currentStock || 0) - (a.currentStock || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [variants, filter, sortBy]);

  const handleVariantChange = (_event: React.SyntheticEvent, value: VariantInfoDTO | null) => {
    onVariantSelect(value);
    if (value) {
      saveRecentVariant(value);
    }
  };

  const handleRecentClick = (recentVariantId: string) => {
    const variant = variants.find((v) => v.variantId === recentVariantId);
    if (variant) {
      onVariantSelect(variant);
    }
  };

  const getProductInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Filter and Sort Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        {/* Filter Chips */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flex: 1 }}>
          <Chip
            label="Wszystkie"
            icon={<InventoryIcon />}
            onClick={() => setFilter("all")}
            color={filter === "all" ? "primary" : "default"}
            variant={filter === "all" ? "filled" : "outlined"}
          />
          <Chip
            label="Ze sprzedażą"
            icon={<ShoppingCartIcon />}
            onClick={() => setFilter("sales")}
            color={filter === "sales" ? "primary" : "default"}
            variant={filter === "sales" ? "filled" : "outlined"}
          />
          <Chip
            label="Z danymi magazynowymi"
            icon={<InventoryIcon />}
            onClick={() => setFilter("stock")}
            color={filter === "stock" ? "primary" : "default"}
            variant={filter === "stock" ? "filled" : "outlined"}
          />
        </Box>

        {/* Sort Toggle */}
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={(_e, newSort) => newSort && setSortBy(newSort)}
          size="small"
        >
          <ToggleButton value="name">
            <SortIcon sx={{ mr: 0.5 }} fontSize="small" />
            Nazwa
          </ToggleButton>
          <ToggleButton value="lastSale">Ostatnia sprzedaż</ToggleButton>
          <ToggleButton value="stock">Stan</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Autocomplete */}
      <Autocomplete
        value={selectedVariant}
        onChange={handleVariantChange}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
        options={filteredVariants}
        getOptionLabel={(option) => option.productName}
        loading={loading}
        loadingText="Ładowanie produktów..."
        noOptionsText="Nie znaleziono produktów"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Wyszukaj produkt / wariant"
            placeholder="Zacznij pisać nazwę produktu..."
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box component="li" key={key} {...otherProps}>
              <Avatar
                sx={{
                  mr: 2,
                  bgcolor: option.hasSalesData ? "primary.main" : "grey.400",
                }}
              >
                {getProductInitials(option.productName)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1">{option.productName}</Typography>
                <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                  {option.hasSalesData && (
                    <Chip label="Sprzedaż" size="small" color="success" variant="outlined" />
                  )}
                  {option.hasStockData && (
                    <Chip
                      label={`Magazyn: ${option.currentStock || 0}`}
                      size="small"
                      color="info"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStockChipClick?.();
                      }}
                      sx={{
                        cursor: onStockChipClick ? "pointer" : "default",
                        "&:hover": onStockChipClick
                          ? {
                              bgcolor: "info.main",
                              color: "info.contrastText",
                            }
                          : {},
                      }}
                    />
                  )}
                  {option.lastSaleDate && (
                    <Chip
                      label={`Ostatnia: ${new Date(option.lastSaleDate).toLocaleDateString()}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          );
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            paddingLeft: 1,
          },
        }}
      />

      {/* Recently Viewed */}
      {recentVariants.length > 0 && !selectedVariant && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <HistoryIcon sx={{ fontSize: 16, mr: 0.5 }} />
            Ostatnio przeglądane
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {recentVariants.map((recent) => (
              <Chip
                key={recent.variantId}
                label={recent.productName}
                onClick={() => handleRecentClick(recent.variantId)}
                variant="outlined"
                size="small"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VariantSearchAutocomplete;
