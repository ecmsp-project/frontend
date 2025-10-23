import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
  { text: "Pulpit", icon: <DashboardIcon />, path: "/admin" },
  { text: "Zarządzanie Użytkownikami", icon: <PeopleIcon />, path: "/admin/users" },
  { text: "Zamówienia", icon: <ShoppingBagIcon />, path: "/admin/orders" },
  { text: "Dodaj Produkt", icon: <AddCircleOutlineIcon />, path: "/admin/products/add" },
];

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "primary.dark" }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel Administracyjny E-COMMERCE
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            title="Wyloguj i wróć na stronę główną"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={NavLink} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default AdminLayout;
