import React, { useEffect, useRef, useState } from "react";
import image1 from "../assets/1.png";
import image2 from "../assets/2.png";
import image3 from "../assets/3.png";
import Gallery from "../components/common/Gallery";
import MainLayout from "../components/layout/MainLayout.tsx";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Divider,
  Rating,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";

const mockProductImages = [image1, image2, image3];
const mockProduct = {
  name: 'Smartfon SAMSUNG Galaxy A16 4/128GB 6.7" 90Hz Szary',
  price: 499.0,
  rating: 4.93,
  reviews: 87,
  soldLast: 387,
  seller: "ELECTROpl",
  sellerRating: 98.6,
  variants: {
    memory: ["128 GB", "256 GB"],
    ram: ["4 GB", "8 GB"],
    color: ["czarny", "szary", "wielokolorowy", "zielony"],
  },
  parameters: [
    { key: "Stan", value: "Nowy" },
    { key: "Faktura", value: "Wystawiam fakturę VAT" },
    { key: "Kod producenta", value: "SM-A165FzDEUB" },
    { key: "Marka telefonu", value: "Samsung" },
    { key: "Model telefonu", value: "Galaxy A16" },
    { key: "Typ", value: "Smartfon" },
    { key: "EAN (GTIN)", value: "8806095822846" },
    { key: "Obsługa ładowania bezprzewodowego", value: "nie" },
  ],
  descriptionPoints: [
    "Lampa LED: Tak",
    "Wersja systemu: Android 14",
    "Smartfon ASUS: Nie",
    "Pamięć RAM: 4 GB",
    "Pamięć wbudowana (GB): 128",
    "Dual SIM: Tak",
    "Standard karty SIM: Nano SIM",
    "Pojemność akumulatora (mAh): 5000",
    "Komunikacja: Wi-Fi, NFC, Bluetooth 5.3, USB typ C",
    "Procesor: MediaTek Helio G99, Ośmiordzeniowy",
    'Wyświetlacz: 6.7", 2340 x 1080px, Super AMOLED',
    "Aparat: Tylny 50 Mpx + 5 Mpx + 2 Mpx, Przedni 13 Mpx",
  ],
  otherOffers: [
    { price: 250.0, condition: "Najtańsze - Z drugiej ręki", isSmart: true },
    { price: 499.0, condition: "Najszybciej", isSmart: true },
  ],
};

const ProductPage: React.FC = () => {
  const [selectedMemory, setSelectedMemory] = useState("128 GB");
  const [selectedRam, setSelectedRam] = useState("4 GB");
  const [selectedColor, setSelectedColor] = useState("szary");
  const [quantity, setQuantity] = useState(1);

  const leftRef = useRef<HTMLDivElement | null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const syncHeights = () => {
      const left = leftRef.current;
      const sidebarWrapper = sidebarWrapperRef.current;
      if (left && sidebarWrapper) {
        sidebarWrapper.style.minHeight = `${left.offsetHeight}px`;
      }
    };
    syncHeights();
    window.addEventListener("resize", syncHeights);
    setTimeout(syncHeights, 500);
    return () => window.removeEventListener("resize", syncHeights);
  }, []);

  return (
    <MainLayout>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 },
          py: 4,
          width: "100%",
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
          E-COMMERCE / Elektronika / Smartfony / Samsung / Galaxy A16
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, sm: 4, md: 6 }}
          alignItems="flex-start"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.5fr) minmax(300px, 0.8fr)",
              lg: "minmax(0, 1.8fr) minmax(350px, 0.9fr)",
              xl: "minmax(0, 2fr) minmax(400px, 1fr)",
            },
            gap: theme.spacing(5),
          }}
        >
          {/* LEFT COLUMN */}
          <Box ref={leftRef}>
            <Gallery images={mockProductImages} />
            <Divider sx={{ my: 4 }} />

            <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Parametry
              </Typography>
              <List dense sx={{ maxWidth: 600 }}>
                {mockProduct.parameters.map((p) => (
                  <React.Fragment key={p.key}>
                    <ListItem disablePadding>
                      <ListItemText
                        primary={p.key}
                        secondary={p.value}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontWeight: 500,
                            width: "40%",
                            display: "inline-block",
                          },
                          "& .MuiListItemText-secondary": {
                            width: "60%",
                            display: "inline-block",
                            ml: 2,
                          },
                        }}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Opis produktu
              </Typography>
              <List dense>
                {mockProduct.descriptionPoints.map((point, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText primary={`• ${point}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Opinie o produkcie
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" fontWeight={700} color="secondary.main">
                  {mockProduct.rating.toFixed(2)}
                </Typography>
                <Rating value={mockProduct.rating} readOnly precision={0.01} sx={{ ml: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                  ({mockProduct.reviews} opinii)
                </Typography>
              </Box>
              <Button variant="outlined">ZOBACZ WIĘCEJ OPINII</Button>
            </Paper>
          </Box>

          {/* RIGHT COLUMN */}
          <Box ref={sidebarWrapperRef} sx={{ position: "relative" }}>
            <Box
              sx={{
                position: { xs: "static", md: "sticky" },
                top: 60,
                height: "fit-content",
                zIndex: 5,
              }}
            >
              <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  {mockProduct.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating value={mockProduct.rating} readOnly precision={0.01} size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {mockProduct.reviews} ocen | {mockProduct.soldLast} osób kupiło ostatnio
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h4" color="primary.main" fontWeight={700} sx={{ mb: 1 }}>
                  {mockProduct.price.toFixed(2)} zł
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                  Gwarancja najniższej ceny
                </Typography>

                <Typography variant="subtitle2" fontWeight={600}>
                  Wbudowana pamięć
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={selectedMemory}
                  onChange={(_, val) => val && setSelectedMemory(val)}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  {mockProduct.variants.memory.map((v) => (
                    <ToggleButton key={v} value={v}>
                      {v}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                <Typography variant="subtitle2" fontWeight={600}>
                  Pamięć RAM
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={selectedRam}
                  onChange={(_, val) => val && setSelectedRam(val)}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  {mockProduct.variants.ram.map((v) => (
                    <ToggleButton key={v} value={v}>
                      {v}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                <Typography variant="subtitle2" fontWeight={600}>
                  Kolor
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={selectedColor}
                  onChange={(_, val) => val && setSelectedColor(val)}
                  size="small"
                  sx={{ mb: 3 }}
                >
                  {mockProduct.variants.color.map((v) => (
                    <ToggleButton key={v} value={v}>
                      {v}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                {/* Ilość */}
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Liczba sztuk
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    sx={{ border: "1px solid #ccc" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      mx: 1,
                      width: 40,
                      textAlign: "center",
                      border: "1px solid #ccc",
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    sx={{ border: "1px solid #ccc" }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    mb: 1,
                    bgcolor: "#ff6600",
                    "&:hover": { bgcolor: "#e65c00" },
                  }}
                >
                  DODAJ DO KOSZYKA
                </Button>
                <Button variant="contained" color="primary" fullWidth size="large">
                  KUP I ZAPŁAĆ
                </Button>
              </Paper>
            </Box>
          </Box>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default ProductPage;
