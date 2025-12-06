import React from "react";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 260;

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
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.3)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Panel Użytkownika E-COMMERCE
            {currentUser && (
              <Typography
                component="span"
                variant="body2"
                sx={{
                  ml: 2,
                  opacity: 0.9,
                  px: 1.5,
                  py: 0.5,
                  bgcolor: "rgba(59, 130, 246, 0.2)",
                  borderRadius: 1,
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                {currentUser.login}
              </Typography>
            )}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            title="Wyloguj i wróć na stronę główną"
            sx={{
              bgcolor: "rgba(239, 68, 68, 0.15)",
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.25)",
              },
            }}
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
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", py: 1 }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={NavLink}
                to={item.path}
                end={item.path === "/user"}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateX(4px)",
                  },
                  "&.active": {
                    backgroundColor: "rgba(59, 130, 246, 0.25)",
                    borderLeft: "3px solid #3b82f6",
                    "& .MuiListItemIcon-root": {
                      color: "#60a5fa",
                    },
                    "& .MuiListItemText-primary": {
                      color: "#93c5fd",
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#94a3b8",
                    minWidth: 40,
                    transition: "color 0.2s",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "#e2e8f0",
                  }}
                />
              </ListItemButton>
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
