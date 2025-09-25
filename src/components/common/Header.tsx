import React, { useState, useCallback, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearch = useCallback(() => {
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    }, [searchTerm, navigate]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 4,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    E-COMMERCE
                </Typography>

                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.25)',
                            },
                            mr: 2,
                            width: '100%',
                            maxWidth: 600,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton
                            onClick={handleSearch}
                            size="large"
                            color="inherit"
                            aria-label="search"
                            sx={{ p: '0 12px' }}
                        >
                            <SearchIcon />
                        </IconButton>

                        <InputBase
                            placeholder="Szukaj produktów..."
                            inputProps={{ 'aria-label': 'search' }}
                            sx={{ color: 'inherit', p: '8px 8px 8px 0', width: '100%' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton size="large" aria-label="panel użytkownika" color="inherit" onClick={() => navigate('/login')}>
                        <AccountCircle />
                    </IconButton>
                    <IconButton size="large" aria-label="koszyk" color="inherit" onClick={() => navigate('/cart')}>
                        <ShoppingCartIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
