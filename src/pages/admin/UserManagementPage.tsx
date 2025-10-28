import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Chip,
  Container,
} from "@mui/material";

type UserRole = "ADMIN" | "MANAGER" | "SALES" | "USER";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
}

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Anna Kowalska",
    email: "anna@ecm.com",
    role: "ADMIN",
    lastActive: "2025-10-22",
  },
  {
    id: "2",
    name: "Piotr Nowak",
    email: "piotr@ecm.com",
    role: "MANAGER",
    lastActive: "2025-10-23",
  },
  {
    id: "3",
    name: "Katarzyna Lewa",
    email: "kasia@ecm.com",
    role: "SALES",
    lastActive: "2025-10-21",
  },
  {
    id: "4",
    name: "Marcin Wójcik",
    email: "marcin@ecm.com",
    role: "USER",
    lastActive: "2025-10-23",
  },
  {
    id: "5",
    name: "Zofia Zielińska",
    email: "zofia@ecm.com",
    role: "USER",
    lastActive: "2025-10-20",
  },
];

const ALL_ROLES: UserRole[] = ["ADMIN", "MANAGER", "SALES", "USER"];

const RoleChip: React.FC<{ role: UserRole }> = ({ role }) => {
  let color: "primary" | "secondary" | "success" | "warning" | "error";
  switch (role) {
    case "ADMIN":
      color = "error";
      break;
    case "MANAGER":
      color = "warning";
      break;
    case "SALES":
      color = "success";
      break;
    case "USER":
      color = "primary";
      break;
    default:
      color = "primary";
  }
  return <Chip label={role} color={color} size="small" />;
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const handleRoleChange = (event: SelectChangeEvent<UserRole>, userId: string) => {
    const newRole = event.target.value as UserRole;

    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)),
    );
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
                <TableCell>Nazwa Użytkownika</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Ostatnia Aktywność</TableCell>
                <TableCell>Rola</TableCell>
                <TableCell>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <RoleChip role={user.role} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(e, user.id)}
                      displayEmpty
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      {ALL_ROLES.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </AdminLayout>
  );
};

export default UserManagementPage;
