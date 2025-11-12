import React, { useEffect, useState } from "react";
import { saveGlobalSettings } from "../../api/cms-service";
import CMSToolbar from "../../components/cms/CMSToolbar";
import EditableText from "../../components/cms/EditableText";
import ContactForm from "../../components/forms/ContactForm";
import type { ContactFormValues } from "../../components/forms/ContactForm";
import MainLayout from "../../components/layout/MainLayout";
import { useCMS } from "../../contexts/CMSContext";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Container, Typography, Grid, Box, Link, Alert, Snackbar } from "@mui/material";

// Mock initial data
const defaultContactSettings = {
  pageTitle: "Kontakt",
  pageSubtitle: "Potrzebujesz pomocy? Zobacz najczęściej zadawane pytania",
  sectionTitle: "Dane kontaktowe",
  phone: "22 299 00 89",
  phoneHours: "Poniedziałek - Piątek 9:00 - 19:00",
  email: "zamowienia@sklep.pl",
  emailDescription: "Zamówienia",
};

const ContactPageEditor: React.FC = () => {
  const { settings, setSettings, isDirty, setDirty, setEditMode } = useCMS();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setEditMode(true);
    if (!settings) {
      // Jeśli nie ma ustawień, zainicjuj z domyślnymi wartościami
      setSettings({
        hero: {
          title: "Witaj w E-COMMERCE",
          subtitle: "Odkryj najlepsze produkty w najlepszych cenach",
          primaryButtonText: "Rozpocznij Zakupy",
          secondaryButtonText: "Dowiedz Się Więcej",
        },
        features: [],
        categories: [],
        categoriesTitle: "Popularne Kategorie",
        categoriesSubtitle: "Odkryj nasze najlepsze kategorie produktów",
        footer: {
          shopName: "E-COMMERCE",
          shopDescription: "Opis sklepu",
          customerServiceHours: [],
          customerServicePhone: "",
          socialMedia: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
          },
          copyrightText: "",
        },
        headerShopName: "E-COMMERCE",
        contactPage: defaultContactSettings,
      });
    } else if (!settings.contactPage) {
      // Jeśli są ustawienia ale brak contactPage
      setSettings({
        ...settings,
        contactPage: defaultContactSettings,
      });
    }
    return () => setEditMode(false);
  }, [setEditMode, settings, setSettings]);

  const handleFormSubmit = (values: ContactFormValues) => {
    console.log("Form submitted:", values);
    alert("Formularz został wysłany pomyślnie!");
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await saveGlobalSettings(settings);
      setDirty(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving settings:", error);
      setShowError(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings || !settings.contactPage) return null;

  return (
    <>
      <CMSToolbar onSave={handleSave} isDirty={isDirty} isSaving={isSaving} />

      <MainLayout>
        <Box sx={{ pt: 16 }}>
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
                <EditableText
                  value={settings.contactPage.pageTitle}
                  onChange={(value) => {
                    setSettings({
                      ...settings,
                      contactPage: { ...settings.contactPage, pageTitle: value },
                    });
                    setDirty(true);
                  }}
                  isEditMode={true}
                />
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
                <EditableText
                  value={settings.contactPage.pageSubtitle}
                  onChange={(value) => {
                    setSettings({
                      ...settings,
                      contactPage: { ...settings.contactPage, pageSubtitle: value },
                    });
                    setDirty(true);
                  }}
                  multiline
                  isEditMode={true}
                />{" "}
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
                      <EditableText
                        value={settings.contactPage.sectionTitle}
                        onChange={(value) => {
                          setSettings({
                            ...settings,
                            contactPage: { ...settings.contactPage, sectionTitle: value },
                          });
                          setDirty(true);
                        }}
                        isEditMode={true}
                      />
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
                          <EditableText
                            value={settings.contactPage.phone}
                            onChange={(value) => {
                              setSettings({
                                ...settings,
                                contactPage: { ...settings.contactPage, phone: value },
                              });
                              setDirty(true);
                            }}
                            isEditMode={true}
                          />
                        </Typography>
                        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                          <EditableText
                            value={settings.contactPage.phoneHours}
                            onChange={(value) => {
                              setSettings({
                                ...settings,
                                contactPage: { ...settings.contactPage, phoneHours: value },
                              });
                              setDirty(true);
                            }}
                            isEditMode={true}
                          />
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
                          <EditableText
                            value={settings.contactPage.email}
                            onChange={(value) => {
                              setSettings({
                                ...settings,
                                contactPage: { ...settings.contactPage, email: value },
                              });
                              setDirty(true);
                            }}
                            isEditMode={true}
                          />
                        </Typography>
                        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                          <EditableText
                            value={settings.contactPage.emailDescription}
                            onChange={(value) => {
                              setSettings({
                                ...settings,
                                contactPage: { ...settings.contactPage, emailDescription: value },
                              });
                              setDirty(true);
                            }}
                            isEditMode={true}
                          />
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

            <Alert severity="info" sx={{ mb: 3 }}>
              Formularz kontaktowy nie jest edytowalny w trybie edycji. Możesz edytować tylko
              teksty informacyjne i dane kontaktowe.
            </Alert>
          </Container>
        </Box>
      </MainLayout>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Zmiany zostały zapisane pomyślnie!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          Błąd podczas zapisywania zmian
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactPageEditor;
