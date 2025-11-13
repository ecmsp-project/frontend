import React, { useMemo } from "react";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
import { PERMISSIONS } from "../../types/permissions";
import type { Permission } from "../../types/permissions";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WebIcon from "@mui/icons-material/Web";
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

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  requiredPermissions?: Permission[];
}

const allMenuItems: MenuItem[] = [
  { text: "Pulpit", icon: <DashboardIcon />, path: "/admin" },
  {
    text: "UI Strony",
    icon: <WebIcon />,
    path: "/admin/cms",
  },
  {
    text: "Kategorie",
    icon: <CategoryIcon />,
    path: "/admin/categories",
  },
  {
    text: "Zarządzanie Użytkownikami",
    icon: <PeopleIcon />,
    path: "/admin/users",
    requiredPermissions: [PERMISSIONS.READ_USERS, PERMISSIONS.MANAGE_USERS],
  },
  {
    text: "Zarządzanie Rolami",
    icon: <PeopleIcon />,
    path: "/admin/roles",
    requiredPermissions: [PERMISSIONS.MANAGE_ROLES],
  },
  {
    text: "Zamówienia",
    icon: <ShoppingBagIcon />,
    path: "/admin/orders",
    requiredPermissions: [PERMISSIONS.READ_ORDERS, PERMISSIONS.WRITE_ORDERS],
  },
  {
    text: "Dodaj Produkt",
    icon: <AddCircleOutlineIcon />,
    path: "/admin/products/add",
    requiredPermissions: [PERMISSIONS.WRITE_PRODUCTS],
  },
];

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, logout, hasAnyPermission } = useIndividualUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const visibleMenuItems = useMemo(() => {
    return allMenuItems.filter((item) => {
      // Pulpit jest dostępny dla wszystkich
      if (!item.requiredPermissions) {
        return true;
      }
      // Sprawdź czy użytkownik ma przynajmniej jedno z wymaganych uprawnień
      return hasAnyPermission(item.requiredPermissions);
    });
  }, [hasAnyPermission]);

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
            {currentUser && (
              <Typography component="span" variant="body2" sx={{ ml: 2, opacity: 0.8 }}>
                ({currentUser.login})
              </Typography>
            )}
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
            {visibleMenuItems.map((item) => (
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
