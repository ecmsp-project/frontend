import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import EditIcon from "@mui/icons-material/Edit";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WebIcon from "@mui/icons-material/Web";
import {
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CMSPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs
            items={[
              { label: "Admin Panel", path: "/admin" },
              { label: "Shop" },
              { label: "Page Content Management" },
            ]}
          />
          <Typography variant="h4" gutterBottom>
            Page Content Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit website content in a simple way
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      borderRadius: "50%",
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <WebIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Home Page
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Edit hero section, tiles and categories
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Customize the home page appearance: texts, images, feature tiles and displayed
                  product categories.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={() => navigate("/admin/cms/home/edit")}
                  sx={{ textTransform: "none", py: 1 }}
                >
                  Edit Home Page
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "secondary.light",
                      color: "secondary.contrastText",
                      borderRadius: "50%",
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <WebIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Contact Page
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Edit contact information
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Update contact information: address, phone, email and customer service office
                  hours.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={() => navigate("/admin/cms/contact/edit")}
                  sx={{ textTransform: "none", py: 1 }}
                >
                  Edit Contact Page
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "success.light",
                      color: "success.contrastText",
                      borderRadius: "50%",
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <HelpOutlineIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      FAQ Page
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Edit frequently asked questions
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Manage questions and answers: add, edit and delete questions from the FAQ section.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={() => navigate("/admin/cms/faq/edit")}
                  sx={{ textTransform: "none", py: 1 }}
                >
                  Edit FAQ Page
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Paper
          elevation={1}
          sx={{ p: 3, mt: 4, bgcolor: "info.light", color: "info.contrastText" }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Instructions
          </Typography>
          <Typography variant="body2">
            • Click on text to edit it
            <br />
            • Use editing tools to change font size and formatting
            <br />
            • Tiles can be removed by clicking the X in the top right corner
            <br />
            • Add new tiles by clicking the "+ Add" button
            <br />• Remember to save changes before leaving the page
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default CMSPage;
