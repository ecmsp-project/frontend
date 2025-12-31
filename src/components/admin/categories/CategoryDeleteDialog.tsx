import React, { useState } from "react";
import type { CategoryFromAPI } from "../../../types/cms";
import { Warning as WarningIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Chip,
} from "@mui/material";

interface CategoryDeleteDialogProps {
  open: boolean;
  category?: CategoryFromAPI;
  onClose: () => void;
  onConfirm: (categoryId: string) => Promise<void>;
  container?: () => HTMLElement;
}

const CategoryDeleteDialog: React.FC<CategoryDeleteDialogProps> = ({
  open,
  category,
  onClose,
  onConfirm,
  container,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!category) return;

    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm(category.id);
      // onClose will be called by parent after successful deletion
    } catch (err: any) {
      console.error("Error deleting category:", err);
      setError(
        err?.message ||
          "An error occurred while deleting the category. The DELETE endpoint may not be implemented yet on the backend.",
      );
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth container={container}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningIcon color="warning" />
        Delete Category
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete the category <strong>{category.name}</strong>?
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Information:</strong> Subcategories of this category will be moved to the parent
            category (they will not be deleted).
          </Typography>
        </Alert>

        {category.parentCategoryName && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Parent category: <strong>{category.parentCategoryName}</strong>
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <Chip
            label={`${category.subCategoryCount} subcategories`}
            color={category.subCategoryCount > 0 ? "warning" : "default"}
            size="small"
          />
          <Chip
            label={`${category.productCount} products`}
            color={category.productCount > 0 ? "warning" : "default"}
            size="small"
          />
          <Chip
            label={`${category.propertyCount} properties`}
            color={category.propertyCount > 0 ? "warning" : "default"}
            size="small"
          />
        </Box>

        {category.subCategoryCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              This category has <strong>{category.subCategoryCount}</strong> subcategories. They
              will be moved to{" "}
              {category.parentCategoryName ? (
                <>
                  category <strong>{category.parentCategoryName}</strong>
                </>
              ) : (
                "root level"
              )}
              .
            </Typography>
          </Alert>
        )}

        {category.productCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              This category contains <strong>{category.productCount}</strong> products. Make sure
              that deleting this category will not negatively affect these products.
            </Typography>
          </Alert>
        )}

        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Note:</strong> The DELETE endpoint may not be fully implemented yet on the
            backend. If deletion fails, check the implementation in CategoryController.
          </Typography>
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDeleteDialog;
