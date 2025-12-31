import React, { useEffect, useState } from "react";
import { fetchFaqSettings } from "../api/cms-service";
import Accordion from "../components/common/Accordion";
import MainLayout from "../components/layout/MainLayout";
import type { FaqPageContent } from "../types/cms";
import { Box, Container, Link, Typography, CircularProgress } from "@mui/material";

// Default FAQ data (fallback)
const defaultFaqData = [
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

        // Check cache
        const cachedFaq = sessionStorage.getItem(CACHE_KEY_FAQ);
        let faqData: FaqPageContent | null = null;

        if (cachedFaq) {
          const parsed: CacheData<FaqPageContent> = JSON.parse(cachedFaq);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            faqData = parsed.data;
          }
        }

        // If there's no cache or cache is old, load from API
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
        // Fallback to default values
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
            {faqContent?.pageTitle || "Frequently Asked Questions"}
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
            {faqContent?.pageSubtitle || "Can't find the answer to your question?"}{" "}
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
