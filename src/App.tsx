import CartPage from "./pages/CartPage.tsx";
import Contact from "./pages/Contact.tsx";
import Faq from "./pages/Faq.tsx";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import Register from "./pages/Register.tsx";
import SearchPage from "./pages/SearchPage";
import UserOrdersPage from "./pages/UserOrdersPage.tsx";
import theme from "./utils/theme.ts";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/admin/DashboardPage.tsx";
import UserManagementPage from "./pages/admin/UserManagementPage.tsx";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
            bgcolor: "background.default",
          }}
        >
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/category/:slug" element={<SearchPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/orders" element={<UserOrdersPage />} />
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
