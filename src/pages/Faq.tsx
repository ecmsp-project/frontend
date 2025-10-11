import React from "react";
import Accordion from "../components/common/Accordion";
import MainLayout from "../components/layout/MainLayout";
import { Box, Container, Link, Typography } from "@mui/material";

const Faq: React.FC = () => {
  const faqData = [
    {
      question: "Jak mogę złożyć zamówienie?",
      answer:
        "Złożenie zamówienia jest bardzo proste! Wybierz interesujące Cię produkty, dodaj je do koszyka, przejdź do kasy i wypełnij formularz z danymi dostawy. Następnie wybierz metodę płatności i potwierdź zamówienie. Otrzymasz e-mail z potwierdzeniem zamówienia.",
      expanded: true,
    },
    {
      question: "Jakie metody płatności akceptujecie?",
      answer:
        "Akceptujemy płatności kartą płatniczą (Visa, Mastercard), przelewem bankowym, płatności online (BLIK, Przelewy24), a także płatność przy odbiorze (za pobraniem). Wszystkie płatności są bezpieczne i szyfrowane.",
    },
    {
      question: "Ile kosztuje dostawa?",
      answer:
        "Dostawa jest darmowa przy zamówieniach powyżej 200 zł. Dla zamówień poniżej tej kwoty koszt dostawy wynosi 15 zł. Oferujemy również dostawę kurierem ekspresową za 25 zł oraz odbiór osobisty w naszym sklepie stacjonarnym za darmo.",
    },
    {
      question: "Jak mogę skontaktować się z obsługą klienta?",
      answer:
        "Możesz skontaktować się z nami przez e-mail (sklep@naszasklep.pl), telefon (123-456-789) lub czat na stronie. Nasza obsługa klienta jest dostępna od poniedziałku do piątku w godzinach 9:00-17:00. Odpowiadamy na wiadomości w ciągu 24 godzin.",
    },
  ];

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
            Najczęściej zadawane pytania
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
            Nie mozesz znalezc odpowiedzi na swoje pytanie?{" "}
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
          {faqData.map((faq, index) => (
            <Accordion
              key={index}
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
