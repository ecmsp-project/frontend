import React from "react";
import { Menu, MenuItem } from "@mui/material";

export type SortOption = "price-asc" | "price-desc";

interface SortFilterProps {
  sortBy: SortOption;
  onSortChange: (sortOption: SortOption) => void;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ sortBy, onSortChange, anchorEl, onClose }) => {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem
        selected={sortBy === "price-asc"}
        onClick={() => {
          onSortChange("price-asc");
          onClose();
        }}
      >
        Price: Lowest First
      </MenuItem>
      <MenuItem
        selected={sortBy === "price-desc"}
        onClick={() => {
          onSortChange("price-desc");
          onClose();
        }}
      >
        Price: Highest First
      </MenuItem>
    </Menu>
  );
};

export default SortFilter;
