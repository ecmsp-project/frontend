import { CMSProvider } from "./contexts/CMSProvider.tsx";
import CartProvider from "./contexts/CartProvider.tsx";
import IndividualUserProvider from "./contexts/IndividualUserProvider.tsx";
import { PermissionProvider } from "./contexts/PermissionProvider.tsx";
import ProductProvider from "./contexts/ProductProvider.tsx";
import { RoleProvider } from "./contexts/RoleProvider.tsx";
import UserProvider from "./contexts/UserProvider.tsx";
import CartPage from "./pages/CartPage.tsx";
import Contact from "./pages/Contact.tsx";
import CreateProductPage from "./pages/CreateProductPage.tsx";
import CreateVariantPage from "./pages/CreateVariantPage.tsx";
import Faq from "./pages/Faq.tsx";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import Register from "./pages/Register.tsx";
import SearchPage from "./pages/SearchPage";
import UserOrdersPage from "./pages/UserOrdersPage.tsx";
import CMSPage from "./pages/admin/CMSPage.tsx";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage.tsx";
import ContactPageEditor from "./pages/admin/ContactPageEditor.tsx";
import DashboardPage from "./pages/admin/DashboardPage.tsx";
import FaqPageEditor from "./pages/admin/FaqPageEditor.tsx";
import HomePageEditor from "./pages/admin/HomePageEditor.tsx";
import OrderManagementPage from "./pages/admin/OrderManagmentPage.tsx";
import RoleManagementPage from "./pages/admin/RoleManagementPage.tsx";
import UserManagementPage from "./pages/admin/UserManagementPage.tsx";
import UserDashboardPage from "./pages/user/UserDashboardPage.tsx";
import UserOrdersManagementPage from "./pages/user/UserOrdersManagementPage.tsx";
import UserSettingsPage from "./pages/user/UserSettingsPage.tsx";
import SalesStatisticsPage from "./pages/admin/analytics/SalesStatisticsPage.tsx";
import theme from "./utils/theme.ts";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <IndividualUserProvider>
          <UserProvider>
            <RoleProvider>
              <PermissionProvider>
                <CartProvider>
                  <ProductProvider>
                    <CMSProvider>
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
                            <Route path="/cp" element={<CreateProductPage />} />
                            <Route path="/cv" element={<CreateVariantPage />} />
                            <Route path="/user" element={<UserDashboardPage />} />
                            <Route path="/user/orders" element={<UserOrdersManagementPage />} />
                            <Route path="/user/settings" element={<UserSettingsPage />} />
                            <Route path="/admin" element={<DashboardPage />} />
                            <Route path="/admin/cms" element={<CMSPage />} />
                            <Route path="/admin/cms/home/edit" element={<HomePageEditor />} />
                            <Route path="/admin/cms/contact/edit" element={<ContactPageEditor />} />
                            <Route path="/admin/cms/faq/edit" element={<FaqPageEditor />} />
                            <Route path="/admin/categories" element={<CategoryManagementPage />} />
                            <Route path="/admin/users" element={<UserManagementPage />} />
                            <Route path="/admin/roles" element={<RoleManagementPage />} />
                            <Route path="/admin/orders" element={<OrderManagementPage />} />
                            <Route path="/admin/analytics/sales" element={<SalesStatisticsPage />} />
                            <Route path="*" element={<div>404 Not Found</div>} />
                          </Routes>
                        </Box>
                      </Box>
                    </CMSProvider>
                  </ProductProvider>
                </CartProvider>
              </PermissionProvider>
            </RoleProvider>
          </UserProvider>
        </IndividualUserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
