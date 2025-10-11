import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { Box } from "@mui/material";

interface MainLayoutProps {
  minimalist?: boolean;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ minimalist, children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header minimalist={minimalist} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
