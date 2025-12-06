import React, { useEffect, useState } from "react";
import { getAllCategories, createCategory, deleteCategory } from "../../api/product-service";
import CategoryDeleteDialog from "../../components/admin/categories/CategoryDeleteDialog";
import CategoryFormDialog from "../../components/admin/categories/CategoryFormDialog";
import CategoryTree from "../../components/admin/categories/CategoryTree";
import MainLayout from "../../components/layout/MainLayout";
import type { CategoryFormDialogState, CategoryDeleteDialogState } from "../../types/category";
import type { CategoryFromAPI } from "../../types/cms";
import { Typography, Box, Alert, CircularProgress, Paper, Container } from "@mui/material";

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newlyAddedCategoryId, setNewlyAddedCategoryId] = useState<string | null>(null);
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
      const response = await getAllCategories();
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

      const result = await createCategory(requestData);

      // Set newly added category ID for highlighting
      setNewlyAddedCategoryId(result.id);

      // Clear highlight after 6 seconds (3 animations * 2 seconds)
      setTimeout(() => {
        setNewlyAddedCategoryId(null);
      }, 6000);

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
      alert(
        "Błąd: Endpoint usuwania kategorii może nie być jeszcze zaimplementowany na backendzie.",
      );
      throw err;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4">Zarządzanie Kategoriami</Typography>
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
            <CategoryTree
              categories={categories}
              onAddLeaf={handleOpenAddLeafDialog}
              onAddBetween={handleOpenAddBetweenDialog}
              onDelete={handleOpenDeleteDialog}
              newlyAddedCategoryId={newlyAddedCategoryId}
              onAddRootCategory={handleOpenAddRootDialog}
              onRefresh={fetchCategories}
            />
          </Paper>
        )}

        <CategoryFormDialog
          open={formDialog.open}
          mode={formDialog.mode}
          parentCategoryName={formDialog.parentCategoryName}
          childCategoryName={formDialog.childCategoryName}
          onClose={handleCloseFormDialog}
          onSubmit={handleCreateCategory}
          container={() => (document.fullscreenElement as HTMLElement) || document.body}
        />

        <CategoryDeleteDialog
          open={deleteDialog.open}
          category={deleteDialog.category}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteCategory}
          container={() => (document.fullscreenElement as HTMLElement) || document.body}
        />
      </Container>
    </MainLayout>
  );
};

export default CategoryManagementPage;
