import React, { useState, useCallback, type KeyboardEvent } from "react";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  minimalist?: boolean;
}

const Header: React.FC<HeaderProps> = ({ minimalist }) => {
  const navigate = useNavigate();
  const { currentUser } = useIndividualUser();
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 4,
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
  );
};

export default Header;
