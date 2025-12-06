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
        setError("Nie udało się załadować szczegółów produktu");
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
      if (!(newVariantId && newVariantId !== variantId)) {
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

      navigate(`/product/${newVariantId}`, { replace: true, preventScrollReset: true });

      loadVariantDetails(newVariantId, true);
      loadVariantProperties(newVariantId);
    },
    [
      selectedProperties,
      selectablePropertyNames,
      getAvailableValues,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
