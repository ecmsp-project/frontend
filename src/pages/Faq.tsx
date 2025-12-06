import React, { useEffect, useState } from "react";
import { fetchFaqSettings } from "../api/cms-service";
import Accordion from "../components/common/Accordion";
import MainLayout from "../components/layout/MainLayout";
import type { FaqPageContent } from "../types/cms";
import { Box, Container, Link, Typography, CircularProgress } from "@mui/material";

// Domyślne dane FAQ (fallback)
const defaultFaqData = [
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
];

const CACHE_KEY_FAQ = "faq_cache";
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheData<T> {
  data: T;
  timestamp: number;
}

const Faq: React.FC = () => {
  const [faqContent, setFaqContent] = useState<FaqPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFaqContent = async () => {
      try {
        setIsLoading(true);

        // Sprawdź cache
        const cachedFaq = sessionStorage.getItem(CACHE_KEY_FAQ);
        let faqData: FaqPageContent | null = null;

        if (cachedFaq) {
          const parsed: CacheData<FaqPageContent> = JSON.parse(cachedFaq);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            faqData = parsed.data;
          }
        }

        // Jeśli nie ma cache lub cache jest stary, załaduj z API
        if (!faqData) {
          faqData = await fetchFaqSettings();
          sessionStorage.setItem(
            CACHE_KEY_FAQ,
            JSON.stringify({ data: faqData, timestamp: Date.now() } as CacheData<FaqPageContent>),
          );
        }

        setFaqContent(faqData);
      } catch (error) {
        console.error("Failed to load FAQ content from CMS:", error);
        // Fallback do domyślnych wartości
      } finally {
        setIsLoading(false);
      }
    };

    loadFaqContent();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </MainLayout>
    );
  }

  const displayFaqItems = faqContent?.faqItems || defaultFaqData;

  return (
    <MainLayout>
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
            {faqContent?.pageTitle || "Najczęściej zadawane pytania"}
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
            {faqContent?.pageSubtitle || "Nie mozesz znalezc odpowiedzi na swoje pytanie?"}{" "}
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
          {displayFaqItems.map((faq, index) => (
            <Accordion
              key={faq.id || index}
              title={faq.question}
              content={faq.answer}
              defaultExpanded={faq.expanded}
            />
          ))}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Faq;
