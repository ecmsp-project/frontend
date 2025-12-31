import React, { useEffect, useState } from "react";
import { fetchHomeSettings } from "../../api/cms-service";
import type { HomePageContent } from "../../types/cms";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, Typography, Container, Grid, Link, IconButton, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [footerData, setFooterData] = useState<HomePageContent | null>(null);

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const data = await fetchHomeSettings();
        setFooterData(data);
      } catch (error) {
        console.error("Failed to load footer data:", error);
        // Use default values if error
      }
    };

    loadFooterData();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "white",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight={700}
              sx={{
                fontFamily: "monospace",
                letterSpacing: ".1rem",
                mb: 2,
              }}
            >
              {footerData?.footer?.shopName || "E-COMMERCE"}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, lineHeight: 1.7 }}>
              {footerData?.footer?.shopDescription ||
                "Everything you need in one place. Quality, low prices and fast delivery. Your shopping, our passion."}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
              {footerData?.footer?.socialMedia?.facebook && (
                <IconButton
                  size="small"
                  component="a"
                  href={footerData.footer.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s",
                  }}
                  aria-label="Facebook"
                >
                  <FacebookIcon fontSize="small" />
                </IconButton>
              )}
              {footerData?.footer?.socialMedia?.twitter && (
                <IconButton
                  size="small"
                  component="a"
                  href={footerData.footer.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s",
                  }}
                  aria-label="Twitter"
                >
                  <TwitterIcon fontSize="small" />
                </IconButton>
              )}
              {footerData?.footer?.socialMedia?.instagram && (
                <IconButton
                  size="small"
                  component="a"
                  href={footerData.footer.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s",
                  }}
                  aria-label="Instagram"
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
              )}
              {footerData?.footer?.socialMedia?.linkedin && (
                <IconButton
                  size="small"
                  component="a"
                  href={footerData.footer.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s",
                  }}
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Grid>

          {/* Shop Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
              Shop
            </Typography>
            <Link
              component="button"
              onClick={() => handleNavigation("/")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Home
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/search")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Categories
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/cart")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Cart
            </Link>
          </Grid>

          {/* Account Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
              Account
            </Typography>
            <Link
              component="button"
              onClick={() => handleNavigation("/user")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              My Account
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/user/orders")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              My Orders
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/login")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Log In
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/register")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Sign Up
            </Link>
          </Grid>

          {/* Info Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
              Information
            </Typography>
            <Link
              component="button"
              onClick={() => handleNavigation("/contact")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Contact
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/faq")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              FAQ
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/privacy")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/terms")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                display: "block",
                mb: 1,
                textAlign: "left",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Terms
            </Link>
          </Grid>

          {/* Customer Service */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
              Customer Service
            </Typography>
            {footerData?.footer?.customerServiceHours?.map((hours, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                {hours}
              </Typography>
            )) || (
              <>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  Pon-Pt: 8:00 - 20:00
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  Sob: 9:00 - 17:00
                </Typography>
              </>
            )}
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Tel: {footerData?.footer?.customerServicePhone || "+48 123 456 789"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {footerData?.footer?.copyrightText ||
              `© ${new Date().getFullYear()} E-COMMERCE. All rights reserved.`}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              component="button"
              onClick={() => handleNavigation("/privacy")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Privacy
            </Link>
            <Link
              component="button"
              onClick={() => handleNavigation("/terms")}
              variant="body2"
              sx={{
                color: "white",
                opacity: 0.9,
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  opacity: 1,
                  textDecoration: "underline",
                },
              }}
            >
              Terms
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
