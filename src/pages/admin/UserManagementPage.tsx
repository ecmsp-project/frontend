import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useUserContext } from "../../contexts/UserContext";
import AddRoleModal from "./AddRoleModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
  IconButton,
  Box,
} from "@mui/material";

const defaultUser = "User";

const RoleChip: React.FC<{ roleName: string; onDelete?: () => void }> = ({
  roleName,
  onDelete,
}) => {
  const isDeletable = roleName !== defaultUser;

  let color: "primary" | "default";
  if (isDeletable) {
    color = "primary";
  } else {
    color = "default";
  }

  return (
    <Chip
      label={roleName}
      color={color}
      size="small"
      sx={{ mr: 0.5, mb: 0.5 }}
      deleteIcon={isDeletable ? <RemoveCircleIcon /> : undefined}
      onDelete={onDelete && isDeletable ? onDelete : undefined}
    />
  );
};

const UserManagementPage: React.FC = () => {
  const { users, addRoleToUser, removeRoleFromUser, deleteUser } = useUserContext();

  const [modalState, setModalState] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    currentRoles: string[];
  }>({
    open: false,
    userId: "",
    userName: "",
    currentRoles: [],
  });

  const handleRemoveRole = async (userId: string, roleName: string) => {
    if (!window.confirm(`Czy na pewno usunąć rolę ${roleName} użytkownikowi?`)) return;
    try {
      await removeRoleFromUser(userId, roleName);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleOpenAddRoleModal = (user: {
    id: string;
    login: string;
    roles: { name: string }[];
  }) => {
    setModalState({
      open: true,
      userId: user.id,
      userName: user.login,
      currentRoles: user.roles.map((r) => r.name),
    });
  };

  const handleCloseAddRoleModal = () => {
    setModalState({ ...modalState, open: false });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Zarządzanie Użytkownikami i Rolami
        </Typography>

        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="user roles table">
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Login</TableCell>
                <TableCell>Rola</TableCell>
                <TableCell>Usuń Użytkownika</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const userRoles = user.roles.map((r) => r.name);
                const rolesToDisplay = userRoles.length > 0 ? userRoles : [defaultUser];

                return (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.login}</TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" alignItems="center">
                        {rolesToDisplay.map((roleName) => (
                          <RoleChip
                            key={roleName}
                            roleName={roleName}
                            onDelete={() => handleRemoveRole(user.id, roleName)}
                          />
                        ))}
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenAddRoleModal(user)}
                          sx={{ ml: 1 }}
                        >
                          <AddCircleIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {modalState.open && (
        <AddRoleModal
          userId={modalState.userId}
          userName={modalState.userName}
          open={modalState.open}
          onClose={handleCloseAddRoleModal}
          onSave={addRoleToUser}
          userCurrentRoles={modalState.currentRoles}
        />
      )}
    </AdminLayout>
  );
};

export default UserManagementPage;
