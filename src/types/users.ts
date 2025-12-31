export interface User {
  id: string;
  login: string;
  roles: Role[];
}

export interface Role {
  name: string;
  permissions: string[];
}
