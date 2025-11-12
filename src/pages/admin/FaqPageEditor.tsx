import React, { useEffect, useState } from "react";
import { saveGlobalSettings } from "../../api/cms-service";
import Accordion from "../../components/common/Accordion";
import CMSToolbar from "../../components/cms/CMSToolbar";
import EditableText from "../../components/cms/EditableText";
import MainLayout from "../../components/layout/MainLayout";
import { useCMS } from "../../contexts/CMSContext";
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
import type { FaqItem } from "../../types/cms";

const defaultFaqSettings = {
  pageTitle: "Najczęściej zadawane pytania",
  pageSubtitle: "Nie mozesz znalezc odpowiedzi na swoje pytanie?",
  faqItems: [
    {
      id: "faq1",
      question: "Jak mogę złożyć zamówienie?",
      answer:
        "Złożenie zamówienia jest bardzo proste! Wybierz interesujące Cię produkty, dodaj je do koszyka, przejdź do kasy i wypełnij formularz z danymi dostawy. Następnie wybierz metodę płatności i potwierdź zamówienie. Otrzymasz e-mail z potwierdzeniem zamówienia.",
      expanded: true,
    },
    {
      id: "faq2",
      question: "Jakie metody płatności akceptujecie?",
      answer:
        "Akceptujemy płatności kartą płatniczą (Visa, Mastercard), przelewem bankowym, płatności online (BLIK, Przelewy24), a także płatność przy odbiorze (za pobraniem). Wszystkie płatności są bezpieczne i szyfrowane.",
    },
    {
      id: "faq3",
      question: "Ile kosztuje dostawa?",
      answer:
        "Dostawa jest darmowa przy zamówieniach powyżej 200 zł. Dla zamówień poniżej tej kwoty koszt dostawy wynosi 15 zł. Oferujemy również dostawę kurierem ekspresową za 25 zł oraz odbiór osobisty w naszym sklepie stacjonarnym za darmo.",
    },
    {
      id: "faq4",
      question: "Jak mogę skontaktować się z obsługą klienta?",
      answer:
        "Możesz skontaktować się z nami przez e-mail (sklep@naszasklep.pl), telefon (123-456-789) lub czat na stronie. Nasza obsługa klienta jest dostępna od poniedziałku do piątku w godzinach 9:00-17:00. Odpowiadamy na wiadomości w ciągu 24 godzin.",
    },
  ],
};

const FaqPageEditor: React.FC = () => {
  const { settings, setSettings, isDirty, setDirty, setEditMode } = useCMS();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setEditMode(true);
    if (!settings) {
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
    } else if (!settings.faqPage) {
      setSettings({
        ...settings,
        faqPage: defaultFaqSettings,
      });
    }
    return () => setEditMode(false);
  }, [setEditMode, settings, setSettings]);

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
      answer: "Nowa odpowiedź",
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

      <MainLayout>
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
                  Skontaktuj się z nami!
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
                    Dodaj Pytanie
                  </Typography>
                </Box>
              </Card>
            </Box>
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

export default FaqPageEditor;
