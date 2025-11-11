import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
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
import { useIndividualUser } from "../../contexts/IndividualUserContext";

const drawerWidth = 240;

const menuItems = [
  { text: "Moje konto", icon: <AccountCircleIcon />, path: "/user" },
  { text: "Moje zamówienia", icon: <ShoppingBagIcon />, path: "/user/orders" },
  { text: "Ustawienia", icon: <SettingsIcon />, path: "/user/settings" },
];

interface UserLayoutProps {
  children?: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useIndividualUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "primary.main" }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel Użytkownika E-COMMERCE
            {currentUser && (
              <Typography
                component="span"
                variant="body2"
                sx={{ ml: 2, opacity: 0.8 }}
              >
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

export default UserLayout;
