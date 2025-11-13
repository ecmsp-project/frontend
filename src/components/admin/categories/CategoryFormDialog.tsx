import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { CategoryCreationMode } from "../../../types/category";

interface CategoryFormDialogProps {
  open: boolean;
  mode: CategoryCreationMode;
  parentCategoryName?: string;
  childCategoryName?: string;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Nazwa kategorii jest wymagana")
    .max(255, "Nazwa nie może być dłuższa niż 255 znaków")
    .trim(),
});

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  mode,
  parentCategoryName,
  childCategoryName,
  onClose,
  onSubmit,
}) => {
  const [error, setError] = useState<string | null>(null);

  const getDialogTitle = () => {
    switch (mode) {
      case "LEAF":
        return parentCategoryName
          ? `Dodaj podkategorię do "${parentCategoryName}"`
          : "Dodaj kategorię główną";
      case "SPLIT":
        return "Dodaj kategorię między węzłami";
      case "SPLIT_ALL":
        return "Dodaj kategorię i przesuń wszystkie podkategorie";
      default:
        return "Dodaj kategorię";
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case "LEAF":
        return parentCategoryName
          ? `Nowa kategoria zostanie dodana jako podkategoria kategorii "${parentCategoryName}".`
          : "Nowa kategoria zostanie dodana jako kategoria główna (bez rodzica).";
      case "SPLIT":
        return `Nowa kategoria zostanie wstawiona między "${parentCategoryName}" a "${childCategoryName}". Kategoria "${childCategoryName}" stanie się podkategorią nowej kategorii.`;
      case "SPLIT_ALL":
        return `Nowa kategoria zostanie wstawiona między "${parentCategoryName}" a wszystkimi jej podkategoriami. Wszystkie obecne podkategorie kategorii "${parentCategoryName}" staną się podkategoriami nowej kategorii.`;
      default:
        return "";
    }
  };

  const handleSubmit = async (values: { name: string }, { setSubmitting }: any) => {
    try {
      setError(null);
      await onSubmit(values.name.trim());
      // onClose will be called by parent after successful submit
    } catch (err: any) {
      console.error("Error submitting category:", err);
      setError(err?.message || "Wystąpił błąd podczas tworzenia kategorii");
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {getDialogDescription()}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                name="name"
                label="Nazwa kategorii"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                autoFocus
                disabled={isSubmitting}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} disabled={isSubmitting}>
                Anuluj
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Tworzenie..." : "Dodaj"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CategoryFormDialog;
