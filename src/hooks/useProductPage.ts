import { useEffect, useState, useCallback } from "react";
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

  const getAvailableValues = useCallback(
    (propertyName: string): string[] => {
      if (!allVariants.length) return [];

      const currentSelections = { ...selectedProperties };
      delete currentSelections[propertyName];

      const availableValues = new Set<string>();
      allVariants.forEach((variant) => {
        const matchesCurrentSelection = Object.keys(currentSelections).every(
          (key) => variant[key] === currentSelections[key],
        );

        if (matchesCurrentSelection && variant[propertyName]) {
          availableValues.add(variant[propertyName]);
        }
      });

      return Array.from(availableValues);
    },
    [allVariants, selectedProperties],
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

  const loadVariantDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await getVariantDetails(id);
      setVariant(response.variant);
    } catch (err) {
      console.error("Error loading variant details:", err);
      setError("Nie udało się załadować szczegółów produktu");
    } finally {
      setLoading(false);
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
        setError("Nie udało się załadować produktu");
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

      selectablePropertyNames.forEach((propName) => {
        if (propName !== propertyName) {
          const availableValues = getAvailableValues(propName);
          if (availableValues.length > 0 && !availableValues.includes(newSelections[propName])) {
            delete newSelections[propName];
          }
        }
      });

      setSelectedProperties(newSelections);

      const newVariantId = findVariantId(newSelections);
      if (newVariantId && newVariantId !== variantId) {
        navigate(`/product/${newVariantId}`, { replace: true });
        loadVariantDetails(newVariantId);
        loadVariantProperties(newVariantId);
      }
    },
    [
      selectedProperties,
      selectablePropertyNames,
      getAvailableValues,
      findVariantId,
      variantId,
      navigate,
      loadVariantDetails,
      loadVariantProperties,
    ],
  );

  useEffect(() => {
    if (variantId) {
      loadAllVariantDetails(variantId);
    }
  }, [variantId, loadAllVariantDetails]);

  return {
    variant,
    selectablePropertyNames,
    selectedProperties,
    selectableProperties,
    requiredProperties,
    infoProperties,
    loading,
    error,
    showMoreParams,
    setShowMoreParams,
    handlePropertyChange,
    getAvailableValues,
  };
};
