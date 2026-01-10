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
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
import { useProductContext } from "../../contexts/ProductContext";
import {
    createProduct,
    createVariantGrpc,
    getCategoryProperties,
    createPropertyGrpc,
    type CreatePropertyGrpcRequestDTO,
} from "../../api/product-service";
import type {
    CategoryPropertyDTO,
    CategoryPropertyGroupResponse,
    ProductCreateRequestDTO,
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

const initialProductForm: ProductCreateRequestDTO = {
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

    const [productForm, setProductForm] = useState<ProductCreateRequestDTO>(initialProductForm);
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
    const [customProperties, setCustomProperties] = useState<Array<{ id: string; name: string; value: string }>>([]);

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
        setCustomProperties([]);
        if (properties) {
            initPropertyValues(properties);
        }
    };

    const handleAddCustomProperty = () => {
        const newId = `custom-${Date.now()}`;
        setCustomProperties((prev) => [...prev, { id: newId, name: "", value: "" }]);
    };

    const handleRemoveCustomProperty = (id: string) => {
        setCustomProperties((prev) => prev.filter((prop) => prop.id !== id));
    };

    const handleUpdateCustomProperty = (id: string, field: "name" | "value", newValue: string) => {
        setCustomProperties((prev) =>
            prev.map((prop) => (prop.id === id ? { ...prop, [field]: newValue } : prop))
        );
    };

    const handleProductSubmit = async () => {
        if (!productForm.categoryId) {
            setError("Select a category before creating the product.");
            return;
        }

        setError(null);
        setStatus(null);
        setCreatingProduct(true);
        try {
            const payload: ProductCreateRequestDTO = {
                ...productForm,
                approximatePrice: Number(productForm.approximatePrice),
                deliveryPrice: Number(productForm.deliveryPrice),
            };

            const response = await createProduct(payload);
            setCreatedProductId(response.id);
            setStatus("Product created. Now add variants.");

            setLoadingProperties(true);
            const fetchedProps = await getCategoryProperties(productForm.categoryId);
            setProperties(fetchedProps);
            initPropertyValues(fetchedProps);
        } catch (err) {
            console.error(err);
            setError("Failed to create product. Please try again.");
        } finally {
            setCreatingProduct(false);
            setLoadingProperties(false);
        }
    };

    const handleVariantSubmit = async () => {
        if (!createdProductId) {
            setError("First create a product.");
            return;
        }

        if (!properties) {
            setError("First fetch category properties.");
            return;
        }

        const requiredPropertyIds = [
            ...(groupedProperties.selectable || []),
            ...(groupedProperties.required || []),
        ].map((p) => p.id);

        const missingRequired = requiredPropertyIds.filter((id) => !propertyValues[id]);
        if (missingRequired.length) {
            setError("Fill in required properties before adding variant.");
            return;
        }

        setError(null);
        setStatus(null);
        setCreatingVariant(true);

        try {
            // Automatycznie dodaj zdjęcia z textarea jeśli są tam jakieś URL-e
            let allImages = [...variantForm.variantImages];
            if (imageInput.trim()) {
                const urlsFromInput = imageInput
                    .split(/[\n,]/)
                    .map((url) => url.trim())
                    .filter((url) => url.length > 0);
                allImages = [...allImages, ...urlsFromInput];
            }
            
            // Filtrujemy puste stringi i upewniamy się że mamy tablicę stringów
            const images = allImages.filter((img) => img && img.trim().length > 0);
            
            // Przygotuj standardowe właściwości
            const standardPropertyValues = Object.entries(propertyValues)
                .filter(([_, value]) => value !== undefined && value !== "")
                .map(([propertyId, displayText]) => ({ propertyId, displayText }));

            // Utwórz custom properties i pobierz ich ID
            const customPropertyValues: Array<{ propertyId: string; displayText: string }> = [];
            
            if (customProperties.length > 0 && productForm.categoryId) {
                for (const customProp of customProperties) {
                    if (customProp.name.trim() && customProp.value.trim()) {
                        try {
                            // Utwórz property w backendzie
                            const propertyPayload: CreatePropertyGrpcRequestDTO = {
                                categoryId: productForm.categoryId,
                                name: customProp.name.trim(),
                                unit: "", // Dla INFO properties unit może być pusty
                                dataType: "TEXT",
                                role: "INFO",
                                defaultPropertyOptionValues: [], // Dla INFO properties pusta tablica
                            };
                            
                            const createdProperty = await createPropertyGrpc(propertyPayload);
                            
                            // Dodaj do listy z właściwym ID
                            customPropertyValues.push({
                                propertyId: createdProperty.id,
                                displayText: customProp.value.trim(),
                            });
                        } catch (err) {
                            console.error(`Error creating property "${customProp.name}":`, err);
                            const errorMessage = err instanceof Error ? err.message : String(err);
                            setError(`Failed to create property "${customProp.name}": ${errorMessage}`);
                            return;
                        }
                    }
                }
            }
            
            const variantPayload: VariantCreateGrpcRequestDTO = {
                productId: createdProductId,
                price: Number(variantForm.price),
                stockQuantity: Number(variantForm.stockQuantity),
                description: variantForm.description,
                variantImages: images,
                variantPropertyValues: [...standardPropertyValues, ...customPropertyValues],
            };

            console.log("createVariant - variantPayload:", variantPayload);
            
            const response = await createVariantGrpc(variantPayload);
            const newVariant: VariantData = {
                id: response.id,
                price: variantForm.price,
                stockQuantity: variantForm.stockQuantity,
                description: variantForm.description,
                variantImages: images, // Używamy przefiltrowanych zdjęć
                propertyValues: { ...propertyValues },
            };
            setVariantsCreated((prev) => [...prev, newVariant]);
            setStatus("Variant added.");
            resetVariantForm();
            setVariantModalOpen(false);
        } catch (err) {
            console.error(err);
            setError("Failed to add variant. Please try again.");
        } finally {
            setCreatingVariant(false);
        }
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
                        required ? "Required when creating variant" : "Optional variant metadata"
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
                                            placeholder={prop.description || "Enter value"}
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
        <Breadcrumbs items={[{ label: "Admin Panel" }, { label: "Add Product" }]} />
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
                    Add Product and Variants
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
                        <CardHeader title="1. Select Category" />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Category"
                                        value={productForm.categoryId}
                                        disabled={creatingProduct || Boolean(createdProductId) || categoriesLoading}
                                        onChange={(e) =>
                                            setProductForm((prev: ProductCreateRequestDTO) => ({ ...prev, categoryId: e.target.value }))
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
                        <CardHeader title="2. Create Product" />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Product Name"
                                        fullWidth
                                        value={productForm.name}
                                        disabled={creatingProduct || Boolean(createdProductId)}
                                        onChange={(e) => setProductForm((prev: ProductCreateRequestDTO) => ({ ...prev, name: e.target.value }))}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Approximate Price"
                                        type="number"
                                        fullWidth
                                        value={productForm.approximatePrice}
                                        disabled={creatingProduct || Boolean(createdProductId)}
                                        onChange={(e) =>
                                            setProductForm((prev: ProductCreateRequestDTO) => ({
                                                ...prev,
                                                approximatePrice: Number(e.target.value),
                                            }))
                                        }
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Delivery Price"
                                        type="number"
                                        fullWidth
                                        value={productForm.deliveryPrice}
                                        disabled={creatingProduct || Boolean(createdProductId)}
                                        onChange={(e) =>
                                            setProductForm((prev: ProductCreateRequestDTO) => ({
                                                ...prev,
                                                deliveryPrice: Number(e.target.value),
                                            }))
                                        }
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={productForm.description}
                                        disabled={creatingProduct || Boolean(createdProductId)}
                                        onChange={(e) =>
                                            setProductForm((prev: ProductCreateRequestDTO) => ({ ...prev, description: e.target.value }))
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
                                    Create Product
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {createdProductId && (
                        <>
                            <Card variant="outlined">
                                <CardHeader title="3. Category Properties" />
                                <CardContent>
                                    {loadingProperties && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CircularProgress size={20} />
                                            <Typography variant="body2">Loading properties...</Typography>
                                        </Stack>
                                    )}
                                    {!loadingProperties && properties && (
                                        <Stack spacing={2}>
                                            {renderPropertyGroup("Selectable (always required)", groupedProperties.selectable, true)}
                                            {renderPropertyGroup("Required", groupedProperties.required, true)}
                                            {renderPropertyGroup("Informational", groupedProperties.info, false)}
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>

                            <Card variant="outlined">
                                <CardHeader title="4. Product Variants" />
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
                                                                            target.parentElement.innerHTML = '<Typography variant="body2" color="text.secondary">No image</Typography>';
                                                                        }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    No image
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
                                                        Add variant
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
                    <DialogTitle>Add New Variant</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Variant Price"
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
                                        label="Stock Quantity"
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
                                        label="Variant Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={variantForm.description}
                                        onChange={(e) =>
                                            setVariantForm((prev) => ({ ...prev, description: e.target.value }))
                                        }
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Image URLs (one per line or separated by comma)"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;or&#10;https://example.com/image1.jpg, https://example.com/image2.jpg"
                                        helperText="You can paste multiple URLs at once - each on a new line or separated by comma"
                                    />
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
                                    {renderPropertyGroup("Selectable (always required)", groupedProperties.selectable, true)}
                                    {renderPropertyGroup("Required", groupedProperties.required, true)}
                                    {renderPropertyGroup("Informational", groupedProperties.info, false)}
                                </Stack>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="h6">Additional Properties (INFO)</Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddCustomProperty}
                                    >
                                        Add Property
                                    </Button>
                                </Box>
                                <Stack spacing={2}>
                                    {customProperties.map((prop) => (
                                        <Card key={prop.id} variant="outlined">
                                            <CardContent>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid size={{ xs: 12, md: 5 }}>
                                                        <TextField
                                                            label="Property Name"
                                                            fullWidth
                                                            value={prop.name}
                                                            onChange={(e) =>
                                                                handleUpdateCustomProperty(prop.id, "name", e.target.value)
                                                            }
                                                            placeholder="e.g. Material, Country of Origin"
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                        <TextField
                                                            label="Value"
                                                            fullWidth
                                                            value={prop.value}
                                                            onChange={(e) =>
                                                                handleUpdateCustomProperty(prop.id, "value", e.target.value)
                                                            }
                                                            placeholder="Enter value"
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 1 }} display="flex" justifyContent="center">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleRemoveCustomProperty(prop.id)}
                                                            aria-label="Remove property"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {customProperties.length === 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                                            No additional properties. Click "Add Property" to add a new one.
        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setVariantModalOpen(false);
                                resetVariantForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleVariantSubmit}
                            disabled={creatingVariant || !createdProductId}
                            startIcon={creatingVariant ? <CircularProgress size={18} /> : null}
                        >
                            Add Variant
                        </Button>
                    </DialogActions>
                </Dialog>
      </Container>
    </MainLayout>
  );
};

export default AddProductPage;
