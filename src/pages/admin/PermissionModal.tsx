import React, { useState } from "react";
import { usePermissionContext } from "../../contexts/PermissionContext";
import type { Role } from "../../types/users";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

interface PermissionModalProps {
  role: Role;
  open: boolean;
  onClose: () => void;
  onSave: (role: Role) => Promise<void>;
  loadingSave: boolean;
  readOnly?: boolean;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  role,
  open,
  onClose,
  onSave,
  loadingSave,
  readOnly = false,
}) => {
  const { allPermissions, loadingPermissions } = usePermissionContext();
  const [currentPermissions, setCurrentPermissions] = useState(role.permissions || []);

  React.useEffect(() => {
    setCurrentPermissions(role.permissions || []);
  }, [role.permissions, open]);

  const handleTogglePermission = (permission: string) => {
    if (readOnly) return;
    setCurrentPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    );
  };

  const handleSave = async () => {
    await onSave({ ...role, permissions: currentPermissions });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {readOnly ? "View permissions for role" : "Manage permissions for role"}: {role.name}
      </DialogTitle>
      <DialogContent dividers>
        {loadingPermissions ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={1}>
            {allPermissions.map((permission) => (
              <Grid size={{ xs: 12, md: 5 }} key={permission}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentPermissions.includes(permission)}
                      onChange={() => handleTogglePermission(permission)}
                      disabled={readOnly}
                    />
                  }
                  label={permission}
                  sx={{ opacity: readOnly ? 0.7 : 1 }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loadingSave}>
          {readOnly ? "Close" : "Cancel"}
        </Button>
        {!readOnly && (
          <Button onClick={handleSave} color="primary" variant="contained" disabled={loadingSave}>
            {loadingSave ? <CircularProgress size={24} /> : "Save Permissions"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
