import { useEffect, useState, useCallback } from "react";
import { getProductsByCategory, searchProducts } from "../api/product-service";
import type { SortOption } from "../components/search/SortFilter";
import type { ProductRepresentationDTO } from "../types/products";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const PAGE_SIZE = 20;
const DEFAULT_PRICE_RANGE = [0, 15_000] as const;

export const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<ProductRepresentationDTO[]>([]);
  const [sortedProducts, setSortedProducts] = useState<ProductRepresentationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([...DEFAULT_PRICE_RANGE]);
  const [priceMenuAnchor, setPriceMenuAnchor] = useState<null | HTMLElement>(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [nextPageNumber, setNextPageNumber] = useState<number | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ slug: string }>();

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

  const loadProductsByCategory = useCallback(async (catId: string, page: number = 0) => {
    setLoading(true);
    try {
      const response = await getProductsByCategory(catId, {
        pageNumber: page,
        pageSize: PAGE_SIZE,
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
  }, []);

  const loadSearchResults = useCallback(async (query: string, page: number = 0) => {
    setLoading(true);
    try {
      const response = await searchProducts(query, {
        pageNumber: page,
        pageSize: PAGE_SIZE,
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
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      navigate(`/category/${categoryId}`);
    },
    [navigate],
  );

  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSortChange = useCallback((option: SortOption) => {
    setSortBy(option);
    setSortMenuAnchor(null);
  }, []);

  const handleCategoryChipDelete = useCallback(() => {
    setCategoryId(null);
    navigate("/search");
  }, [navigate]);

  const handlePriceChipDelete = useCallback(() => {
    setPriceRange([...DEFAULT_PRICE_RANGE]);
  }, []);

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

  return {
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
  };
};
