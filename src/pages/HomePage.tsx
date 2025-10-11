import React from "react";
import MainLayout from "../components/layout/MainLayout.tsx";
import { Typography, Container, Grid, Card, CardContent, CardMedia } from "@mui/material";

const categories = [
  {
    id: 1,
    name: "Elektronika",
    image: "https://via.placeholder.com/300x200?text=Elektronika",
  },
  {
    id: 2,
    name: "Ubrania",
    image: "https://via.placeholder.com/300x200?text=Ubrania",
  },
  {
    id: 3,
    name: "Kosmetyki",
    image: "https://via.placeholder.com/300x200?text=Kosmetyki",
  },
  {
    id: 4,
    name: "Dom i Ogród",
    image: "https://via.placeholder.com/300x200?text=Dom+i+Ogród",
  },
  {
    id: 5,
    name: "Sport",
    image: "https://via.placeholder.com/300x200?text=Sport",
  },
  {
    id: 6,
    name: "Książki",
    image: "https://via.placeholder.com/300x200?text=Książki",
  },
];

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mt: 4, mb: 4, fontWeight: 300 }}
        >
          Witaj w Naszym Sklepie!
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Popularne Kategorie
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={category.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => console.log(`Przejdź do kategorii: ${category.name}`)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div" align="center">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default HomePage;
