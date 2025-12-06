import React, { useState, useCallback, useEffect, type KeyboardEvent } from "react";
import { useCartContext } from "../../contexts/CartContext";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
import { useProductContext } from "../../contexts/ProductContext";
import { Home } from "@mui/icons-material";
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
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const { logout, permissions } = useIndividualUser();
  const { cartItems } = useCartContext();
  const { categories } = useProductContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoriesOpen, setCategoriesOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem("token")));
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  // Oblicz całkowitą liczbę produktów w koszyku
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");
    if (queryParam !== null) {
      setSearchTerm(queryParam);
    } else if (location.pathname !== "/search") {
      setSearchTerm("");
    }
  }, [location.search, location.pathname]);

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
      <AppBar
        position="static"
        sx={{
          bgcolor: "primary.main",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Button
            color="inherit"
            component="a"
            href="/"
            startIcon={<Home />}
            sx={{
              textTransform: "none",
              mr: 2,
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Strona główna
          </Button>

          {!minimalist && (
            <>
              <Button
                color="inherit"
                startIcon={<CategoryIcon />}
                onClick={() => setCategoriesOpen(true)}
                sx={{
                  textTransform: "none",
                  mr: 2,
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Kategorie
              </Button>
              <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: 2 }}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: "100%",
                    maxWidth: 600,
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                    "&:focus-within": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      borderColor: "rgba(59, 130, 246, 0.5)",
                      boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                    },
                  }}
                >
                  <IconButton
                    onClick={handleSearch}
                    size="large"
                    color="inherit"
                    aria-label="search"
                    sx={{
                      p: "8px 12px",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <SearchIcon />
                  </IconButton>

                  <InputBase
                    placeholder="Szukaj produktów..."
                    inputProps={{ "aria-label": "search" }}
                    sx={{
                      color: "inherit",
                      p: "8px 8px 8px 0",
                      width: "100%",
                      "&::placeholder": {
                        color: "rgba(255, 255, 255, 0.7)",
                        opacity: 1,
                      },
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                {isLoggedIn ? (
                  <>
                    <IconButton
                      size="large"
                      aria-label="panel użytkownika"
                      color="inherit"
                      onClick={handleUserMenuOpen}
                      sx={{
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <AccountCircle />
                    </IconButton>
                    <IconButton
                      size="large"
                      aria-label="koszyk"
                      color="inherit"
                      onClick={() => navigate("/cart")}
                      sx={{
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <Badge
                        badgeContent={cartItemsCount}
                        color="error"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          },
                        }}
                      >
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      onClick={() => navigate("/login")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2.5,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Zaloguj się
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => navigate("/register")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2.5,
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          borderColor: "rgba(255, 255, 255, 0.5)",
                          transform: "translateY(-2px)",
                        },
                      }}
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
            minWidth: 220,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          },
        }}
      >
        <MenuItem
          onClick={() => handleMenuItemClick("/user")}
          sx={{
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "rgba(59, 130, 246, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText primary="Moje konto" primaryTypographyProps={{ fontWeight: 500 }} />
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("/user/orders")}
          sx={{
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "rgba(59, 130, 246, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <ShoppingBagIcon fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText primary="Moje zamówienia" primaryTypographyProps={{ fontWeight: 500 }} />
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("/user/settings")}
          sx={{
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "rgba(59, 130, 246, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText primary="Ustawienia" primaryTypographyProps={{ fontWeight: 500 }} />
        </MenuItem>
        {permissions.length > 0 && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => handleMenuItemClick("/admin")}
              sx={{
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "rgba(59, 130, 246, 0.1)",
                },
              }}
            >
              <ListItemIcon>
                <WorkIcon fontSize="small" sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText
                primary="Panel pracownika"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>
          </>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "rgba(239, 68, 68, 0.1)",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText primary="Wyloguj się" primaryTypographyProps={{ fontWeight: 500 }} />
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
            maxHeight: "85vh",
            overflowY: "auto",
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Box sx={{ px: 4, py: 2 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 4, color: "text.primary" }}>
            Kategorie Produktów
          </Typography>
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
                          opacity: 0.2,
                        }
                      : {},
                }}
              >
                {column.map((categoryGroup) => (
                  <Box key={categoryGroup.main.id} sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mb: 2,
                        cursor: "pointer",
                        color: "text.primary",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          color: "primary.main",
                          transform: "translateX(4px)",
                        },
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
                            mb: 0.5,
                            borderRadius: 1,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              bgcolor: "rgba(59, 130, 246, 0.08)",
                              transform: "translateX(4px)",
                            },
                          }}
                          onClick={() => handleCategoryClick(subcat.id)}
                        >
                          <ListItemText
                            primary={subcat.name}
                            primaryTypographyProps={{
                              variant: "body2",
                              color: "text.secondary",
                              fontWeight: 500,
                              sx: {
                                transition: "color 0.2s",
                                "&:hover": {
                                  color: "primary.main",
                                },
                              },
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
