import React, { useEffect, useState } from "react";
import { saveFaqSettings, fetchFaqSettings } from "../../api/cms-service";
import CMSToolbar from "../../components/cms/CMSToolbar";
import EditableText from "../../components/cms/EditableText";
import Accordion from "../../components/common/Accordion";
import { useCMS } from "../../contexts/CMSContext";
import type { FaqItem } from "../../types/cms";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Container,
  Link,
  Typography,
  Card,
  IconButton,
  Alert,
  Snackbar,
  alpha,
} from "@mui/material";

const defaultFaqSettings = {
  pageTitle: "Frequently Asked Questions",
  pageSubtitle: "Can't find the answer to your question?",
  faqItems: [
    {
      id: "faq1",
      question: "How can I place an order?",
      answer:
        "Placing an order is very simple! Select the products you're interested in, add them to your cart, proceed to checkout and fill out the delivery information form. Then choose your payment method and confirm the order. You will receive an email confirmation of your order.",
      expanded: true,
    },
    {
      id: "faq2",
      question: "What payment methods do you accept?",
      answer:
        "We accept credit card payments (Visa, Mastercard), bank transfers, online payments (BLIK, Przelewy24), as well as cash on delivery. All payments are secure and encrypted.",
    },
    {
      id: "faq3",
      question: "How much does shipping cost?",
      answer:
        "Shipping is free for orders over 200 PLN. For orders below this amount, shipping costs 15 PLN. We also offer express courier delivery for 25 PLN and free in-store pickup at our physical store.",
    },
    {
      id: "faq4",
      question: "How can I contact customer service?",
      answer:
        "You can contact us by email (shop@ourshop.pl), phone (123-456-789) or chat on the website. Our customer service is available Monday through Friday from 9:00 AM to 5:00 PM. We respond to messages within 24 hours.",
    },
  ],
};

const FaqPageEditor: React.FC = () => {
  const { settings, setSettings, isDirty, setDirty, setEditMode } = useCMS();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicjalizacja - pobierz dane z API
  useEffect(() => {
    const initializeData = async () => {
      if (!isInitialized && !settings?.faqPage) {
        try {
          const data = await fetchFaqSettings();
          setSettings({
            ...settings,
            hero: {
              title: "Witaj w E-COMMERCE",
              subtitle: "Odkryj najlepsze produkty w najlepszych cenach",
              primaryButtonText: "Rozpocznij Zakupy",
              secondaryButtonText: "Learn More",
            },
            features: [],
            categories: [],
            categoriesTitle: "Popularne Kategorie",
            categoriesSubtitle: "Discover our best product categories",
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
            contactPage: {
              pageTitle: "Kontakt",
              pageSubtitle: "Potrzebujesz pomocy?",
              sectionTitle: "Dane kontaktowe",
              phone: "",
              phoneHours: "",
              email: "",
              emailDescription: "",
            },
            faqPage: data,
          });
        } catch (error) {
          console.error("Failed to load FAQ data from CMS, using defaults:", error);
          setSettings({
            hero: {
              title: "Witaj w E-COMMERCE",
              subtitle: "Odkryj najlepsze produkty w najlepszych cenach",
              primaryButtonText: "Rozpocznij Zakupy",
              secondaryButtonText: "Learn More",
            },
            features: [],
            categories: [],
            categoriesTitle: "Popularne Kategorie",
            categoriesSubtitle: "Discover our best product categories",
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
            contactPage: {
              pageTitle: "Kontakt",
              pageSubtitle: "Potrzebujesz pomocy?",
              sectionTitle: "Dane kontaktowe",
              phone: "",
              phoneHours: "",
              email: "",
              emailDescription: "",
            },
            faqPage: defaultFaqSettings,
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

  const handleSave = async () => {
    if (!settings || !settings.faqPage) return;
    setIsSaving(true);
    try {
      // Konwertuj na FaqPageContent
      const faqSettings = {
        pageTitle: settings.faqPage.pageTitle,
        pageSubtitle: settings.faqPage.pageSubtitle,
        faqItems: settings.faqPage.faqItems,
      };

      // Save using the new endpoint
      await saveFaqSettings(faqSettings);

      // Clear FAQ cache so updated data is visible when returning to FAQ page
      sessionStorage.removeItem("faq_cache");

      setDirty(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving settings:", error);
      setShowError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFaq = (index: number) => {
    if (!settings?.faqPage) return;
    const newFaqItems = settings.faqPage.faqItems.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      faqPage: { ...settings.faqPage, faqItems: newFaqItems },
    });
    setDirty(true);
  };

  const handleAddFaq = () => {
    if (!settings?.faqPage) return;
    const newFaqItem: FaqItem = {
      id: `faq${Date.now()}`,
      question: "Nowe pytanie",
      answer: "New answer",
    };
    setSettings({
      ...settings,
      faqPage: {
        ...settings.faqPage,
        faqItems: [...settings.faqPage.faqItems, newFaqItem],
      },
    });
    setDirty(true);
  };

  if (!settings || !settings.faqPage) return null;

  return (
    <>
      <CMSToolbar onSave={handleSave} isDirty={isDirty} isSaving={isSaving} />

      <Box sx={{ pt: 16 }}>
        <Container
          sx={{
            maxWidth: "50rem",
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
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
                value={settings.faqPage.pageTitle}
                onChange={(value) => {
                  setSettings({
                    ...settings,
                    faqPage: { ...settings.faqPage!, pageTitle: value },
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
                maxWidth: "37.5rem",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              <EditableText
                value={settings.faqPage.pageSubtitle}
                onChange={(value) => {
                  setSettings({
                    ...settings,
                    faqPage: { ...settings.faqPage!, pageSubtitle: value },
                  });
                  setDirty(true);
                }}
                multiline
                isEditMode={true}
              />{" "}
              <Link
                href="/contact"
                sx={{
                  color: "primary.main",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Contact us!
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            {settings.faqPage.faqItems.map((faq, index) => (
              <Box key={faq.id} sx={{ position: "relative", mb: 2 }}>
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    bgcolor: "error.main",
                    color: "white",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                  onClick={() => handleDeleteFaq(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <Accordion
                  title={
                    <EditableText
                      value={faq.question}
                      onChange={(value) => {
                        const newFaqItems = [...settings.faqPage!.faqItems];
                        newFaqItems[index] = { ...newFaqItems[index], question: value };
                        setSettings({
                          ...settings,
                          faqPage: { ...settings.faqPage!, faqItems: newFaqItems },
                        });
                        setDirty(true);
                      }}
                      isEditMode={true}
                    />
                  }
                  content={
                    <EditableText
                      value={faq.answer}
                      onChange={(value) => {
                        const newFaqItems = [...settings.faqPage!.faqItems];
                        newFaqItems[index] = { ...newFaqItems[index], answer: value };
                        setSettings({
                          ...settings,
                          faqPage: { ...settings.faqPage!, faqItems: newFaqItems },
                        });
                        setDirty(true);
                      }}
                      multiline
                      isEditMode={true}
                    />
                  }
                  defaultExpanded={faq.expanded}
                />
              </Box>
            ))}

            {/* Przycisk dodawania nowego FAQ */}
            <Card
              elevation={0}
              sx={{
                textAlign: "center",
                p: 3,
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
                border: "2px dashed",
                borderColor: "success.main",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 100,
                mt: 2,
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                },
              }}
              onClick={handleAddFaq}
            >
              <Box>
                <AddIcon sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
                <Typography variant="h6" color="success.main">
                  Add Question
                </Typography>
              </Box>
            </Card>
          </Box>
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

export default FaqPageEditor;
