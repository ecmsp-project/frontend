import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRoleContext } from "../../contexts/RoleContext";
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
} from "@mui/material";

const RoleManagementPage: React.FC = () => {
  const { roles, addRole, updateRole, deleteRole } = useRoleContext();

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

        <Box mb={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Dodaj nową rolę
          </Button>
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
                    <IconButton size="small" onClick={() => handleOpenPermissionModal(role)}>
                      <LockIcon fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteRole(role.name)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
