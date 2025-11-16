import React, { useEffect, useState } from "react";
import { fetchContactSettings } from "../api/cms-service";
import type { ContactPageContent } from "../types/cms";
import ContactForm from "../components/forms/ContactForm";
import type { ContactFormValues } from "../components/forms/ContactForm";
import MainLayout from "../components/layout/MainLayout";
import { Phone as PhoneIcon, Email as EmailIcon } from "@mui/icons-material";
import { Container, Typography, Grid, Box, Link, CircularProgress } from "@mui/material";

const Contact: React.FC = () => {
  const [contactContent, setContactContent] = useState<ContactPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContactContent = async () => {
      try {
        setIsLoading(true);
        const data = await fetchContactSettings();
        setContactContent(data);
      } catch (error) {
        console.error("Failed to load contact content from CMS:", error);
        // Fallback do domyślnych wartości
      } finally {
        setIsLoading(false);
      }
    };

    loadContactContent();
  }, []);

  const handleFormSubmit = (values: ContactFormValues) => {
    console.log("Form submitted:", values);
    alert("Formularz został wysłany pomyślnie!");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress size={60} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container sx={{ maxWidth: "50rem", margin: "0 auto", padding: "0 1.5rem" }}>
        <Box sx={{ textAlign: "center", mb: 6, pt: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "text.primary",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {contactContent?.pageTitle || "Kontakt"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: "1rem",
              color: "text.secondary",
              maxWidth: "50rem",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {contactContent?.pageSubtitle || "Potrzebujesz pomocy?"}{" "}
            <Link
              href="/faq"
              sx={{
                color: "primary.main",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Zobacz najczęściej zadawane pytania
            </Link>
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                boxShadow: 2,
                p: { xs: 3, sm: 4 },
                borderRadius: "0.5rem",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    fontWeight: "bold",
                    color: "text.primary",
                  }}
                >
                  {contactContent?.sectionTitle || "Dane kontaktowe"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PhoneIcon sx={{ fontSize: "1.5rem", color: "primary.main" }} />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "text.primary",
                        fontWeight: 500,
                      }}
                    >
                      {contactContent?.phone || "22 299 00 89"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                      {contactContent?.phoneHours || "Poniedziałek - Piątek 9:00 - 19:00"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon sx={{ fontSize: "1.5rem", color: "primary.main" }} />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "text.primary",
                        fontWeight: 500,
                      }}
                    >
                      {contactContent?.email || "zamowienia@sklep.pl"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                      {contactContent?.emailDescription || "Zamówienia"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <ContactForm onSubmit={handleFormSubmit} />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default Contact;
