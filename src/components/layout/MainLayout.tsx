import React from 'react';
import { Box } from '@mui/material';
import Header from '../common/Header';
import Footer from '../common/Footer';

interface MainLayoutProps {
    minimalist?: boolean;
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({minimalist, children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header minimalist={minimalist} />
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default MainLayout;
