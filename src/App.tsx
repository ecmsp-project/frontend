import { lazy, Suspense } from "react";
import { CMSProvider } from "./contexts/CMSProvider.tsx";
import CartProvider from "./contexts/CartProvider.tsx";
import IndividualUserProvider from "./contexts/IndividualUserProvider.tsx";
import { PermissionProvider } from "./contexts/PermissionProvider.tsx";
import ProductProvider from "./contexts/ProductProvider.tsx";
import { RoleProvider } from "./contexts/RoleProvider.tsx";
import UserProvider from "./contexts/UserProvider.tsx";
import theme from "./utils/theme.ts";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ProductPage = lazy(() => import("./pages/ProductPage.tsx"));
const CartPage = lazy(() => import("./pages/CartPage.tsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.tsx"));
const PaymentPage = lazy(() => import("./pages/PaymentPage.tsx"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Faq = lazy(() => import("./pages/Faq.tsx"));
const UserOrdersPage = lazy(() => import("./pages/UserOrdersPage.tsx"));
const CreateProductPage = lazy(() => import("./pages/CreateProductPage.tsx"));
const CreateVariantPage = lazy(() => import("./pages/CreateVariantPage.tsx"));
const UserDashboardPage = lazy(() => import("./pages/user/UserDashboardPage.tsx"));
const UserOrdersManagementPage = lazy(() => import("./pages/user/UserOrdersManagementPage.tsx"));
const UserSettingsPage = lazy(() => import("./pages/user/UserSettingsPage.tsx"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage.tsx"));
const CMSPage = lazy(() => import("./pages/admin/CMSPage.tsx"));
const HomePageEditor = lazy(() => import("./pages/admin/HomePageEditor.tsx"));
const ContactPageEditor = lazy(() => import("./pages/admin/ContactPageEditor.tsx"));
const FaqPageEditor = lazy(() => import("./pages/admin/FaqPageEditor.tsx"));
const CategoryManagementPage = lazy(() => import("./pages/admin/CategoryManagementPage.tsx"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage.tsx"));
const RoleManagementPage = lazy(() => import("./pages/admin/RoleManagementPage.tsx"));
const OrderManagementPage = lazy(() => import("./pages/admin/OrderManagmentPage.tsx"));
const AddProductPage = lazy(() => import("./pages/admin/AddProductPage.tsx"));
const SalesStatisticsPage = lazy(() => import("./pages/admin/analytics/SalesStatisticsPage.tsx"));
const RaportsStatisticPage = lazy(() => import("./pages/admin/analytics/RaportsStatisticPage.tsx"));
const AnalyticsStatisticPage = lazy(
  () => import("./pages/admin/analytics/AnalyticsStatisticPage.tsx"),
);

const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
    }}
  >
    <CircularProgress />
  </Box>
);

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
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              <Route path="/" element={<HomePage />} />
                              <Route path="/search" element={<SearchPage />} />
                              <Route path="/category/:slug" element={<SearchPage />} />
                              <Route path="/product/:id" element={<ProductPage />} />
                              <Route path="/cart" element={<CartPage />} />
                              <Route path="/order/:orderId" element={<CheckoutPage />} />
                              <Route path="/payment/:paymentId" element={<PaymentPage />} />
                              <Route
                                path="/order-confirmation/:orderId"
                                element={<OrderConfirmationPage />}
                              />

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
                              <Route
                                path="/admin/cms/contact/edit"
                                element={<ContactPageEditor />}
                              />
                              <Route path="/admin/cms/faq/edit" element={<FaqPageEditor />} />
                              <Route
                                path="/admin/categories"
                                element={<CategoryManagementPage />}
                              />
                              <Route path="/admin/users" element={<UserManagementPage />} />
                              <Route path="/admin/roles" element={<RoleManagementPage />} />
                              <Route path="/admin/orders" element={<OrderManagementPage />} />
                              <Route path="/admin/products/add" element={<AddProductPage />} />
                              <Route
                                path="/admin/analytics/sales"
                                element={<SalesStatisticsPage />}
                              />
                              <Route
                                path="/admin/analytics/reports"
                                element={<RaportsStatisticPage />}
                              />
                              <Route
                                path="/admin/analytics/products"
                                element={<AnalyticsStatisticPage />}
                              />
                              <Route path="*" element={<div>404 Not Found</div>} />
                            </Routes>
                          </Suspense>
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
