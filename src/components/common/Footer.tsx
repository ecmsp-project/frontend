import React from "react";
import { Box, Typography, Container, Grid, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "background.paper", p: 6, mt: "auto" }} component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-evenly">
          <Grid item xs={12} sm={4} {...({ component: "div" } as any)}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              O Sklepie
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Wszystko co potrzebujesz w jednym miejscu. Jakość i niskie ceny.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={2} {...({ component: "div" } as any)}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Linki
            </Typography>
            <Link href="/about" variant="body2" color="text.secondary" display="block">
              O Nas
            </Link>
            <Link href="/contact" variant="body2" color="text.secondary" display="block">
              Kontakt
            </Link>
            <Link href="/faq" variant="body2" color="text.secondary" display="block">
              FAQ
            </Link>
          </Grid>

          <Grid item xs={6} sm={2} {...({ component: "div" } as any)}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Konto
            </Typography>
            <Link href="/login" variant="body2" color="text.secondary" display="block">
              Zaloguj się
            </Link>
            <Link href="/register" variant="body2" color="text.secondary" display="block">
              Zarejestruj
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="/">
              Twoja Nazwa Sklepu
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
