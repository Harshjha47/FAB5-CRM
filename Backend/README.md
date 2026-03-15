# Project Structure
# Project Structure

A full-stack web application with a **feature-based frontend** and a **module-based backend**.
A full-stack web application with a **feature-based frontend** and a **module-based backend**.

---

## 📁 Frontend — Feature-Based Structure

Each feature owns all its logic, components, hooks, and styles. No cross-feature imports except through shared layers.

```
frontend/
├── public/
│   └── assets/                  # Static assets (favicon, images, fonts)
│
## 📁 Frontend — Feature-Based Structure

Each feature owns all its logic, components, hooks, and styles. No cross-feature imports except through shared layers.

```
frontend/
├── public/
│   └── assets/                  # Static assets (favicon, images, fonts)
│
├── src/
│   ├── features/                # 🔑 Core of the app — one folder per feature
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   ├── services/
│   │   │   │   └── auth.service.js   # API calls for this feature
│   │   │   ├── store/
│   │   │   │   └── authSlice.js      # Redux slice / Zustand store
│   │   │   └── index.js              # Public API — what this feature exports
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UserProfile.jsx
│   │   │   │   └── UserAvatar.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useUser.js
│   │   │   ├── services/
│   │   │   │   └── user.service.js
│   │   │   ├── store/
│   │   │   │   └── userSlice.js
│   │   │   └── index.js
│   │   │
│   │   └── uploads/
│   │       ├── components/
│   │       │   ├── FileUploader.jsx
│   │       │   └── UploadProgress.jsx
│   │       ├── hooks/
│   │       │   └── useUpload.js
│   │       ├── services/
│   │       │   └── upload.service.js
│   │       └── index.js
│   │
│   ├── shared/                  # Reusable across all features
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Modal/
│   │   │   │   └── Modal.jsx
│   │   │   └── Input/
│   │   │       └── Input.jsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   └── usePagination.js
│   │   └── utils/
│   │       ├── formatDate.js
│   │       └── validators.js
│   │
│   ├── lib/                     # Third-party config & wrappers
│   │   ├── axios.js             # Axios instance with interceptors
│   │   ├── queryClient.js       # React Query / TanStack config
│   │   └── store.js             # Global Redux/Zustand store setup
│   │
│   ├── layouts/                 # Page shell components
│   │   ├── MainLayout.jsx       # Sidebar + header wrapper
│   │   └── AuthLayout.jsx       # Centered card layout for auth pages
│   │
│   ├── pages/                   # Route-level components (thin wrappers)
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx        # All route definitions
│   │   └── ProtectedRoute.jsx   # Auth guard HOC
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css        # CSS custom properties / design tokens
│   │
│   └── main.jsx                 # App entry point
│
├── .env
├── .env.example
├── index.html
├── vite.config.js
│   ├── features/                # 🔑 Core of the app — one folder per feature
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   ├── services/
│   │   │   │   └── auth.service.js   # API calls for this feature
│   │   │   ├── store/
│   │   │   │   └── authSlice.js      # Redux slice / Zustand store
│   │   │   └── index.js              # Public API — what this feature exports
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UserProfile.jsx
│   │   │   │   └── UserAvatar.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useUser.js
│   │   │   ├── services/
│   │   │   │   └── user.service.js
│   │   │   ├── store/
│   │   │   │   └── userSlice.js
│   │   │   └── index.js
│   │   │
│   │   └── uploads/
│   │       ├── components/
│   │       │   ├── FileUploader.jsx
│   │       │   └── UploadProgress.jsx
│   │       ├── hooks/
│   │       │   └── useUpload.js
│   │       ├── services/
│   │       │   └── upload.service.js
│   │       └── index.js
│   │
│   ├── shared/                  # Reusable across all features
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Modal/
│   │   │   │   └── Modal.jsx
│   │   │   └── Input/
│   │   │       └── Input.jsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   └── usePagination.js
│   │   └── utils/
│   │       ├── formatDate.js
│   │       └── validators.js
│   │
│   ├── lib/                     # Third-party config & wrappers
│   │   ├── axios.js             # Axios instance with interceptors
│   │   ├── queryClient.js       # React Query / TanStack config
│   │   └── store.js             # Global Redux/Zustand store setup
│   │
│   ├── layouts/                 # Page shell components
│   │   ├── MainLayout.jsx       # Sidebar + header wrapper
│   │   └── AuthLayout.jsx       # Centered card layout for auth pages
│   │
│   ├── pages/                   # Route-level components (thin wrappers)
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx        # All route definitions
│   │   └── ProtectedRoute.jsx   # Auth guard HOC
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css        # CSS custom properties / design tokens
│   │
│   └── main.jsx                 # App entry point
│
├── .env
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

### Frontend Layer Responsibilities

| Layer | Responsibility |
|---|---|
| `features/` | Self-contained feature modules — components, state, API calls |
| `shared/` | Generic, reusable UI components and utilities with no business logic |
| `lib/` | Configuration and setup for third-party libraries |
| `layouts/` | Page shell structure — header, sidebar, footer wrappers |
| `pages/` | Thin route-level components that compose feature components |
| `routes/` | Route definitions and auth-protected route guards |
### Frontend Layer Responsibilities

| Layer | Responsibility |
|---|---|
| `features/` | Self-contained feature modules — components, state, API calls |
| `shared/` | Generic, reusable UI components and utilities with no business logic |
| `lib/` | Configuration and setup for third-party libraries |
| `layouts/` | Page shell structure — header, sidebar, footer wrappers |
| `pages/` | Thin route-level components that compose feature components |
| `routes/` | Route definitions and auth-protected route guards |

### Feature Request Flow

```
Page (pages/)
  → Layout (layouts/)
  → Feature Component (features/auth/components/)
  → Feature Hook (features/auth/hooks/)
  → Feature Service (features/auth/services/)
  → Axios instance (lib/axios.js)
  → Backend API
### Feature Request Flow

```
Page (pages/)
  → Layout (layouts/)
  → Feature Component (features/auth/components/)
  → Feature Hook (features/auth/hooks/)
  → Feature Service (features/auth/services/)
  → Axios instance (lib/axios.js)
  → Backend API
```

---

## 📁 Backend — Module-Based Structure

Each module encapsulates its own routes, controller, service, model, and validators. Business logic never leaks between layers.

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                # Database connection (Mongoose / Sequelize)
│   │   ├── env.js               # Env var validation & export
│   │   └── multer.js            # File upload configuration
│   │
│   ├── modules/                 # 🔑 Core of the app — one folder per domain
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.js       # POST /auth/login, /auth/register, /auth/refresh
│   │   │   ├── auth.controller.js   # Parse req/res, delegate to service
│   │   │   ├── auth.service.js      # Token generation, credential validation
│   │   │   └── auth.validator.js    # Zod/Joi schemas for auth payloads
│   │   │
│   │   ├── users/
│   │   │   ├── user.routes.js       # GET /users/:id, PATCH /users/:id, DELETE /users/:id
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js      # CRUD operations, business rules
│   │   │   ├── user.model.js        # DB schema / ORM model
│   │   │   └── user.validator.js
│   │   │
│   │   └── uploads/
│   │       ├── upload.routes.js     # POST /uploads, DELETE /uploads/:id
│   │       ├── upload.controller.js
│   │       └── upload.service.js    # File handling, S3/local storage logic
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification — protects private routes
│   │   ├── error.middleware.js   # Global error handler (must be last in app.js)
│   │   ├── validate.middleware.js # Runs Zod/Joi schema against req.body
│   │   └── rateLimiter.js        # express-rate-limit config
│   │
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class with statusCode
│   │   ├── ApiResponse.js        # Standardized success response wrapper
│   │   ├── asyncHandler.js       # Wraps async controllers — no try/catch needed
│   │   └── token.js              # JWT sign / verify helpers
│   │
│   └── app.js                   # Express app — registers middleware & routers
│
├── .env
├── .env.example
├── package.json
└── server.js                    # Entry point — DB connect → app.listen
```

### Backend Layer Responsibilities

| Layer | Responsibility |
|---|---|
| `server.js` | Boot only — connects DB, starts HTTP server |
| `app.js` | Registers global middleware (CORS, helmet, morgan) and mounts routers |
| `config/` | All external connection setup (DB, storage, env) |
| `modules/` | Feature-scoped routes, controllers, services, models, validators |
| `middlewares/` | Cross-cutting concerns — auth, validation, errors, rate limiting |
| `utils/` | Pure helper functions with no business logic or side effects |

### Backend Request Lifecycle

```
HTTP Request
  → Router (module.routes.js)
  → Middleware (validate → authGuard)
  → Controller (parse req, call service)
  → Service (business logic, DB queries)
  → Model (DB schema / ORM)
  → Controller (return ApiResponse)
  → HTTP Response
## 📁 Backend — Module-Based Structure

Each module encapsulates its own routes, controller, service, model, and validators. Business logic never leaks between layers.

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                # Database connection (Mongoose / Sequelize)
│   │   ├── env.js               # Env var validation & export
│   │   └── multer.js            # File upload configuration
│   │
│   ├── modules/                 # 🔑 Core of the app — one folder per domain
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.js       # POST /auth/login, /auth/register, /auth/refresh
│   │   │   ├── auth.controller.js   # Parse req/res, delegate to service
│   │   │   ├── auth.service.js      # Token generation, credential validation
│   │   │   └── auth.validator.js    # Zod/Joi schemas for auth payloads
│   │   │
│   │   ├── users/
│   │   │   ├── user.routes.js       # GET /users/:id, PATCH /users/:id, DELETE /users/:id
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js      # CRUD operations, business rules
│   │   │   ├── user.model.js        # DB schema / ORM model
│   │   │   └── user.validator.js
│   │   │
│   │   └── uploads/
│   │       ├── upload.routes.js     # POST /uploads, DELETE /uploads/:id
│   │       ├── upload.controller.js
│   │       └── upload.service.js    # File handling, S3/local storage logic
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT verification — protects private routes
│   │   ├── error.middleware.js   # Global error handler (must be last in app.js)
│   │   ├── validate.middleware.js # Runs Zod/Joi schema against req.body
│   │   └── rateLimiter.js        # express-rate-limit config
│   │
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class with statusCode
│   │   ├── ApiResponse.js        # Standardized success response wrapper
│   │   ├── asyncHandler.js       # Wraps async controllers — no try/catch needed
│   │   └── token.js              # JWT sign / verify helpers
│   │
│   └── app.js                   # Express app — registers middleware & routers
│
├── .env
├── .env.example
├── package.json
└── server.js                    # Entry point — DB connect → app.listen
```

### Backend Layer Responsibilities

| Layer | Responsibility |
|---|---|
| `server.js` | Boot only — connects DB, starts HTTP server |
| `app.js` | Registers global middleware (CORS, helmet, morgan) and mounts routers |
| `config/` | All external connection setup (DB, storage, env) |
| `modules/` | Feature-scoped routes, controllers, services, models, validators |
| `middlewares/` | Cross-cutting concerns — auth, validation, errors, rate limiting |
| `utils/` | Pure helper functions with no business logic or side effects |

### Backend Request Lifecycle

```
HTTP Request
  → Router (module.routes.js)
  → Middleware (validate → authGuard)
  → Controller (parse req, call service)
  → Service (business logic, DB queries)
  → Model (DB schema / ORM)
  → Controller (return ApiResponse)
  → HTTP Response
```

---

## 🔗 Frontend ↔ Backend Communication

```
Frontend Feature Service   →   Axios instance (lib/axios.js)
  ↓                               ↓
Attaches JWT token          Base URL from .env
  ↓
Backend Route → Middleware → Controller → Service → DB
  ↓
Standardized ApiResponse { success, statusCode, data, message }
  ↓
Frontend renders data or handles error globally via interceptor
```
## 🔗 Frontend ↔ Backend Communication

```
Frontend Feature Service   →   Axios instance (lib/axios.js)
  ↓                               ↓
Attaches JWT token          Base URL from .env
  ↓
Backend Route → Middleware → Controller → Service → DB
  ↓
Standardized ApiResponse { success, statusCode, data, message }
  ↓
Frontend renders data or handles error globally via interceptor
```

---

## ⚙️ Tech Stack
## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| State Management | Redux Toolkit / Zustand |
| Data Fetching | TanStack Query (React Query) |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Authentication | JWT (`jsonwebtoken` + `bcryptjs`) |
| Validation | Zod |
| Database | MongoDB + Mongoose / PostgreSQL + Sequelize |
| File Uploads | Multer |
| Security | Helmet, express-rate-limit |
and more to be added

---