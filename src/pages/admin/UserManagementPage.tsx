import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useIndividualUser } from "../../contexts/IndividualUserContext";
import { useUserContext } from "../../contexts/UserContext";
import { PERMISSIONS } from "../../types/permissions";
import AddRoleModal from "./AddRoleModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SearchIcon from "@mui/icons-material/Search";
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
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";

const defaultUser = "User";

const RoleChip: React.FC<{
  roleName: string;
  onDelete?: () => void;
  disabled?: boolean;
}> = ({ roleName, onDelete, disabled }) => {
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
      sx={{
        mr: 0.5,
        mb: 0.5,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
      deleteIcon={isDeletable ? <RemoveCircleIcon /> : undefined}
      onDelete={onDelete && isDeletable && !disabled ? onDelete : undefined}
    />
  );
};

const UserManagementPage: React.FC = () => {
  const { users, addRoleToUser, removeRoleFromUser, deleteUser, refetchUsers } = useUserContext();
  const { hasPermission } = useIndividualUser();
  const canManageUsers = hasPermission(PERMISSIONS.MANAGE_USERS);

  const [searchTerm, setSearchTerm] = useState("");
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

  // Debounce search - wywołaj refetchUsers po 500ms od ostatniej zmiany
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refetchUsers(searchTerm || undefined);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, refetchUsers]);

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

        {!canManageUsers && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "warning.light",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Masz uprawnienia tylko do przeglądania. Aby zarządzać użytkownikami, wymagane jest
              uprawnienie MANAGE_USERS.
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Wyszukaj użytkownika po loginie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Table aria-label="user roles table">
            <TableHead
              sx={{
                bgcolor: (theme) => theme.palette.primary.main,
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Login</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Rola</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Usuń Użytkownika</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const userRoles = user.roles.map((r) => r.name);
                const rolesToDisplay = userRoles.length > 0 ? userRoles : [defaultUser];

                return (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: (theme) => theme.palette.action.hover,
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{user.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>
                      {user.login}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" alignItems="center">
                        {rolesToDisplay.map((roleName) => (
                          <RoleChip
                            key={roleName}
                            roleName={roleName}
                            onDelete={() => handleRemoveRole(user.id, roleName)}
                            disabled={!canManageUsers}
                          />
                        ))}
                        <Tooltip
                          title={
                            !canManageUsers
                              ? "Brak uprawnień do zarządzania rolami użytkowników"
                              : "Dodaj rolę"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenAddRoleModal(user)}
                              sx={{
                                ml: 1,
                                opacity: !canManageUsers ? 0.5 : 1,
                              }}
                              disabled={!canManageUsers}
                            >
                              <AddCircleIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={!canManageUsers ? "Brak uprawnień do usuwania użytkowników" : "Usuń"}
                      >
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                            sx={{ opacity: !canManageUsers ? 0.5 : 1 }}
                            disabled={!canManageUsers}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
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
          readOnly={!canManageUsers}
        />
      )}
    </AdminLayout>
  );
};

export default UserManagementPage;
