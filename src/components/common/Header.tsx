import React, { useState, useCallback, type KeyboardEvent } from "react";
import { useCartContext } from "../../contexts/CartContext";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
import { useProductContext } from "../../contexts/ProductContext";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WorkIcon from "@mui/icons-material/Work";
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
  Menu,
  MenuItem,
  ListItemIcon,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  minimalist?: boolean;
}

interface Category {
  id: string;
  name: string;
  parentCategoryId: string | null;
}

const Header: React.FC<HeaderProps> = ({ minimalist }) => {
  const navigate = useNavigate();
  const { logout, permissions } = useIndividualUser();
  const { cartItems } = useCartContext();
  const { categories } = useProductContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoriesOpen, setCategoriesOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem("token")));
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  // Oblicz całkowitą liczbę produktów w koszyku
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Sprawdź token przy każdej zmianie w localStorage
  React.useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    // Sprawdź początkowy stan
    checkToken();

    // Nasłuchuj zmian w localStorage (np. po zalogowaniu/wylogowaniu)
    window.addEventListener("storage", checkToken);

    // Dodaj interval do sprawdzania tokenu co 100ms (dla zmian w tej samej karcie)
    const interval = setInterval(checkToken, 100);

    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

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
    const convertedCategories: Category[] = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      parentCategoryId: cat.parentCategoryId,
    }));

    const mainCategories = convertedCategories.filter((cat) => cat.parentCategoryId === null);
    const columns: Array<Array<{ main: Category; subcategories: Category[] }>> = [[]];
    let currentColumnIndex = 0;
    const maxItemsPerColumn = 12; // Maksymalna liczba elementów w kolumnie

    mainCategories.forEach((mainCat) => {
      const subcategories = convertedCategories.filter(
        (cat) => cat.parentCategoryId === mainCat.id,
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

  const handleCategoryClick = (categoryId: string) => {
    setCategoriesOpen(false);
    navigate(`/category/${categoryId}`);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    handleUserMenuClose();
    navigate("/");
  };

  const handleMenuItemClick = (path: string) => {
    handleUserMenuClose();
    navigate(path);
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
                {isLoggedIn ? (
                  <>
                    <IconButton
                      size="large"
                      aria-label="panel użytkownika"
                      color="inherit"
                      onClick={handleUserMenuOpen}
                    >
                      <AccountCircle />
                    </IconButton>
                    <IconButton
                      size="large"
                      aria-label="koszyk"
                      color="inherit"
                      onClick={() => navigate("/cart")}
                    >
                      <Badge badgeContent={cartItemsCount} color="error">
                        <ShoppingCartIcon />
                      </Badge>
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

      {/* Menu użytkownika */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick("/user")}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Moje konto</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/user/orders")}>
          <ListItemIcon>
            <ShoppingBagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Moje zamówienia</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/user/settings")}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ustawienia</ListItemText>
        </MenuItem>
        {permissions.length > 0 && (
          <>
            <Divider />
            <MenuItem onClick={() => handleMenuItemClick("/admin")}>
              <ListItemIcon>
                <WorkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Panel pracownika</ListItemText>
            </MenuItem>
          </>
        )}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Wyloguj się</ListItemText>
        </MenuItem>
      </Menu>

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
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
          ></Box>
          <Grid container spacing={0}>
            {categoryColumns.map((column, columnIndex) => (
              <Grid
                component="div"
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
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
