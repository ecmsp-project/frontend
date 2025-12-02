import React, { useEffect, useState, useCallback } from "react";
import { getProductsByCategory, searchProducts } from "../api/product-service";
import MainLayout from "../components/layout/MainLayout";
import CategoryFilter from "../components/search/CategoryFilter";
import PriceFilter from "../components/search/PriceFilter";
import ProductListItem from "../components/search/ProductListItem";
import SearchFilters from "../components/search/SearchFilters";
import SortFilter, { type SortOption } from "../components/search/SortFilter";
import { useProductContext } from "../contexts/ProductContext.tsx";
import type { ProductRepresentationDTO } from "../types/products.ts";
import { Box, Typography, Container, CircularProgress, Menu, Pagination } from "@mui/material";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<ProductRepresentationDTO[]>([]);
  const [sortedProducts, setSortedProducts] = useState<ProductRepresentationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 15_000]);
  const [priceMenuAnchor, setPriceMenuAnchor] = useState<null | HTMLElement>(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(20);
  const [nextPageNumber, setNextPageNumber] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { categories } = useProductContext();
  const params = useParams<{ slug: string }>();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const sortProducts = (
    productsToSort: ProductRepresentationDTO[],
    sortOption: SortOption,
  ): ProductRepresentationDTO[] => {
    const sorted = [...productsToSort];
    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => a.variantDetail.price - b.variantDetail.price);
      case "price-desc":
        return sorted.sort((a, b) => b.variantDetail.price - a.variantDetail.price);
      default:
        return sorted;
    }
  };

  const loadProductsByCategory = useCallback(
    async (catId: string, page: number = 0) => {
      setLoading(true);
      try {
        const response = await getProductsByCategory(catId, {
          pageNumber: page,
          pageSize: pageSize,
        });
        const loadedProducts = response.productsRepresentation || [];
        setProducts(loadedProducts);
        setNextPageNumber(response.nextPageNumber);
      } catch (error) {
        console.error("Error loading products by category:", error);
        setProducts([]);
        setNextPageNumber(null);
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  const loadSearchResults = useCallback(
    async (query: string, page: number = 0) => {
      setLoading(true);
      try {
        const response = await searchProducts(query, {
          pageNumber: page,
          pageSize: pageSize,
        });
        const loadedProducts = response.productsRepresentation || [];
        setProducts(loadedProducts);
        setNextPageNumber(response.nextPageNumber);
      } catch (error) {
        console.error("Error searching products:", error);
        setProducts([]);
        setNextPageNumber(null);
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) => {
        const price = product.variantDetail.price;
        return price >= priceRange[0] && price <= priceRange[1];
      });

      const sorted = sortProducts(filtered, sortBy);
      setSortedProducts(sorted);
    } else {
      setSortedProducts([]);
    }
  }, [products, sortBy, priceRange]);

  useEffect(() => {
    setCurrentPage(0);
  }, [location.search, location.pathname, params.slug]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");

    if (queryParam) {
      setSearchTerm(queryParam);
      setCategoryId(null);
      loadSearchResults(queryParam, currentPage);
      return;
    }
    if (params.slug) {
      setSearchTerm("");
      setCategoryId(params.slug);
      loadProductsByCategory(params.slug, currentPage);
      return;
    }
    setSearchTerm("");
    setCategoryId(null);
    setProducts([]);
    setNextPageNumber(null);
  }, [
    location.search,
    location.pathname,
    params.slug,
    currentPage,
    loadProductsByCategory,
    loadSearchResults,
  ]);

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
            onCategoryChipDelete={() => {
              setCategoryId(null);
              navigate("/search");
            }}
            onPriceChipDelete={() => setPriceRange([0, 15_000])}
          />

          <Typography variant="body2" color="text.secondary">
            Liczba produktów: {sortedProducts.length}
          </Typography>
        </Box>

        <SortFilter
          sortBy={sortBy}
          onSortChange={(option) => {
            setSortBy(option);
            setSortMenuAnchor(null);
          }}
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
                    <ProductListItem key={product.variantDetail.variant_id} product={product} />
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
