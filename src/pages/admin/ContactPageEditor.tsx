import React, { useEffect, useState } from "react";
import { saveContactSettings, fetchContactSettings } from "../../api/cms-service";
import CMSToolbar from "../../components/cms/CMSToolbar";
import EditableText from "../../components/cms/EditableText";
import ContactForm from "../../components/forms/ContactForm";
import type { ContactFormValues } from "../../components/forms/ContactForm";
import { useCMS } from "../../contexts/CMSContext";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Container, Typography, Grid, Box, Link, Alert, Snackbar } from "@mui/material";

// Mock initial data
const defaultContactSettings = {
  pageTitle: "Contact",
  pageSubtitle: "Need help? See frequently asked questions",
  sectionTitle: "Contact Information",
  phone: "22 299 00 89",
  phoneHours: "Monday - Friday 9:00 AM - 7:00 PM",
  email: "orders@shop.pl",
  emailDescription: "Orders",
};

const ContactPageEditor: React.FC = () => {
  const { settings, setSettings, isDirty, setDirty, setEditMode } = useCMS();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialization - fetch data from API
  useEffect(() => {
    const initializeData = async () => {
      if (!isInitialized && !settings?.contactPage) {
        try {
          const data = await fetchContactSettings();
          setSettings({
            ...settings,
            hero: {
              title: "Welcome to E-COMMERCE",
              subtitle: "Discover the best products at the best prices",
              primaryButtonText: "Start Shopping",
              secondaryButtonText: "Learn More",
            },
            features: [],
            categories: [],
            categoriesTitle: "Popular Categories",
            categoriesSubtitle: "Discover our best product categories",
            footer: {
              shopName: "E-COMMERCE",
              shopDescription: "Shop description",
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
            contactPage: data,
          });
        } catch (error) {
          console.error("Failed to load contact data from CMS, using defaults:", error);
          setSettings({
            hero: {
              title: "Welcome to E-COMMERCE",
              subtitle: "Discover the best products at the best prices",
              primaryButtonText: "Start Shopping",
              secondaryButtonText: "Learn More",
            },
            features: [],
            categories: [],
            categoriesTitle: "Popular Categories",
            categoriesSubtitle: "Discover our best product categories",
            footer: {
              shopName: "E-COMMERCE",
              shopDescription: "Shop description",
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
        }
        setIsInitialized(true);
      }
    };

    initializeData();
  }, [isInitialized, settings, setSettings]);

  useEffect(() => {
    setEditMode(true);
    return () => setEditMode(false);
  }, [setEditMode]);

  const handleFormSubmit = (values: ContactFormValues) => {
    console.log("Form submitted:", values);
    alert("Form submitted successfully!");
  };

  const handleSave = async () => {
    if (!settings || !settings.contactPage) return;
    setIsSaving(true);
    try {
      // Konwertuj na ContactPageContent
      const contactSettingsData = {
        pageTitle: settings.contactPage.pageTitle,
        pageSubtitle: settings.contactPage.pageSubtitle,
        sectionTitle: settings.contactPage.sectionTitle,
        phone: settings.contactPage.phone,
        phoneHours: settings.contactPage.phoneHours,
        email: settings.contactPage.email,
        emailDescription: settings.contactPage.emailDescription,
      };

      // Save using the new endpoint
      await saveContactSettings(contactSettingsData);

      // Clear Contact cache so updated data is visible when returning to Contact page
      sessionStorage.removeItem("contact_cache");

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
                See frequently asked questions
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
            The contact form is not editable in edit mode. You can only edit informational texts and
            contact information.
          </Alert>
        </Container>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Changes have been saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          Error saving changes
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactPageEditor;
