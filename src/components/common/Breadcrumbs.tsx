import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ mb: 3, py: 2 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: "text.secondary" }} />}
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-ol": {
            flexWrap: "nowrap",
          },
        }}
      >
        {/* Home link */}
        <Link
          component="button"
          onClick={() => handleClick("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "primary.main",
            cursor: "pointer",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
              color: "primary.dark",
            },
            transition: "all 0.2s",
          }}
        >
          <HomeIcon fontSize="small" />
          Strona główna
        </Link>

        {/* Dynamic breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast || !item.path) {
            return (
              <Typography
                key={index}
                sx={{
                  color: "text.primary",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              component="button"
              onClick={() => handleClick(item.path!)}
              sx={{
                color: "primary.main",
                cursor: "pointer",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                  color: "primary.dark",
                },
                transition: "all 0.2s",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
