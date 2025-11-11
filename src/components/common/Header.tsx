import React, { useState, useCallback, type KeyboardEvent } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Button,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useIndividualUser } from "../../contexts/IndividualUserContext";

interface HeaderProps {
  minimalist?: boolean;
}

interface Category {
  id: number;
  name: string;
  parent_category_id: number | null;
}

// Mock data - kategorie główne i podkategorie
const mockCategories: Category[] = [
  // Elektronika
  { id: 1, name: "Elektronika", parent_category_id: null },
  { id: 11, name: "Smartfony i telefony", parent_category_id: 1 },
  { id: 12, name: "Laptopy i komputery", parent_category_id: 1 },
  { id: 13, name: "Tablety", parent_category_id: 1 },
  { id: 14, name: "Słuchawki i audio", parent_category_id: 1 },
  { id: 15, name: "Smartwatche", parent_category_id: 1 },
  { id: 16, name: "Telewizory", parent_category_id: 1 },
  { id: 17, name: "Konsole i gry", parent_category_id: 1 },
  { id: 18, name: "Akcesoria", parent_category_id: 1 },

  // Odzież damska
  { id: 2, name: "Odzież damska", parent_category_id: null },
  { id: 21, name: "Sukienki", parent_category_id: 2 },
  { id: 22, name: "Bluzki i koszule", parent_category_id: 2 },
  { id: 23, name: "Spódnice", parent_category_id: 2 },
  { id: 24, name: "Spodnie", parent_category_id: 2 },
  { id: 25, name: "Kurtki i płaszcze", parent_category_id: 2 },
  { id: 26, name: "Bielizna", parent_category_id: 2 },
  { id: 27, name: "Odzież sportowa", parent_category_id: 2 },

  // Odzież męska
  { id: 3, name: "Odzież męska", parent_category_id: null },
  { id: 31, name: "Koszule", parent_category_id: 3 },
  { id: 32, name: "T-shirty i koszulki", parent_category_id: 3 },
  { id: 33, name: "Spodnie", parent_category_id: 3 },
  { id: 34, name: "Jeansy", parent_category_id: 3 },
  { id: 35, name: "Kurtki", parent_category_id: 3 },
  { id: 36, name: "Garnitury", parent_category_id: 3 },
  { id: 37, name: "Bielizna", parent_category_id: 3 },

  // Buty
  { id: 4, name: "Buty", parent_category_id: null },
  { id: 41, name: "Buty sportowe", parent_category_id: 4 },
  { id: 42, name: "Sneakersy", parent_category_id: 4 },
  { id: 43, name: "Buty eleganckie", parent_category_id: 4 },
  { id: 44, name: "Sandały", parent_category_id: 4 },
  { id: 45, name: "Kozaki", parent_category_id: 4 },
  { id: 46, name: "Trapery", parent_category_id: 4 },

  // Dom i Ogród
  { id: 5, name: "Dom i Ogród", parent_category_id: null },
  { id: 51, name: "Meble do salonu", parent_category_id: 5 },
  { id: 52, name: "Meble do sypialni", parent_category_id: 5 },
  { id: 53, name: "Meble kuchenne", parent_category_id: 5 },
  { id: 54, name: "Dekoracje", parent_category_id: 5 },
  { id: 55, name: "Oświetlenie", parent_category_id: 5 },
  { id: 56, name: "Tekstylia domowe", parent_category_id: 5 },
  { id: 57, name: "Narzędzia", parent_category_id: 5 },
  { id: 58, name: "Rośliny i ogród", parent_category_id: 5 },

  // Sport i Turystyka
  { id: 6, name: "Sport i Turystyka", parent_category_id: null },
  { id: 61, name: "Odzież sportowa", parent_category_id: 6 },
  { id: 62, name: "Sprzęt fitness", parent_category_id: 6 },
  { id: 63, name: "Rowery", parent_category_id: 6 },
  { id: 64, name: "Camping i survival", parent_category_id: 6 },
  { id: 65, name: "Wspinaczka", parent_category_id: 6 },
  { id: 66, name: "Sporty wodne", parent_category_id: 6 },
  { id: 67, name: "Sporty zimowe", parent_category_id: 6 },

  // Książki i multimedia
  { id: 7, name: "Książki i multimedia", parent_category_id: null },
  { id: 71, name: "Beletrystyka", parent_category_id: 7 },
  { id: 72, name: "Kryminał i thriller", parent_category_id: 7 },
  { id: 73, name: "Literatura naukowa", parent_category_id: 7 },
  { id: 74, name: "Poradniki", parent_category_id: 7 },
  { id: 75, name: "Książki dla dzieci", parent_category_id: 7 },
  { id: 76, name: "Komiksy", parent_category_id: 7 },
  { id: 77, name: "Audiobooki", parent_category_id: 7 },

  // Zabawki
  { id: 8, name: "Zabawki", parent_category_id: null },
  { id: 81, name: "Dla niemowląt", parent_category_id: 8 },
  { id: 82, name: "Gry planszowe", parent_category_id: 8 },
  { id: 83, name: "Puzzle", parent_category_id: 8 },
  { id: 84, name: "Klocki", parent_category_id: 8 },
  { id: 85, name: "Lalki i akcesoria", parent_category_id: 8 },
  { id: 86, name: "Samochody i pojazdy", parent_category_id: 8 },
  { id: 87, name: "Zabawki edukacyjne", parent_category_id: 8 },

  // Uroda i Zdrowie
  { id: 9, name: "Uroda i Zdrowie", parent_category_id: null },
  { id: 91, name: "Kosmetyki do twarzy", parent_category_id: 9 },
  { id: 92, name: "Makijaż", parent_category_id: 9 },
  { id: 93, name: "Pielęgnacja włosów", parent_category_id: 9 },
  { id: 94, name: "Perfumy", parent_category_id: 9 },
  { id: 95, name: "Suplementy diety", parent_category_id: 9 },
  { id: 96, name: "Sprzęt medyczny", parent_category_id: 9 },

  // AGD
  { id: 10, name: "AGD", parent_category_id: null },
  { id: 101, name: "Duże AGD", parent_category_id: 10 },
  { id: 102, name: "Pralki", parent_category_id: 10 },
  { id: 103, name: "Lodówki", parent_category_id: 10 },
  { id: 104, name: "Kuchenki", parent_category_id: 10 },
  { id: 105, name: "Odkurzacze", parent_category_id: 10 },
  { id: 106, name: "Małe AGD", parent_category_id: 10 },
  { id: 107, name: "Roboty kuchenne", parent_category_id: 10 },

  // Motoryzacja
  { id: 11, name: "Motoryzacja", parent_category_id: null },
  { id: 111, name: "Opony", parent_category_id: 11 },
  { id: 112, name: "Części samochodowe", parent_category_id: 11 },
  { id: 113, name: "Akcesoria samochodowe", parent_category_id: 11 },
  { id: 114, name: "Elektronika samochodowa", parent_category_id: 11 },
  { id: 115, name: "Kosmetyki samochodowe", parent_category_id: 11 },
  { id: 116, name: "Narzędzia", parent_category_id: 11 },

  // Dziecko
  { id: 12, name: "Dziecko", parent_category_id: null },
  { id: 121, name: "Wózki", parent_category_id: 12 },
  { id: 122, name: "Foteliki samochodowe", parent_category_id: 12 },
  { id: 123, name: "Ubranka", parent_category_id: 12 },
  { id: 124, name: "Buty dziecięce", parent_category_id: 12 },
  { id: 125, name: "Karmienie", parent_category_id: 12 },
  { id: 126, name: "Pielęgnacja", parent_category_id: 12 },
  { id: 127, name: "Pokój dziecięcy", parent_category_id: 12 },

  // Biuro i Szkoła
  { id: 13, name: "Biuro i Szkoła", parent_category_id: null },
  { id: 131, name: "Papiernicze", parent_category_id: 13 },
  { id: 132, name: "Zeszyty i notatniki", parent_category_id: 13 },
  { id: 133, name: "Artykuły biurowe", parent_category_id: 13 },
  { id: 134, name: "Tornistry i plecaki", parent_category_id: 13 },
  { id: 135, name: "Organizacja biura", parent_category_id: 13 }
];

const Header: React.FC<HeaderProps> = ({ minimalist }) => {
  const navigate = useNavigate();
  const { currentUser } = useIndividualUser();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoriesOpen, setCategoriesOpen] = useState<boolean>(false);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  }, [searchTerm, navigate]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Funkcja do organizowania kategorii w kolumny
  const organizeCategories = () => {
    const mainCategories = mockCategories.filter((cat) => cat.parent_category_id === null);
    const columns: Array<Array<{ main: Category; subcategories: Category[] }>> = [[]];
    let currentColumnIndex = 0;
    const maxItemsPerColumn = 12; // Maksymalna liczba elementów w kolumnie

    mainCategories.forEach((mainCat) => {
      const subcategories = mockCategories.filter(
        (cat) => cat.parent_category_id === mainCat.id,
      );
      const itemsCount = 1 + subcategories.length; // 1 dla głównej + podkategorie

      // Sprawdź czy mieści się w obecnej kolumnie
      const currentColumnSize = columns[currentColumnIndex].reduce(
        (sum, item) => sum + 1 + item.subcategories.length,
        0,
      );

      if (currentColumnSize + itemsCount > maxItemsPerColumn && currentColumnSize > 0) {
        // Przejdź do nowej kolumny
        currentColumnIndex++;
        columns[currentColumnIndex] = [];
      }

      columns[currentColumnIndex].push({ main: mainCat, subcategories });
    });

    return columns;
  };

  const categoryColumns = organizeCategories();

  const handleCategoryClick = (categoryId: number) => {
    setCategoriesOpen(false);
    navigate(`/category/${categoryId}`);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            E-COMMERCE
          </Typography>

          {!minimalist && (
            <>
              <Button
                color="inherit"
                startIcon={<CategoryIcon />}
                onClick={() => setCategoriesOpen(true)}
                sx={{ textTransform: "none", mr: 2 }}
              >
                Kategorie
              </Button>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 1,
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                  },
                  mr: 2,
                  width: "100%",
                  maxWidth: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  onClick={handleSearch}
                  size="large"
                  color="inherit"
                  aria-label="search"
                  sx={{ p: "0 12px" }}
                >
                  <SearchIcon />
                </IconButton>

                <InputBase
                  placeholder="Szukaj produktów..."
                  inputProps={{ "aria-label": "search" }}
                  sx={{ color: "inherit", p: "8px 8px 8px 0", width: "100%" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Box>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              {currentUser ? (
                <>
                  <IconButton
                    size="large"
                    aria-label="panel użytkownika"
                    color="inherit"
                    onClick={() => navigate("/user")}
                  >
                    <AccountCircle />
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="koszyk"
                    color="inherit"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/login")}
                    sx={{ textTransform: "none" }}
                  >
                    Zaloguj się
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate("/register")}
                    sx={{ textTransform: "none" }}
                  >
                    Zarejestruj się
                  </Button>
                </>
              )}
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>

    {/* Drawer z kategoriami */}
    <Drawer
      anchor="top"
      open={categoriesOpen}
      onClose={() => setCategoriesOpen(false)}
      PaperProps={{
        sx: {
          width: "100%",
          p: 4,
          maxHeight: "80vh",
          overflowY: "auto",
        },
      }}
    >
      <Box sx={{ px: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        </Box>
        <Grid container spacing={0}>
          {categoryColumns.map((column, columnIndex) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={columnIndex}
              sx={{
                position: "relative",
                px: 3,
                "&::after":
                  columnIndex < categoryColumns.length - 1
                    ? {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        bgcolor: "divider",
                        opacity: 0.3,
                      }
                    : {},
              }}
            >
            {column.map((categoryGroup) => (
              <Box key={categoryGroup.main.id} sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                  }}
                  onClick={() => handleCategoryClick(categoryGroup.main.id)}
                >
                  {categoryGroup.main.name}
                </Typography>
                <List dense disablePadding>
                  {categoryGroup.subcategories.map((subcat) => (
                    <ListItem
                      key={subcat.id}
                      disablePadding
                      sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                      onClick={() => handleCategoryClick(subcat.id)}
                    >
                      <ListItemText
                        primary={subcat.name}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Grid>
        ))}
        </Grid>
      </Box>
    </Drawer>
  </>
  );
};

export default Header;
