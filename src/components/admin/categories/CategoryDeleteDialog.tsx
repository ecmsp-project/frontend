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
          "Wystąpił błąd podczas usuwania kategorii. Endpoint DELETE może nie być jeszcze zaimplementowany na backendzie.",
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
        Usuń kategorię
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Czy na pewno chcesz usunąć kategorię <strong>{category.name}</strong>?
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Informacja:</strong> Podkategorie tej kategorii zostaną przeniesione do
            kategorii nadrzędnej (nie będą usunięte).
          </Typography>
        </Alert>

        {category.parentCategoryName && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Kategoria nadrzędna: <strong>{category.parentCategoryName}</strong>
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <Chip
            label={`${category.subCategoryCount} podkategorii`}
            color={category.subCategoryCount > 0 ? "warning" : "default"}
            size="small"
          />
          <Chip
            label={`${category.productCount} produktów`}
            color={category.productCount > 0 ? "warning" : "default"}
            size="small"
          />
          <Chip
            label={`${category.propertyCount} właściwości`}
            color={category.propertyCount > 0 ? "warning" : "default"}
            size="small"
          />
        </Box>

        {category.subCategoryCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Ta kategoria ma <strong>{category.subCategoryCount}</strong> podkategorii. Zostaną one
              przeniesione do{" "}
              {category.parentCategoryName ? (
                <>
                  kategorii <strong>{category.parentCategoryName}</strong>
                </>
              ) : (
                "poziomu głównego"
              )}
              .
            </Typography>
          </Alert>
        )}

        {category.productCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Ta kategoria zawiera <strong>{category.productCount}</strong> produktów. Upewnij się,
              że usunięcie tej kategorii nie wpłynie negatywnie na te produkty.
            </Typography>
          </Alert>
        )}

        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Uwaga:</strong> Endpoint DELETE może nie być jeszcze w pełni zaimplementowany na
            backendzie. Jeśli usunięcie się nie powiedzie, sprawdź implementację w
            CategoryController.
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
          Anuluj
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? "Usuwanie..." : "Usuń"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDeleteDialog;
