import React from "react";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Box,
  TextareaAutosize,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().min(2, "Imię musi mieć co najmniej 2 znaki").required("Imię jest wymagane"),
  email: Yup.string().email("Nieprawidłowy format email").required("Email jest wymagany"),
  subject: Yup.string()
    .oneOf(["general", "support", "sales", "complaint", "other"], "Wybierz temat")
    .required("Temat jest wymagany"),
  message: Yup.string()
    .min(10, "Wiadomość musi mieć co najmniej 10 znaków")
    .required("Wiadomość jest wymagana"),
});

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

interface ContactFormProps {
  onSubmit: (values: ContactFormValues) => void;
  isSubmitting?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const handleSubmit = (values: ContactFormValues, { setSubmitting, resetForm }: any) => {
    onSubmit(values);

    setTimeout(() => {
      setSubmitting(false);
      resetForm();
    }, 1000);
  };

  return (
    <Box
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: "0.5rem",
        boxShadow: 2,
        height: "100%",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "1.5rem", sm: "1.75rem" },
          fontWeight: "bold",
          color: "text.primary",
          mb: 3,
        }}
      >
        Napisz do nas
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting: formikSubmitting, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: touched.name && errors.name ? "error.main" : "text.primary",
                    fontWeight: 500,
                  }}
                >
                  Imię*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  placeholder="Podaj imię"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.25rem",
                      backgroundColor: "background.paper",
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: touched.email && errors.email ? "error.main" : "text.primary",
                    fontWeight: 500,
                  }}
                >
                  E-mail*
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  placeholder="Podaj adres mailowy"
                  type="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.25rem",
                      backgroundColor: "background.paper",
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: touched.subject && errors.subject ? "error.main" : "text.primary",
                    fontWeight: 500,
                  }}
                >
                  Temat*
                </Typography>
                <FormControl fullWidth error={touched.subject && Boolean(errors.subject)}>
                  <Field
                    as={Select}
                    name="subject"
                    displayEmpty
                    sx={{
                      borderRadius: "0.25rem",
                      backgroundColor: "background.paper",
                    }}
                  >
                    <MenuItem value="" disabled>
                      Wybierz temat
                    </MenuItem>
                    <MenuItem value="general">Ogólne zapytanie</MenuItem>
                    <MenuItem value="support">Wsparcie techniczne</MenuItem>
                    <MenuItem value="sales">Sprzedaż</MenuItem>
                    <MenuItem value="complaint">Reklamacja</MenuItem>
                    <MenuItem value="other">Inne</MenuItem>
                  </Field>
                  {touched.subject && errors.subject && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      {errors.subject}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: touched.message && errors.message ? "error.main" : "text.primary",
                    fontWeight: 500,
                  }}
                >
                  Treść*
                </Typography>
                <Field
                  as={TextareaAutosize}
                  name="message"
                  placeholder="Wpisz treść wiadomości"
                  minRows={4}
                  maxRows={8}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${touched.message && errors.message ? "#d32f2f" : "#c4c4c4"}`,
                    backgroundColor: "background.paper",
                    fontSize: "0.875rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
                {touched.message && errors.message && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errors.message}
                  </Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={formikSubmitting || isSubmitting}
                  sx={{
                    backgroundColor: "primary.main",
                    borderRadius: "0.25rem",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "lowercase",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "&:disabled": {
                      backgroundColor: "grey.200",
                    },
                  }}
                >
                  {formikSubmitting || isSubmitting ? "wysyłanie..." : "wyślij"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ContactForm;
