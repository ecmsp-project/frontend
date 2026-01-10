import React from "react";
import type { ProductRepresentationDTO } from "../../types/products";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";

interface ProductListItemProps {
  product: ProductRepresentationDTO;
  onAddToCart?: (product: ProductRepresentationDTO) => void;
  onProductClick?: (product: ProductRepresentationDTO) => void;
  isAddingToCart?: boolean;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  onAddToCart,
  onProductClick,
  isAddingToCart = false,
}) => {
  const imageUrl = product.variantDetail.variantImages?.[0]?.url || "";

  return (
    <Paper
      onClick={() => onProductClick?.(product)}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        transition: "0.3s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
        <img
          src={imageUrl}
          alt={product.variantDetail.description}
          style={{
            width: 100,
            height: 100,
            objectFit: "cover",
            marginRight: 16,
            borderRadius: 4,
          }}
        />
        <Box>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              my: 0.5,
              maxWidth: 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Stock level: {product.variantDetail.stockQuantity}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          ml: 2,
        }}
      >
        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700, mb: 1 }}>
          {product.variantDetail.price.toFixed(2)} PLN
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={isAddingToCart}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
        >
          {isAddingToCart ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default ProductListItem;
