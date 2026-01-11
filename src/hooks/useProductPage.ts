import { useEffect, useState, useCallback, useRef } from "react";
import {
  getAllVariantDetails,
  getVariantDetails,
  getVariantProperties,
} from "../api/product-service";
import type { VariantDetailDTO, VariantPropertyResponseDTO } from "../types/products";
import { useParams, useNavigate } from "react-router-dom";

interface SelectedProperties {
  [propertyName: string]: string;
}

export const useProductPage = () => {
  const { id: variantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isVariantChanging, setIsVariantChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variant, setVariant] = useState<VariantDetailDTO | null>(null);
  const [selectablePropertyNames, setSelectablePropertyNames] = useState<string[]>([]);
  const [allVariants, setAllVariants] = useState<Record<string, any>[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<SelectedProperties>({});
  const [selectableProperties, setSelectableProperties] = useState<VariantPropertyResponseDTO[]>(
    [],
  );
  const [requiredProperties, setRequiredProperties] = useState<VariantPropertyResponseDTO[]>([]);
  const [infoProperties, setInfoProperties] = useState<VariantPropertyResponseDTO[]>([]);
  const [showMoreParams, setShowMoreParams] = useState(false);
  const isInternalChangeRef = useRef(false);

  const getAvailableValues = useCallback(
    (propertyName: string): string[] => {
      if (!allVariants.length) return [];

      const availableValues = new Set<string>();
      allVariants.forEach((variant) => {
        if (variant[propertyName]) {
          availableValues.add(variant[propertyName]);
        }
      });

      return Array.from(availableValues);
    },
    [allVariants],
  );

  const findVariantId = useCallback(
    (selections: SelectedProperties): string | null => {
      const matchingVariant = allVariants.find((variant) => {
        return selectablePropertyNames.every(
          (propName) => variant[propName] === selections[propName],
        );
      });

      return matchingVariant?.variantId || null;
    },
    [allVariants, selectablePropertyNames],
  );

  const loadVariantDetails = useCallback(async (id: string, silent = false) => {
    try {
      if (!silent) {
        setIsVariantChanging(true);
      }
      const response = await getVariantDetails(id);
      setVariant((prevVariant) => ({
        ...response.variant,
        name: response.variant.name || prevVariant?.name || "",
      }));
    } catch (err) {
      console.error("Error loading variant details:", err);
      if (!silent) {
        setError("Failed to load product details");
      }
    } finally {
      if (!silent) {
        setIsVariantChanging(false);
      }
    }
  }, []);

  const loadVariantProperties = useCallback(async (id: string) => {
    try {
      const props = await getVariantProperties(id);
      setSelectableProperties(props.selectable || []);
      setRequiredProperties(props.required || []);
      setInfoProperties(props.info || []);
    } catch (err) {
      console.error("Error loading variant properties:", err);
    }
  }, []);

  const loadAllVariantDetails = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllVariantDetails(id);

        setVariant(response.variant);
        setSelectablePropertyNames(response.selectablePropertyNames || []);
        setAllVariants(response.allVariants || []);

        if (response.allVariants && response.allVariants.length > 0) {
          const currentVariant = response.allVariants.find((v) => v.variantId === id);
          if (currentVariant) {
            const initialSelections: SelectedProperties = {};
            response.selectablePropertyNames?.forEach((propName) => {
              if (currentVariant[propName]) {
                initialSelections[propName] = currentVariant[propName];
              }
            });
            setSelectedProperties(initialSelections);
          }
        }

        await loadVariantProperties(id);
      } catch (err) {
        console.error("Error loading all variant details:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    },
    [loadVariantProperties],
  );

  const handlePropertyChange = useCallback(
    (propertyName: string, value: string) => {
      const newSelections = {
        ...selectedProperties,
        [propertyName]: value,
      };

      let newVariantId = findVariantId(newSelections);

      if (!newVariantId) {
        const matchingVariant = allVariants.find((variant) => {
          if (variant[propertyName] !== value) {
            return false;
          }
          return Object.keys(newSelections).every(
            (key) => !newSelections[key] || variant[key] === newSelections[key],
          );
        });
        newVariantId = matchingVariant?.variantId || null;
      }

      if (!newVariantId) {
        const matchingVariant = allVariants.find((variant) => variant[propertyName] === value);
        newVariantId = matchingVariant?.variantId || null;
      }

      if (!newVariantId || newVariantId === variantId) {
        return;
      }

      isInternalChangeRef.current = true;

      const newVariantData = allVariants.find((v) => v.variantId === newVariantId);
      if (newVariantData && variant) {
        setVariant({
          ...variant,
          variantId: newVariantId,
          name: variant.name,
        });
      }

      if (newVariantData) {
        const updatedSelections: SelectedProperties = {};
        selectablePropertyNames.forEach((propName) => {
          if (newVariantData[propName]) {
            updatedSelections[propName] = newVariantData[propName];
          }
        });
        setSelectedProperties(updatedSelections);
      }

      navigate(`/product/${newVariantId}`, { replace: true, preventScrollReset: true });

      loadVariantDetails(newVariantId, true);
      loadVariantProperties(newVariantId);
    },
    [
      selectedProperties,
      selectablePropertyNames,
      findVariantId,
      variantId,
      allVariants,
      variant,
      navigate,
      loadVariantDetails,
      loadVariantProperties,
    ],
  );

  useEffect(() => {
    if (!variantId) {
      return;
    }

    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    if (allVariants.length > 0 && variant) {
      const currentVariantInAllVariants = allVariants.find((v) => v.variantId === variantId);
      if (currentVariantInAllVariants && variant.variantId !== variantId) {
        loadVariantDetails(variantId, true);
        loadVariantProperties(variantId);
        return;
      }
    }

    if (!variant || variant.variantId !== variantId) {
      loadAllVariantDetails(variantId);
    }
  }, [variantId]);

  return {
    variant,
    selectablePropertyNames,
    selectedProperties,
    selectableProperties,
    requiredProperties,
    infoProperties,
    loading,
    isVariantChanging,
    error,
    showMoreParams,
    setShowMoreParams,
    handlePropertyChange,
    getAvailableValues,
  };
};
