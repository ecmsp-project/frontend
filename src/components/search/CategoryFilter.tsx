import React, { useState } from "react";
import type { CategoryFromAPI } from "../../types/cms";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface CategoryFilterProps {
  categories: CategoryFromAPI[];
  selectedCategoryId: string | null;
  onCategoryClick: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onCategoryClick,
}) => {
  const [categorySearchTerm, setCategorySearchTerm] = useState<string>("");

  const mainCategories = categories.filter((cat) => cat.parentCategoryId === null);
  const subCategoriesMap = new Map<string, CategoryFromAPI[]>();

  categories.forEach((cat) => {
    if (cat.parentCategoryId) {
      if (!subCategoriesMap.has(cat.parentCategoryId)) {
        subCategoriesMap.set(cat.parentCategoryId, []);
      }
      subCategoriesMap.get(cat.parentCategoryId)!.push(cat);
    }
  });

  const searchLower = categorySearchTerm.toLowerCase();
  const filteredMainCategories = mainCategories.filter((mainCat) => {
    if (!categorySearchTerm) return true;

    const mainMatches = mainCat.name.toLowerCase().includes(searchLower);
    const subCategories = subCategoriesMap.get(mainCat.id) || [];
    const hasMatchingSubCategory = subCategories.some((subCat) =>
      subCat.name.toLowerCase().includes(searchLower),
    );

    return mainMatches || hasMatchingSubCategory;
  });

  const getFilteredSubCategories = (mainCategoryId: string): CategoryFromAPI[] => {
    const subCategories = subCategoriesMap.get(mainCategoryId) || [];
    if (!categorySearchTerm) return subCategories;

    return subCategories.filter((subCat) => subCat.name.toLowerCase().includes(searchLower));
  };

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Kategoria
      </Typography>
      <TextField
        size="small"
        fullWidth
        placeholder="Szukaj kategorii..."
        value={categorySearchTerm}
        onChange={(e) => setCategorySearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          maxHeight: "500px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
          },
        }}
      >
        {filteredMainCategories.length > 0 ? (
          filteredMainCategories.map((mainCategory) => {
            const filteredSubCategories = getFilteredSubCategories(mainCategory.id);
            const hasSubCategories = filteredSubCategories.length > 0;

            return (
              <Accordion
                key={mainCategory.id}
                disableGutters
                elevation={0}
                defaultExpanded={Boolean(categorySearchTerm && filteredSubCategories.length > 0)}
                sx={{
                  border: "none",
                  "&:before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={hasSubCategories ? <ExpandMoreIcon /> : null}
                  sx={{
                    minHeight: 40,
                    "&.Mui-expanded": {
                      minHeight: 40,
                    },
                    px: 0,
                  }}
                >
                  <ListItemButton
                    sx={{
                      py: 0.5,
                      px: 1,
                      backgroundColor:
                        selectedCategoryId === mainCategory.id ? "action.selected" : "transparent",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryClick(mainCategory.id);
                    }}
                  >
                    <ListItemText
                      primary={mainCategory.name}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: selectedCategoryId === mainCategory.id ? 600 : 400,
                      }}
                      secondary={
                        mainCategory.productCount > 0
                          ? `${mainCategory.productCount} produktów`
                          : undefined
                      }
                    />
                  </ListItemButton>
                </AccordionSummary>
                {hasSubCategories && (
                  <AccordionDetails sx={{ py: 0, px: 0 }}>
                    <List dense sx={{ pl: 2 }}>
                      {filteredSubCategories.map((subCategory) => (
                        <ListItem key={subCategory.id} disablePadding>
                          <ListItemButton
                            sx={{
                              py: 0.5,
                              backgroundColor:
                                selectedCategoryId === subCategory.id
                                  ? "action.selected"
                                  : "transparent",
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                            onClick={() => onCategoryClick(subCategory.id)}
                          >
                            <ListItemText
                              primary={subCategory.name}
                              primaryTypographyProps={{
                                fontSize: "0.8125rem",
                                fontWeight: selectedCategoryId === subCategory.id ? 500 : 400,
                              }}
                              secondary={
                                subCategory.productCount > 0
                                  ? `${subCategory.productCount} produktów`
                                  : undefined
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                )}
              </Accordion>
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2, py: 2 }}>
            {categorySearchTerm ? "Nie znaleziono kategorii" : "Brak kategorii"}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryFilter;
