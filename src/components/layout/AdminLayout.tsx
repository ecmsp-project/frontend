import React, { useMemo, useState } from "react";
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
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import StoreIcon from "@mui/icons-material/Store";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
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
  Collapse,
  Divider,
} from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 260;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  requiredPermissions?: Permission[];
  children?: MenuItem[];
}

const allMenuItems: MenuItem[] = [
  {
    text: "Pulpit",
    icon: <DashboardIcon />,
    path: "/admin"
  },
  {
    text: "Użytkownicy",
    icon: <AdminPanelSettingsIcon />,
    children: [
      {
        text: "Zarządzanie Użytkownikami",
        icon: <PeopleIcon />,
        path: "/admin/users",
        requiredPermissions: [PERMISSIONS.READ_USERS, PERMISSIONS.MANAGE_USERS],
      },
      {
        text: "Zarządzanie Rolami",
        icon: <AdminPanelSettingsIcon />,
        path: "/admin/roles",
        requiredPermissions: [PERMISSIONS.MANAGE_ROLES],
      },
    ],
  },
  {
    text: "Sklep",
    icon: <StoreIcon />,
    children: [
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
    ],
  },
  {
    text: "Analytics",
    icon: <AnalyticsIcon />,
    children: [
      {
        text: "Statystyki Sprzedaży",
        icon: <BarChartIcon />,
        path: "/admin/analytics/sales",
      },
      {
        text: "Raporty",
        icon: <AssessmentIcon />,
        path: "/admin/analytics/reports",
      },
      {
        text: "Analiza Produktów",
        icon: <InventoryIcon />,
        path: "/admin/analytics/products",
      },
    ],
  },
];

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, logout, hasAnyPermission } = useIndividualUser();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Użytkownicy: false,
    Sklep: false,
    Analytics: false,
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleToggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const filterVisibleItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .map((item) => {
        if (item.children) {
          const visibleChildren = filterVisibleItems(item.children);
          return visibleChildren.length > 0 ? { ...item, children: visibleChildren } : null;
        }
        if (!item.requiredPermissions) {
          return item;
        }
        return hasAnyPermission(item.requiredPermissions) ? item : null;
      })
      .filter((item): item is MenuItem => item !== null);
  };

  const visibleMenuItems = useMemo(() => {
    return filterVisibleItems(allMenuItems);
  }, [hasAnyPermission]);

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
            Panel Administracyjny E-COMMERCE
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
            {visibleMenuItems.map((item, index) => {
              if (item.children) {
                return (
                  <React.Fragment key={item.text}>
                    <ListItemButton
                      onClick={() => handleToggleSection(item.text)}
                      sx={{
                        mx: 1,
                        borderRadius: 2,
                        mb: 0.5,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          transform: "translateX(4px)",
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
                      {openSections[item.text] ? (
                        <ExpandLess
                          sx={{
                            color: "#60a5fa",
                            transition: "transform 0.3s",
                            transform: "rotate(180deg)",
                          }}
                        />
                      ) : (
                        <ExpandMore
                          sx={{
                            color: "#94a3b8",
                            transition: "transform 0.3s",
                          }}
                        />
                      )}
                    </ListItemButton>
                    <Collapse in={openSections[item.text]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((child) => (
                          <ListItemButton
                            key={child.text}
                            component={NavLink}
                            to={child.path!}
                            sx={{
                              pl: 4,
                              mx: 1,
                              borderRadius: 2,
                              mb: 0.5,
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                transform: "translateX(4px)",
                              },
                              "&.active": {
                                backgroundColor: "rgba(59, 130, 246, 0.2)",
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
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.text}
                              primaryTypographyProps={{
                                fontSize: "0.875rem",
                                color: "#cbd5e1",
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                    {index < visibleMenuItems.length - 1 && (
                      <Divider sx={{ my: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
                    )}
                  </React.Fragment>
                );
              }

              return (
                <ListItemButton
                  key={item.text}
                  component={NavLink}
                  to={item.path!}
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
              );
            })}
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
