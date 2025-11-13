import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Typography, Box, Alert, CircularProgress, Button, Paper } from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { getAllCategories, createCategory, deleteCategory } from "../../api/product-service";
import type { CategoryFromAPI } from "../../types/cms";
import type {
  CategoryFormDialogState,
  CategoryDeleteDialogState,
} from "../../types/category";
import CategoryTree from "../../components/admin/categories/CategoryTree";
import CategoryFormDialog from "../../components/admin/categories/CategoryFormDialog";
import CategoryDeleteDialog from "../../components/admin/categories/CategoryDeleteDialog";

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formDialog, setFormDialog] = useState<CategoryFormDialogState>({
    open: false,
    mode: "LEAF",
  });
  const [deleteDialog, setDeleteDialog] = useState<CategoryDeleteDialogState>({
    open: false,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("CategoryManagement: Fetching categories...");
      const response = await getAllCategories();
      console.log("CategoryManagement: Received response:", response);
      console.log("CategoryManagement: Categories count:", response.categories.length);
      console.log("CategoryManagement: Categories data:", response.categories);
      setCategories(response.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Nie udało się pobrać kategorii. Sprawdź czy backend działa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddRootDialog = () => {
    setFormDialog({
      open: true,
      mode: "LEAF",
      parentCategoryId: undefined,
    });
  };

  const handleOpenAddLeafDialog = (categoryId: string, categoryName: string) => {
    setFormDialog({
      open: true,
      mode: "LEAF",
      parentCategoryId: categoryId,
      parentCategoryName: categoryName,
    });
  };

  const handleOpenAddBetweenDialog = (
    parentId: string,
    childId: string,
    parentName: string,
    childName: string,
  ) => {
    setFormDialog({
      open: true,
      mode: "SPLIT",
      parentCategoryId: parentId,
      childCategoryId: childId,
      parentCategoryName: parentName,
      childCategoryName: childName,
    });
  };

  const handleOpenDeleteDialog = (category: CategoryFromAPI) => {
    setDeleteDialog({
      open: true,
      category,
    });
  };

  const handleCloseFormDialog = () => {
    setFormDialog({
      open: false,
      mode: "LEAF",
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
    });
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const requestData: any = { name };

      if (formDialog.parentCategoryId) {
        requestData.parentCategoryId = formDialog.parentCategoryId;
      }

      if (formDialog.mode === "SPLIT" && formDialog.childCategoryId) {
        requestData.childCategoryId = formDialog.childCategoryId;
      }

      await createCategory(requestData);
      await fetchCategories();
      handleCloseFormDialog();
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      await fetchCategories();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Error deleting category:", err);
      // Note: Backend endpoint may not be implemented yet
      alert("Błąd: Endpoint usuwania kategorii może nie być jeszcze zaimplementowany na backendzie.");
      throw err;
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Zarządzanie Kategoriami</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchCategories}
            sx={{ mr: 2 }}
          >
            Odśwież
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddRootDialog}
          >
            Dodaj kategorię główną
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={2} sx={{ p: 3, height: 700 }}>
          {categories.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                Brak kategorii. Dodaj pierwszą kategorię używając przycisku powyżej.
              </Typography>
            </Box>
          ) : (
            <CategoryTree
              categories={categories}
              onAddLeaf={handleOpenAddLeafDialog}
              onAddBetween={handleOpenAddBetweenDialog}
              onDelete={handleOpenDeleteDialog}
            />
          )}
        </Paper>
      )}

      <CategoryFormDialog
        open={formDialog.open}
        mode={formDialog.mode}
        parentCategoryName={formDialog.parentCategoryName}
        childCategoryName={formDialog.childCategoryName}
        onClose={handleCloseFormDialog}
        onSubmit={handleCreateCategory}
      />

      <CategoryDeleteDialog
        open={deleteDialog.open}
        category={deleteDialog.category}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteCategory}
      />
    </AdminLayout>
  );
};

export default CategoryManagementPage;
