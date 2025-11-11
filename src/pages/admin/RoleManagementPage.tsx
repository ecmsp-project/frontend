import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
import { useRoleContext } from "../../contexts/RoleContext";
import { PERMISSIONS } from "../../types/permissions";
import type { Role } from "../../types/users";
import { PermissionModal } from "./PermissionModal";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Box,
  IconButton,
  TextField,
  Dialog,
  DialogContentText,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";

const RoleManagementPage: React.FC = () => {
  const { roles, addRole, updateRole, deleteRole } = useRoleContext();
  const { hasPermission } = useIndividualUser();
  const canManageRoles = hasPermission(PERMISSIONS.MANAGE_ROLES);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  const handleOpenPermissionModal = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  };

  const handleSavePermissions = async (updatedRole: Role) => {
    setLoadingSave(true);
    try {
      await updateRole(updatedRole);
      setIsPermissionModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) return;

    setLoadingSave(true);
    try {
      await addRole({ name: newRoleName.trim(), permissions: [] });
      setIsAddModalOpen(false);
      setNewRoleName("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    if (window.confirm(`Czy na pewno chcesz usunąć rolę ${roleName}?`)) {
      try {
        await deleteRole(roleName);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Zarządzanie Rolami i Uprawnieniami
        </Typography>

        {!canManageRoles && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "warning.light",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Masz uprawnienia tylko do przeglądania. Aby zarządzać rolami, wymagane jest
              uprawnienie MANAGE_ROLES.
            </Typography>
          </Box>
        )}

        <Box mb={2} display="flex" justifyContent="flex-end">
          <Tooltip title={!canManageRoles ? "Brak uprawnień do dodawania ról" : "Dodaj nową rolę"}>
            <span>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
                disabled={!canManageRoles}
                sx={{ opacity: !canManageRoles ? 0.5 : 1 }}
              >
                Dodaj nową rolę
              </Button>
            </span>
          </Tooltip>
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="role management table">
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell>Nazwa Roli</TableCell>
                <TableCell>Liczba Uprawnień</TableCell>
                <TableCell>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.name} hover>
                  <TableCell sx={{ fontWeight: "bold" }}>{role.name}</TableCell>
                  <TableCell>{role.permissions?.length || 0}</TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        !canManageRoles
                          ? "Brak uprawnień do edycji uprawnień"
                          : "Edytuj uprawnienia"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenPermissionModal(role)}
                          disabled={!canManageRoles}
                          sx={{ opacity: !canManageRoles ? 0.5 : 1 }}
                        >
                          <LockIcon fontSize="small" color="primary" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip
                      title={!canManageRoles ? "Brak uprawnień do usuwania ról" : "Usuń rolę"}
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteRole(role.name)}
                          disabled={!canManageRoles}
                          sx={{ opacity: !canManageRoles ? 0.5 : 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {selectedRole && (
        <PermissionModal
          role={selectedRole}
          open={isPermissionModalOpen}
          onClose={() => setIsPermissionModalOpen(false)}
          onSave={handleSavePermissions}
          loadingSave={loadingSave}
          readOnly={!canManageRoles}
        />
      )}

      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <DialogTitle>Dodaj nową rolę</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Wprowadź unikalną nazwę dla nowej roli.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Nazwa Roli"
            type="text"
            fullWidth
            variant="outlined"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddModalOpen(false)} disabled={loadingSave}>
            Anuluj
          </Button>
          <Button
            onClick={handleAddRole}
            color="primary"
            variant="contained"
            disabled={loadingSave || !newRoleName.trim()}
          >
            {loadingSave ? <CircularProgress size={24} /> : "Dodaj"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default RoleManagementPage;
