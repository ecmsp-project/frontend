import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import MainLayout from "../../components/layout/MainLayout";
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

  // Debounce search - call refetchUsers after 500ms from last change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refetchUsers(searchTerm || undefined);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, refetchUsers]);

  const handleRemoveRole = async (userId: string, roleName: string) => {
    if (!window.confirm(`Are you sure you want to remove role ${roleName} from the user?`)) return;
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs
          items={[
            { label: "Admin Panel", path: "/admin" },
            { label: "Users" },
            { label: "User Management" },
          ]}
        />
        <Typography variant="h4" gutterBottom>
          User and Role Management
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
              You only have view permissions. To manage users, MANAGE_USERS permission is required.
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search user by login..."
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
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Delete User</TableCell>
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
                              ? "No permission to manage user roles"
                              : "Add role"
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
                        title={!canManageUsers ? "No permission to delete users" : "Delete"}
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
    </MainLayout>
  );
};

export default UserManagementPage;
