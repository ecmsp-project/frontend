# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce frontend application built with React, TypeScript, and Material-UI (MUI). The application features a customer-facing storefront and a comprehensive admin panel with role-based access control (RBAC).

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Format code
npm run format

# Check formatting
npm run format:check
```

## Architecture

### Context Providers & State Management

The application uses React Context API for global state management with a layered provider structure (see `src/App.tsx`):

1. **IndividualUserProvider** - Current logged-in user session
2. **UserProvider** - User management (admin functionality)
3. **RoleProvider** - Role management
4. **PermissionProvider** - Permission management
5. **CartProvider** - Shopping cart state
6. **ProductProvider** - Product catalog with category filtering
7. **CMSProvider** - Content Management System data

**Important**: All providers wrap the entire application in a specific order. Maintain this order when adding new providers.

### API Service Layer

All API calls are centralized in `src/api/` directory:

- `auth-service.ts` - Authentication (login, getCurrentUser)
- `user-service.ts` - User CRUD operations
- `role-service.ts` - Role and permission management
- `product-service.ts` - Product and category operations
- `cart-service.ts` - Shopping cart operations
- `order-service.ts` - Order management
- `cms-service.ts` - CMS content operations
- `utils.ts` - Shared API utilities (apiCall, API_BASE_URL)

**API Configuration**: Base URL is configured via `VITE_API_URL` environment variable (defaults to `http://localhost:8600`).

**Authentication**: Uses JWT tokens stored in localStorage. The `apiCall` utility automatically includes credentials and handles 401 errors.

### Permission System

The application implements fine-grained RBAC (see `src/types/permissions.ts`):

- Permissions: WRITE_PRODUCTS, DELETE_PRODUCTS, READ_ORDERS, WRITE_ORDERS, CANCEL_ORDERS, READ_USERS, MANAGE_USERS, MANAGE_ROLES, PROCESS_PAYMENTS, REFUND_PAYMENTS
- Users have roles, roles have permissions
- Admin menu items filter based on user permissions via `hasAnyPermission()` check
- Permission checks use the `useIndividualUser()` hook

### Routing Structure

Three main route groups:

1. **Public Routes** (`/`, `/search`, `/product/:id`, `/contact`, `/faq`, `/login`, `/register`)
2. **User Routes** (`/user`, `/user/orders`, `/user/settings`, `/orders`, `/cart`)
3. **Admin Routes** (`/admin/*`) - Protected by permission checks

Admin routes are organized into sections:
- Dashboard: `/admin`
- Users: `/admin/users`, `/admin/roles`
- Store: `/admin/cms`, `/admin/categories`, `/admin/orders`, `/admin/products/add`
- CMS Editors: `/admin/cms/home/edit`, `/admin/cms/contact/edit`, `/admin/cms/faq/edit`

### Layout Components

- `MainLayout.tsx` - Basic layout with header/footer for public pages
- `UserLayout.tsx` - Layout for authenticated user pages
- `AdminLayout.tsx` - Sidebar navigation with collapsible menu sections, permission-based filtering

The `AdminLayout` dynamically filters menu items based on user permissions. Menu sections (Users, Store, Analytics) are collapsible and maintain their state.

### Category Management

Categories use a hierarchical tree structure visualized with React Flow and Dagre layout:

- **Components**: `CategoryTree`, `CategoryNode`, `CategoryEdge` (in `src/components/admin/categories/`)
- **Features**: Add leaf nodes, insert between parent/child, delete nodes, auto-layout
- Categories are rendered as a directed acyclic graph (DAG)
- Uses `@xyflow/react` for visualization and `dagre` for automatic tree layout

### Form Handling

Forms use Formik for state management and Yup for validation. See `src/components/forms/` for examples.

### CMS System

The CMS allows inline editing of page content:
- `EditableText` - Editable text fields
- `EditableLink` - Editable links
- `CMSToolbar` - Save/cancel UI
- CMS content is stored per-page (home, contact, faq) and fetched via `useCMS()` hook

## Type System

Type definitions are organized by domain in `src/types/`:
- `users.ts` - User, Role types
- `permissions.ts` - Permission type and constants
- `products.ts` - Product, Variant types
- `category.ts` - CategoryTreeNode, category types
- `cart.ts` - Cart item types
- `orders.ts` - Order types
- `cms.ts` - CMS content types (including CategoryFromAPI)

## Styling

- Uses Material-UI (MUI) v7 with Emotion for CSS-in-JS
- Custom theme defined in `src/utils/theme.ts`
- Admin panel uses gradient backgrounds and dark theme styling
- Component styling via `sx` prop for inline styles

## Important Conventions

1. **Import Organization**: The project uses `@trivago/prettier-plugin-sort-imports` to auto-sort imports
2. **File Extensions**: Use `.tsx` for React components, `.ts` for utilities/types
3. **API Error Handling**: API calls should catch errors and set error state in contexts
4. **Authentication Flow**: Check for token in localStorage, redirect to `/login` on 401
5. **Polish Language**: User-facing error messages and UI text are in Polish
6. **Context Hooks**: Each context has a corresponding hook (e.g., `useIndividualUser()`, `useProducts()`)

## Adding New Features

When adding admin features:
1. Define required permissions in `src/types/permissions.ts`
2. Add route to `src/App.tsx`
3. Add menu item to `AdminLayout.tsx` with `requiredPermissions` array
4. Create API service function in appropriate `src/api/*-service.ts` file
5. Create context/provider if managing complex state
6. Use existing layout components (`AdminLayout`, `UserLayout`, `MainLayout`)

## Build & Deployment

- Build output goes to `dist/` directory
- Uses Vite for building and dev server
- TypeScript strict mode enabled
- ESLint configured with React Hooks and TypeScript rules
