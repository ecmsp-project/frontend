import React, { useState } from "react";
import { addCartProduct } from "../api/cart-service";
import Breadcrumbs from "../components/common/Breadcrumbs";
import MainLayout from "../components/layout/MainLayout";
import CategoryFilter from "../components/search/CategoryFilter";
import PriceFilter from "../components/search/PriceFilter";
import ProductListItem from "../components/search/ProductListItem";
import SearchFilters from "../components/search/SearchFilters";
import SortFilter from "../components/search/SortFilter";
import { useCartContext } from "../contexts/CartContext";
import { useProductContext } from "../contexts/ProductContext.tsx";
import { useProductSearch } from "../hooks/useProductSearch";
import type { ProductRepresentationDTO } from "../types/products.ts";
import { Box, Typography, Container, CircularProgress, Menu, Pagination } from "@mui/material";

const SearchPage: React.FC = () => {
  const { categories } = useProductContext();
  const { refetchCart } = useCartContext();
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});
  const {
    navigate,
    searchTerm,
    sortedProducts,
    loading,
    categoryId,
    priceRange,
    priceMenuAnchor,
    categoryMenuAnchor,
    sortMenuAnchor,
    sortBy,
    currentPage,
    nextPageNumber,
    setPriceRange,
    setPriceMenuAnchor,
    setCategoryMenuAnchor,
    setSortMenuAnchor,
    handleCategoryClick,
    handlePageChange,
    handleSortChange,
    handleCategoryChipDelete,
    handlePriceChipDelete,
  } = useProductSearch();

  const handleProductClick = (product: ProductRepresentationDTO) => {
    const url = categoryId
      ? `/product/${product.variantDetail.variantId}?categoryId=${categoryId}`
      : `/product/${product.variantDetail.variantId}`;
    navigate(url);
  };

  const handleAddToCart = async (product: ProductRepresentationDTO) => {
    const variantId = product.variantDetail.variantId;
    setAddingToCart((prev) => ({ ...prev, [variantId]: true }));
    try {
      await addCartProduct(variantId, 1);
      await refetchCart();
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [variantId]: false }));
    }
  };

  const categoryName = categoryId
    ? categories.find((category) => category.id === categoryId)?.name
    : null;

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ px: 4, pt: 4 }}>
          {categoryId && <Breadcrumbs items={[{ label: categoryName || "Category" }]} />}
          {searchTerm && (
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: categoryId ? 2 : 0 }}>
              Search results for "{searchTerm}"
            </Typography>
          )}
          {categoryId && !searchTerm && (
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
              Products from category {categoryName}
            </Typography>
          )}

          <Box sx={{ pt: searchTerm || categoryId ? 2 : 0, pb: 2 }}>
            <SearchFilters
              categoryId={categoryId}
              categories={categories}
              priceRange={priceRange}
              onSortMenuOpen={(e) => setSortMenuAnchor(e.currentTarget)}
              onCategoryMenuOpen={(e) => setCategoryMenuAnchor(e.currentTarget)}
              onPriceMenuOpen={(e) => setPriceMenuAnchor(e.currentTarget)}
              onCategoryChipDelete={handleCategoryChipDelete}
              onPriceChipDelete={handlePriceChipDelete}
            />

            <Typography variant="body2" color="text.secondary">
              Number of products: {sortedProducts.length}
            </Typography>
          </Box>
        </Box>

        <SortFilter
          sortBy={sortBy}
          onSortChange={handleSortChange}
          anchorEl={sortMenuAnchor}
          onClose={() => setSortMenuAnchor(null)}
        />

        <Menu
          anchorEl={categoryMenuAnchor}
          open={Boolean(categoryMenuAnchor)}
          onClose={() => setCategoryMenuAnchor(null)}
          PaperProps={{
            sx: {
              maxHeight: 400,
              width: 300,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <CategoryFilter
              categories={categories}
              selectedCategoryId={categoryId}
              onCategoryClick={(id) => {
                handleCategoryClick(id);
                setCategoryMenuAnchor(null);
              }}
            />
          </Box>
        </Menu>

        <PriceFilter
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          anchorEl={priceMenuAnchor}
          onClose={() => setPriceMenuAnchor(null)}
        />

        <Box sx={{ px: 4 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box>
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <ProductListItem
                      key={product.variantDetail.variantId}
                      product={product}
                      onProductClick={handleProductClick}
                      onAddToCart={handleAddToCart}
                      isAddingToCart={addingToCart[product.variantDetail.variantId] || false}
                    />
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
                    No products to display
                  </Typography>
                )}
              </Box>
              {sortedProducts.length > 0 && nextPageNumber !== null && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={nextPageNumber}
                    page={currentPage + 1}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
              {sortedProducts.length > 0 && nextPageNumber === null && currentPage > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={currentPage + 1}
                    page={currentPage + 1}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default SearchPage;
