import React from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import type { ProductCreateRequestDTO } from '../../types/products';

export type ProductFormValues = ProductCreateRequestDTO;

const initialProductValues: ProductFormValues = {
    name: '',
    categoryId: '',
    approximatePrice: 0,
    deliveryPrice: 0,
    description: '',
    info: {},
};

const productValidationSchema = Yup.object({
    name: Yup.string()
        .min(3, 'Nazwa musi mieć co najmniej 3 znaki')
        .max(255, 'Nazwa jest za długa')
        .required('Nazwa produktu jest wymagana'),

    categoryId: Yup.string()
        .required('ID kategorii jest wymagane'),

    approximatePrice: Yup.number()
        .typeError('Szacowana cena musi być liczbą')
        .positive('Szacowana cena musi być dodatnia')
        .required('Szacowana cena jest wymagana'),

    deliveryPrice: Yup.number()
        .typeError('Cena dostawy musi być liczbą')
        .min(0, 'Cena dostawy nie może być ujemna')
        .required('Cena dostawy jest wymagana'),

    description: Yup.string().optional(),
});

interface CreateProductFormProps {
    onSubmit: (values: ProductFormValues) => void;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({ onSubmit }) => {
    return (
        <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Formik
                initialValues={initialProductValues}
                validationSchema={productValidationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    Nazwa Produktu*
                                </Typography>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    name="name"
                                    placeholder="Wprowadź nazwę produktu"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    ID Kategorii
                                </Typography>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    name="categoryId"
                                    placeholder="Wprowadź ID kategorii"
                                    error={touched.categoryId && Boolean(errors.categoryId)}
                                    helperText={touched.categoryId && errors.categoryId}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    Szacowana Cena (PLN)*
                                </Typography>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    name="approximatePrice"
                                    type="number"
                                    placeholder="0.00"
                                    error={touched.approximatePrice && Boolean(errors.approximatePrice)}
                                    helperText={touched.approximatePrice && errors.approximatePrice}
                                    inputProps={{ step: '0.01', min: '0.01' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    Cena Dostawy (PLN)*
                                </Typography>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    name="deliveryPrice"
                                    type="number"
                                    placeholder="0.00"
                                    error={touched.deliveryPrice && Boolean(errors.deliveryPrice)}
                                    helperText={touched.deliveryPrice && errors.deliveryPrice}
                                    inputProps={{ step: '0.01', min: '0.0' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    Opis
                                </Typography>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    name="description"
                                    multiline
                                    rows={4}
                                    placeholder="Szczegółowy opis produktu"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    Dodatkowe Info (JSON)
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="info"
                                    multiline
                                    rows={4}
                                    placeholder='np. {"manufacturer": "XYZ", "weight_g": 500}'
                                />
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Wprowadź dodatkowe atrybuty produktu jako poprawny obiekt JSON.
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="submit" variant="contained" color="primary">
                                        {'Utwórz i dodaj warianty'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default CreateProductForm;
