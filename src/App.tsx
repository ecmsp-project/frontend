import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import theme from "./utils/theme.ts";
import CartPage from "./pages/CartPage.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ProductPage from "./pages/ProductPage.tsx";

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        width: '100%',
                        bgcolor: 'background.default',
                    }}>
                    <Box component="main" sx={{ flexGrow: 1 }}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/category/:slug" element={<SearchPage />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="*" element={<div>404 Not Found</div>} />
                        </Routes>
                    </Box>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}
