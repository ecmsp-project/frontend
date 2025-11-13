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
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import {
  Category as CategoryIcon,
  ArrowDownward as ArrowDownIcon,
  AddCircleOutline as AddIcon,
  FolderSpecial as RootIcon,
} from "@mui/icons-material";
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
  container?: () => HTMLElement;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Nazwa kategorii jest wymagana")
    .max(255, "Nazwa nie może być dłuższa niż 255 znaków")
    .trim(),
});

// Component to visualize category hierarchy
const CategoryHierarchyVisualizer: React.FC<{
  mode: CategoryCreationMode;
  parentCategoryName?: string;
  childCategoryName?: string;
}> = ({ mode, parentCategoryName, childCategoryName }) => {
  const CategoryBox: React.FC<{
    name: string;
    role: "parent" | "new" | "child" | "root";
    icon: React.ReactNode;
  }> = ({ name, role, icon }) => {
    const colors = {
      parent: { bg: "#e3f2fd", border: "#1976d2", text: "#1565c0" },
      new: { bg: "#e8f5e9", border: "#4caf50", text: "#2e7d32" },
      child: { bg: "#fff3e0", border: "#ff9800", text: "#e65100" },
      root: { bg: "#f3e5f5", border: "#9c27b0", text: "#7b1fa2" },
    };

    const color = colors[role];

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: 2,
          borderColor: color.border,
          bgcolor: color.bg,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 3,
            transform: "translateY(-2px)",
          },
        }}
      >
        <Box sx={{ color: color.text }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: color.text }}>
            {name}
          </Typography>
          <Chip
            label={
              role === "parent"
                ? "Rodzic"
                : role === "new"
                  ? "Nowa kategoria"
                  : role === "child"
                    ? "Dziecko"
                    : "Kategoria główna"
            }
            size="small"
            sx={{
              mt: 0.5,
              bgcolor: color.border,
              color: "white",
              fontWeight: 500,
              fontSize: "0.7rem",
            }}
          />
        </Box>
      </Paper>
    );
  };

  const Arrow = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        my: 1,
      }}
    >
      <ArrowDownIcon sx={{ fontSize: 32, color: "primary.main" }} />
    </Box>
  );

  if (mode === "LEAF" && !parentCategoryName) {
    return (
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}>
          Struktura hierarchii:
        </Typography>
        <CategoryBox name="[Nowa kategoria]" role="root" icon={<RootIcon />} />
        <Alert severity="info" sx={{ mt: 2 }}>
          Kategoria zostanie dodana jako kategoria główna (bez rodzica)
        </Alert>
      </Box>
    );
  }

  if (mode === "LEAF" && parentCategoryName) {
    return (
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}>
          Struktura hierarchii:
        </Typography>
        <CategoryBox name={parentCategoryName} role="parent" icon={<CategoryIcon />} />
        <Arrow />
        <CategoryBox name="[Nowa kategoria]" role="new" icon={<AddIcon />} />
        <Alert severity="success" sx={{ mt: 2 }}>
          Nowa kategoria będzie podkategorią kategorii <strong>{parentCategoryName}</strong>
        </Alert>
      </Box>
    );
  }

  if (mode === "SPLIT" && parentCategoryName && childCategoryName) {
    return (
      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}>
          Struktura hierarchii:
        </Typography>
        <CategoryBox name={parentCategoryName} role="parent" icon={<CategoryIcon />} />
        <Arrow />
        <CategoryBox name="[Nowa kategoria]" role="new" icon={<AddIcon />} />
        <Arrow />
        <CategoryBox name={childCategoryName} role="child" icon={<CategoryIcon />} />
        <Alert severity="warning" sx={{ mt: 2 }}>
          Nowa kategoria zostanie wstawiona między <strong>{parentCategoryName}</strong> a{" "}
          <strong>{childCategoryName}</strong>
        </Alert>
      </Box>
    );
  }

  return null;
};

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  mode,
  parentCategoryName,
  childCategoryName,
  onClose,
  onSubmit,
  container,
}) => {
  const [error, setError] = useState<string | null>(null);

  const getDialogTitle = () => {
    switch (mode) {
      case "LEAF":
        return parentCategoryName ? "Dodaj podkategorię" : "Dodaj kategorię główną";
      case "SPLIT":
        return "Dodaj kategorię między węzłami";
      case "SPLIT_ALL":
        return "Dodaj kategorię i przesuń wszystkie podkategorie";
      default:
        return "Dodaj kategorię";
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      container={container}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontWeight: 600,
        }}
      >
        {getDialogTitle()}
      </DialogTitle>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent>
              {/* Visual hierarchy representation */}
              <CategoryHierarchyVisualizer
                mode={mode}
                parentCategoryName={parentCategoryName}
                childCategoryName={childCategoryName}
              />

              <Divider sx={{ my: 3 }} />

              {/* Category name input */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: "text.secondary" }}>
                  Wprowadź nazwę nowej kategorii:
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  label="Nazwa kategorii"
                  placeholder="np. Elektronika, Smartfony..."
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  autoFocus
                  disabled={isSubmitting}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#4caf50",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4caf50",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={handleClose} disabled={isSubmitting} sx={{ px: 3 }}>
                Anuluj
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  px: 4,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5568d3 0%, #63408b 100%)",
                  },
                }}
              >
                {isSubmitting ? "Tworzenie..." : "Dodaj kategorię"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CategoryFormDialog;
