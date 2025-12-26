import { useMemo, useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import { useProductContext } from "../../contexts/ProductContext";
import {
  createProduct,
  createVariantGrpc,
  getCategoryProperties,
} from "../../api/product-service";
import type {
  CategoryPropertyDTO,
  CategoryPropertyGroupResponse,
  ProductCreateGrpcRequestDTO,
  VariantCreateGrpcRequestDTO,
} from "../../types/products";

type VariantFormState = Pick<
  VariantCreateGrpcRequestDTO,
  "price" | "stockQuantity" | "description" | "variantImages"
>;

interface VariantData {
  id: string;
  price: number;
  stockQuantity: number;
  description: string;
  variantImages: string[];
  propertyValues: Record<string, string>;
}

const initialProductForm: ProductCreateGrpcRequestDTO = {
  categoryId: "",
  name: "",
  approximatePrice: 0,
  deliveryPrice: 0,
  description: "",
};

const initialVariantForm: VariantFormState = {
  price: 0,
  stockQuantity: 0,
  description: "",
  variantImages: [],
};

const AddProductPage: React.FC = () => {
  const { categories, loading: categoriesLoading, error: categoriesError } = useProductContext();

  const [productForm, setProductForm] = useState<ProductCreateGrpcRequestDTO>(initialProductForm);
  const [variantForm, setVariantForm] = useState<VariantFormState>(initialVariantForm);
  const [imageInput, setImageInput] = useState("");
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [properties, setProperties] = useState<CategoryPropertyGroupResponse | null>(null);
  const [propertyValues, setPropertyValues] = useState<Record<string, string>>({});
  const [variantsCreated, setVariantsCreated] = useState<VariantData[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [creatingVariant, setCreatingVariant] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [variantModalOpen, setVariantModalOpen] = useState(false);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories],
  );

  const groupedProperties = useMemo(
    () => ({
      selectable: properties?.selectable || [],
      required: properties?.required || [],
      info: properties?.info || [],
    }),
    [properties],
  );

  const initPropertyValues = (props: CategoryPropertyGroupResponse) => {
    const defaults: Record<string, string> = {};
    const groups = [...(props.selectable || []), ...(props.required || []), ...(props.info || [])];

    groups.forEach((prop) => {
      if (prop.hasDefaultOptions && prop.defaultPropertyOptions && prop.defaultPropertyOptions.length > 0) {
        defaults[prop.id] = prop.defaultPropertyOptions[0].displayText;
      } else {
        defaults[prop.id] = "";
      }
    });

    setPropertyValues(defaults);
  };

  const resetVariantForm = () => {
    setVariantForm(initialVariantForm);
    setImageInput("");
    if (properties) {
      initPropertyValues(properties);
    }
  };

  const handleProductSubmit = async () => {
    if (!productForm.categoryId) {
      setError("Wybierz kategorię przed utworzeniem produktu.");
      return;
    }

    setError(null);
    setStatus(null);
    setCreatingProduct(true);
    try {
      const payload: ProductCreateGrpcRequestDTO = {
        ...productForm,
        approximatePrice: Number(productForm.approximatePrice),
        deliveryPrice: Number(productForm.deliveryPrice),
      };

      const response = await createProduct(payload);
      setCreatedProductId(response.id);
      setStatus("Produkt utworzony. Teraz dodaj warianty.");

      setLoadingProperties(true);
      const fetchedProps = await getCategoryProperties(productForm.categoryId);
      setProperties(fetchedProps);
      initPropertyValues(fetchedProps);
    } catch (err) {
      console.error(err);
      setError("Nie udało się utworzyć produktu. Spróbuj ponownie.");
    } finally {
      setCreatingProduct(false);
      setLoadingProperties(false);
    }
  };

  const handleVariantSubmit = async () => {
    if (!createdProductId) {
      setError("Najpierw utwórz produkt.");
      return;
    }

    if (!properties) {
      setError("Najpierw pobierz właściwości kategorii.");
      return;
    }

    const requiredPropertyIds = [
      ...(groupedProperties.selectable || []),
      ...(groupedProperties.required || []),
    ].map((p) => p.id);

    const missingRequired = requiredPropertyIds.filter((id) => !propertyValues[id]);
    if (missingRequired.length) {
      setError("Uzupełnij wymagane właściwości przed dodaniem wariantu.");
      return;
    }

    setError(null);
    setStatus(null);
    setCreatingVariant(true);

    try {
      const variantPayload: VariantCreateGrpcRequestDTO = {
        productId: createdProductId,
        price: Number(variantForm.price),
        stockQuantity: Number(variantForm.stockQuantity),
        description: variantForm.description,
        variantImages: variantForm.variantImages,
        variantPropertyValues: Object.entries(propertyValues)
          .filter(([_, value]) => value !== undefined && value !== "")
          .map(([propertyId, displayText]) => ({ propertyId, displayText })),
      };

      const response = await createVariantGrpc(variantPayload);
      const newVariant: VariantData = {
        id: response.id,
        price: variantForm.price,
        stockQuantity: variantForm.stockQuantity,
        description: variantForm.description,
        variantImages: variantForm.variantImages,
        propertyValues: { ...propertyValues },
      };
      setVariantsCreated((prev) => [...prev, newVariant]);
      setStatus("Dodano wariant.");
      resetVariantForm();
      setVariantModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Nie udało się dodać wariantu. Spróbuj ponownie.");
    } finally {
      setCreatingVariant(false);
    }
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setVariantForm((prev) => ({
      ...prev,
      variantImages: [...prev.variantImages, imageInput.trim()],
    }));
    setImageInput("");
  };

  const getFirstTwoPropertyValues = (variant: VariantData): string[] => {
    const values = Object.entries(variant.propertyValues)
      .map(([propertyId, displayText]) => {
        const allProps = [
          ...(groupedProperties.selectable || []),
          ...(groupedProperties.required || []),
          ...(groupedProperties.info || []),
        ];
        const prop = allProps.find((p) => p.id === propertyId);
        return prop ? `${prop.name}: ${displayText}` : null;
      })
      .filter((v): v is string => v !== null)
      .slice(0, 2);
    return values;
  };

  const renderPropertyGroup = (title: string, props: CategoryPropertyDTO[], required = false) => {
    if (!props.length) return null;
    return (
      <Card variant="outlined">
        <CardHeader
          title={title}
          subheader={
            required ? "Wymagane przy tworzeniu wariantu" : "Opcjonalne metadane wariantu"
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            {props.map((prop) => {
              const hasDefaultOptions = prop.hasDefaultOptions && prop.defaultPropertyOptions && prop.defaultPropertyOptions.length > 0;
              const value = propertyValues[prop.id] ?? "";

              const commonProps = {
                fullWidth: true,
                name: prop.id,
                label: prop.name,
                value,
                onChange: (e: ChangeEvent<HTMLInputElement>) =>
                  setPropertyValues((prev) => ({ ...prev, [prop.id]: e.target.value })),
                required: required || groupedProperties.selectable.some((p) => p.id === prop.id),
              };

              return (
                <Grid key={prop.id} size={{ xs: 12, md: 6 }}>
                  {hasDefaultOptions ? (
                    <TextField select {...commonProps}>
                      {prop.defaultPropertyOptions?.map((opt) => (
                        <MenuItem key={opt.id} value={opt.displayText}>
                          {opt.displayText}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      {...commonProps}
                      type={prop.dataType === "NUMBER" ? "number" : "text"}
                      placeholder={prop.description || "Wprowadź wartość"}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs items={[{ label: "Panel administracyjny" }, { label: "Dodaj Produkt" }]} />
        <Typography variant="h4" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
          Dodaj Produkt i Warianty
        </Typography>

        {categoriesError && <Alert severity="error">{categoriesError}</Alert>}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {status && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {status}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 3 }}>
          <Card variant="outlined">
            <CardHeader title="1. Wybierz kategorię" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Kategoria"
                    value={productForm.categoryId}
                    disabled={creatingProduct || Boolean(createdProductId) || categoriesLoading}
                    onChange={(e) =>
                      setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))
                    }
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader title="2. Utwórz produkt" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Nazwa produktu"
                    fullWidth
                    value={productForm.name}
                    disabled={creatingProduct || Boolean(createdProductId)}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Szacowana cena"
                    type="number"
                    fullWidth
                    value={productForm.approximatePrice}
                    disabled={creatingProduct || Boolean(createdProductId)}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        approximatePrice: Number(e.target.value),
                      }))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Cena dostawy"
                    type="number"
                    fullWidth
                    value={productForm.deliveryPrice}
                    disabled={creatingProduct || Boolean(createdProductId)}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        deliveryPrice: Number(e.target.value),
                      }))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Opis"
                    fullWidth
                    multiline
                    rows={3}
                    value={productForm.description}
                    disabled={creatingProduct || Boolean(createdProductId)}
                    onChange={(e) =>
                      setProductForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleProductSubmit}
                  disabled={creatingProduct || !productForm.categoryId || Boolean(createdProductId)}
                  startIcon={creatingProduct ? <CircularProgress size={18} /> : null}
                >
                  Utwórz produkt
                </Button>
              </Box>
            </CardContent>
          </Card>

          {createdProductId && (
            <>
              <Card variant="outlined">
                <CardHeader title="3. Właściwości kategorii" />
                <CardContent>
                  {loadingProperties && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={20} />
                      <Typography variant="body2">Ładowanie właściwości...</Typography>
                    </Stack>
                  )}
                  {!loadingProperties && properties && (
                    <Stack spacing={2}>
                      {renderPropertyGroup("Wybieralne (zawsze obowiązkowe)", groupedProperties.selectable, true)}
                      {renderPropertyGroup("Wymagane", groupedProperties.required, true)}
                      {renderPropertyGroup("Informacyjne", groupedProperties.info, false)}
                    </Stack>
                  )}
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader title="4. Warianty produktu" />
                <CardContent>
                  <Grid container spacing={2}>
                    {variantsCreated.map((variant) => {
                      const firstImage = variant.variantImages[0];
                      const propertyLabels = getFirstTwoPropertyValues(variant);
                      return (
                        <Grid key={variant.id} size={{ xs: 12, sm: 6, md: 4 }}>
                          <Card variant="outlined" sx={{ height: "100%" }}>
                            <Box
                              sx={{
                                width: "100%",
                                height: 200,
                                bgcolor: "grey.100",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                              }}
                            >
                              {firstImage ? (
                                <img
                                  src={firstImage}
                                  alt="Variant"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    if (target.parentElement) {
                                      target.parentElement.innerHTML = '<Typography variant="body2" color="text.secondary">Brak zdjęcia</Typography>';
                                    }
                                  }}
                                />
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Brak zdjęcia
                                </Typography>
                              )}
                            </Box>
                            <CardContent>
                              <Stack spacing={1}>
                                {propertyLabels.map((label, idx) => (
                                  <Typography key={idx} variant="body2" color="text.secondary">
                                    {label}
                                  </Typography>
                                ))}
                                <Typography variant="body2" fontWeight={600}>
                                  {variant.price} PLN
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          minHeight: 300,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          borderStyle: "dashed",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                        onClick={() => setVariantModalOpen(true)}
                      >
                        <Stack spacing={1} alignItems="center">
                          <AddIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Dodaj wariant
                          </Typography>
                        </Stack>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </>
          )}
        </Stack>

        <Dialog
          open={variantModalOpen}
          onClose={() => {
            setVariantModalOpen(false);
            resetVariantForm();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Dodaj nowy wariant</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Cena wariantu"
                    type="number"
                    fullWidth
                    value={variantForm.price}
                    onChange={(e) =>
                      setVariantForm((prev) => ({ ...prev, price: Number(e.target.value) }))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Ilość w magazynie"
                    type="number"
                    fullWidth
                    value={variantForm.stockQuantity}
                    onChange={(e) =>
                      setVariantForm((prev) => ({ ...prev, stockQuantity: Number(e.target.value) }))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Opis wariantu"
                    fullWidth
                    multiline
                    rows={3}
                    value={variantForm.description}
                    onChange={(e) =>
                      setVariantForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    label="URL zdjęcia"
                    fullWidth
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://..."
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} display="flex" alignItems="center">
                  <Button variant="outlined" fullWidth onClick={handleAddImage}>
                    Dodaj zdjęcie
                  </Button>
                </Grid>
                {variantForm.variantImages.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {variantForm.variantImages.map((img, idx) => (
                        <Chip
                          key={img + idx}
                          label={img.length > 30 ? `${img.substring(0, 30)}...` : img}
                          onDelete={() =>
                            setVariantForm((prev) => ({
                              ...prev,
                              variantImages: prev.variantImages.filter((_, i) => i !== idx),
                            }))
                          }
                        />
                      ))}
                    </Stack>
                  </Grid>
                )}
              </Grid>

              {properties && (
                <Stack spacing={2}>
                  {renderPropertyGroup("Wybieralne (zawsze obowiązkowe)", groupedProperties.selectable, true)}
                  {renderPropertyGroup("Wymagane", groupedProperties.required, true)}
                  {renderPropertyGroup("Informacyjne", groupedProperties.info, false)}
                </Stack>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setVariantModalOpen(false);
                resetVariantForm();
              }}
            >
              Anuluj
            </Button>
            <Button
              variant="contained"
              onClick={handleVariantSubmit}
              disabled={creatingVariant || !createdProductId}
              startIcon={creatingVariant ? <CircularProgress size={18} /> : null}
            >
              Dodaj wariant
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default AddProductPage;
