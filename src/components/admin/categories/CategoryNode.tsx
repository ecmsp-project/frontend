import React from "react";
import type { CategoryNodeData } from "../../../types/category";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FolderOpen as FolderIcon,
} from "@mui/icons-material";
import { Box, Typography, IconButton, Chip, Stack } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

const CategoryNode: React.FC<NodeProps> = ({ data }) => {
  const { category, onAddLeaf, onDelete } = data as CategoryNodeData;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: 2,
        borderColor: "primary.main",
        borderRadius: 2,
        p: 2,
        minWidth: 220,
        boxShadow: 3,
        "&:hover": {
          boxShadow: 6,
          borderColor: "primary.dark",
        },
      }}
    >
      {/* Top handle for incoming edges */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "#1976d2",
          width: 12,
          height: 12,
        }}
      />

      {/* Node content */}
      <Stack spacing={1.5}>
        {/* Header with icon and name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FolderIcon color="primary" />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {category.name}
          </Typography>
        </Box>

        {/* Stats */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={`${category.subCategoryCount} podkat.`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`${category.productCount} prod.`}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Stack>

        {/* Parent info */}
        {category.parentCategoryName && (
          <Typography variant="caption" color="text.secondary" noWrap>
            Rodzic: {category.parentCategoryName}
          </Typography>
        )}

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onAddLeaf(category.id)}
            title="Dodaj podkategorię"
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={onDelete} title="Usuń kategorię">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Stack>

      {/* Bottom handle for outgoing edges */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#1976d2",
          width: 12,
          height: 12,
        }}
      />
    </Box>
  );
};

export default CategoryNode;
