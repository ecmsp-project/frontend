import React, { useState } from "react";
import { useRoleContext } from "../../contexts/RoleContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";

interface AddRoleModalProps {
  userId: string;
  userName: string;
  open: boolean;
  onClose: () => void;
  onSave: (userId: string, roleName: string) => Promise<void>;
  userCurrentRoles: string[];
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  userId,
  userName,
  open,
  onClose,
  onSave,
  userCurrentRoles,
}) => {
  const { roles } = useRoleContext();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const availableRoles = roles.filter((role) => !userCurrentRoles.includes(role.name));

  const handleSave = async () => {
    if (!selectedRoleName) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(userId, selectedRoleName);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      setSelectedRoleName("");
    }
  };

  React.useEffect(() => {
    if (open) {
      setSelectedRoleName("");
      setSaveError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Dodaj rolę dla użytkownika: **{userName}**</DialogTitle>
      <DialogContent dividers>
        {availableRoles.length === 0 ? (
          <Alert severity="info">Wszystkie role zostały już przypisane temu użytkownikowi.</Alert>
        ) : (
          <>
            {saveError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {saveError}
              </Alert>
            )}
            <Select
              value={selectedRoleName}
              onChange={(e) => setSelectedRoleName(e.target.value as string)}
              fullWidth
              displayEmpty
              disabled={isSaving}
            >
              <MenuItem value="" disabled>
                Wybierz nową rolę
              </MenuItem>
              {availableRoles.map((role) => (
                <MenuItem key={role.name} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Anuluj
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={isSaving || !selectedRoleName || availableRoles.length === 0}
        >
          {isSaving ? <CircularProgress size={24} /> : "Dodaj Rolę"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoleModal;
