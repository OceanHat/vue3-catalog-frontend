# Vue 3 Catalog Frontend

A modern, full-featured catalog application built with Vue 3, Vuex, Vue Router, and Tailwind CSS. This project follows best practices for component architecture, state management, and routing.

## Features

- 🎨 **Modern UI**: Built with Tailwind CSS for a responsive, beautiful design
- 🔐 **Authentication**: Complete login/logout flow with JWT token management
- 📦 **Category Management**: Browse and manage product categories
- 🛍️ **Item Management**: Full CRUD operations for catalog items
- 👨‍💼 **Admin Dashboard**: Comprehensive admin interface for managing content
- 🔍 **Filtering & Sorting**: Advanced filtering and sorting capabilities
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Performance**: Lazy-loaded routes and optimized rendering
- 🎯 **Type-Safe**: Structured with composables and proper TypeScript patterns

## Tech Stack

- **Vue 3**: Progressive JavaScript framework
- **Vuex 4**: State management
- **Vue Router 4**: Client-side routing
- **Axios**: HTTP client for API requests
- **Tailwind CSS 3**: Utility-first CSS framework
- **Vite**: Next-generation frontend build tool

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, styles
│   ├── components/      # Reusable components
│   │   ├── common/      # Common UI components
│   │   ├── items/       # Item-related components
│   │   └── categories/  # Category-related components
│   ├── views/           # Page components
│   ├── router/          # Vue Router configuration
│   ├── store/           # Vuex store modules
│   ├── services/        # API service layer
│   ├── composables/     # Composition API reusable logic
│   ├── utils/           # Helper functions
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── .env.example         # Environment variables template
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (see backend-architecture.md)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OceanHat/vue3-catalog-frontend.git
   cd vue3-catalog-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Architecture Overview

### Component Architecture

The application follows a layered architecture:

1. **View Layer** (`views/`): Page-level components tied to routes
2. **Component Layer** (`components/`): Reusable UI components
3. **Service Layer** (`services/`): API communication abstraction
4. **Store Layer** (`store/`): Centralized state management with Vuex
5. **Router Layer** (`router/`): Navigation and routing

### State Management

Vuex store is organized into namespaced modules:

- **auth**: User authentication state
- **items**: Item catalog state
- **categories**: Category state
- **ui**: UI state (notifications, dialogs)

### Component Communication

- **Props**: Parent to child data flow
- **Events**: Child to parent communication
- **Vuex**: Global state management
- **Composables**: Reusable logic with Composition API

## Key Features

### Authentication

- Login/logout functionality
- JWT token management with auto-refresh
- Protected routes with navigation guards
- Role-based access control (admin/user)

### Item Management

- Browse items with pagination
- View detailed item information
- Admin: Create, update, delete items
- Admin: Toggle item visibility
- Filter and sort items
- Dynamic additional data fields

### Category Management

- Browse categories
- View items by category
- Admin: Create, update, delete categories
- Category images and descriptions

### Admin Dashboard

- Tabbed interface for items and categories
- Modal forms for creating/editing
- Inline editing and deletion
- Confirmation dialogs for destructive actions

## Development Guidelines

### Component Best Practices

1. Keep components small and focused
2. Use props for data input, events for output
3. Prefer composition over inheritance
4. Use computed properties for derived data
5. Always use `:key` in `v-for` loops

### State Management

1. Use Vuex for global state
2. Keep local state in components when possible
3. Use getters for computed state
4. Never mutate state directly (use mutations)
5. Use actions for async operations

### Styling

1. Use Tailwind utility classes
2. Create component classes with `@apply` for reusable patterns
3. Follow mobile-first responsive design
4. Maintain consistent spacing and typography

### API Integration

1. All API calls go through service layer
2. Handle errors gracefully
3. Show loading states
4. Use interceptors for auth headers

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |

## API Endpoints

The frontend expects the following API endpoints:

### Authentication
- `POST /auth/login`: User login
- `POST /auth/logout`: User logout
- `POST /auth/refresh`: Refresh token
- `GET /auth/me`: Get current user

### Categories
- `GET /categories`: List categories
- `GET /categories/:slug`: Get category detail
- `POST /categories`: Create category (admin)
- `PUT /categories/:slug`: Update category (admin)
- `DELETE /categories/:slug`: Delete category (admin)

### Items
- `GET /items`: List items
- `GET /items/:slug`: Get item detail
- `POST /items`: Create item (admin)
- `PUT /items/:slug`: Update item (admin)
- `DELETE /items/:slug`: Delete item (admin)
- `PATCH /items/:slug/visibility`: Toggle visibility (admin)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or production.

## Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for the lightning-fast build tool
