import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0070f3",
      light: "#42a5f5",
      dark: "#004fba",
    },
    secondary: {
      main: "#ff6600",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    grey: {
      50: "#f8f9fa",
      100: "#f1f3f4",
      200: "#e9ecef",
    },
  },
  typography: {
    fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export default theme;
