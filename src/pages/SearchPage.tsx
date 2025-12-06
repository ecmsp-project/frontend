import React from "react";
import MainLayout from "../components/layout/MainLayout";
import CategoryFilter from "../components/search/CategoryFilter";
import PriceFilter from "../components/search/PriceFilter";
import ProductListItem from "../components/search/ProductListItem";
import SearchFilters from "../components/search/SearchFilters";
import SortFilter from "../components/search/SortFilter";
import { useProductContext } from "../contexts/ProductContext.tsx";
import { useProductSearch } from "../hooks/useProductSearch";
import type { ProductRepresentationDTO } from "../types/products.ts";
import { Box, Typography, Container, CircularProgress, Menu, Pagination } from "@mui/material";

const SearchPage: React.FC = () => {
  const { categories } = useProductContext();
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
    navigate(`/product/${product.variantDetail.variantId}`);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {searchTerm && (
          <Typography padding={4} paddingBottom={0} variant="h4" component="h1" gutterBottom>
            Wyniki wyszukiwania dla "{searchTerm}"
          </Typography>
        )}
        {categoryId && !searchTerm && (
          <Typography padding={4} paddingBottom={0} variant="h4" component="h1" gutterBottom>
            Produkty z kategorii {categories.find((category) => category.id === categoryId)?.name}
          </Typography>
        )}

        <Box padding={4} paddingBottom={2}>
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
            Liczba produktów: {sortedProducts.length}
          </Typography>
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

        <Box padding={4} paddingTop={0}>
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
                    />
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
                    Brak produktów do wyświetlenia
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
