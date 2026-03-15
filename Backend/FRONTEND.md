# FAB5 CRM — Auth Routes Documentation

## Base URL
```
Development:  http://localhost:5000/api/users
Production:   https://api.fab5network.com/api/users
```

## Authentication
Protected routes require the `accessToken` in the request header:
```
Authorization: Bearer <accessToken>
```

## Response Format
All responses follow this structure:
```json
{
  "success": true | false,
  "message": "Human readable message",
  "data": { ... }
}
```

## Rate Limiting
Auth routes are rate limited to **10 requests per 15 minutes** per IP.
All other routes are limited to **200 requests per 15 minutes** per IP.

---

# Registration

## POST `/register/send-otp`
Validates company email domain and sends a 6-digit OTP to the provided email. OTP is valid for 10 minutes.

### Access
```
Public — no authentication required
Rate limited — 10 requests per 15 min
Domain restricted — only @fab5network.com emails
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@fab5network.com",
  "password": "mypassword123"
}
```

### Field Rules
| Field | Type | Required | Rules |
|---|---|---|---|
| `email` | String | ✅ | Must be `@fab5network.com` domain |
| `password` | String | ✅ | Minimum 8 characters |

### Success Response `200`
```json
{
  "success": true,
  "message": "OTP sent to your email. Valid for 10 minutes."
}
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `400` | Missing email or password | `"Email and password are required"` |
| `400` | Password less than 8 characters | `"Password must be at least 8 characters"` |
| `403` | Email not from company domain | `"Only company email addresses are allowed"` |
| `409` | Email already registered | `"An account with this email already exists"` |
| `429` | Too many requests | `"Too many login attempts, please try again later."` |
| `500` | EmailJS failure | `"Failed to send OTP. Please try again."` |

### Notes
- OTP is generated **server-side** — never trust client-provided OTPs
- OTP is hashed with SHA-256 before storing in Redis
- Redis key format: `otp:john@fab5network.com`
- OTP expires automatically after 10 minutes

---

## POST `/register/verify`
Verifies the OTP and creates the user account. Issues access and refresh tokens on success.

### Access
```
Public — no authentication required
Rate limited — 10 requests per 15 min
Domain restricted — only @fab5network.com emails
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@fab5network.com",
  "password": "mypassword123",
  "otp": "847291",
  "name": "John Doe"
}
```

### Field Rules
| Field | Type | Required | Rules |
|---|---|---|---|
| `email` | String | ✅ | Must match email from Step 1 |
| `password` | String | ✅ | Must match password from Step 1 |
| `otp` | String | ✅ | 6-digit code from email |
| `name` | String | ❌ | Optional — max 50 characters |

### Success Response `201`
```json
{
  "success": true,
  "message": "Account created. Please complete your profile.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@fab5network.com",
    "role": "employee",
    "phone": null,
    "dob": null,
    "isProfileComplete": false,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "redirect": "/profile"
}
```

### Cookie Set
```
Name:     refreshToken
Value:    <random 80 char hex string>
HttpOnly: true
Secure:   true (production only)
SameSite: Strict (production) / Lax (development)
MaxAge:   7 days
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `400` | Missing any required field | `"Email, password and OTP are required"` |
| `400` | Wrong OTP entered | `"Invalid or expired OTP"` |
| `400` | OTP expired (10 min passed) | `"Invalid or expired OTP"` |
| `403` | Wrong email domain | `"Only company email addresses are allowed"` |
| `409` | Email already registered (race condition) | `"An account with this email already exists"` |
| `429` | Too many requests | `"Too many login attempts, please try again later."` |

### Notes
- Password is hashed with bcrypt (salt rounds: 10) via Mongoose pre-save hook
- `refreshToken` is hashed with SHA-256 before storing in MongoDB
- OTP is deleted from Redis after successful verification
- `role` defaults to `"employee"` — only admin can change roles
- `redirect` field tells frontend where to navigate

---

# Authentication

## POST `/login`
Authenticates user credentials and issues new access and refresh tokens.

### Access
```
Public — no authentication required
Rate limited — 10 requests per 15 min
Domain restricted — only @fab5network.com emails
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@fab5network.com",
  "password": "mypassword123"
}
```

### Field Rules
| Field | Type | Required | Rules |
|---|---|---|---|
| `email` | String | ✅ | Must be `@fab5network.com` domain |
| `password` | String | ✅ | User's current password |

### Success Response `200`
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@fab5network.com",
    "role": "employee",
    "phone": "9876543210",
    "dob": "1995-06-15T00:00:00.000Z",
    "isProfileComplete": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "redirect": "/dashboard"
}
```

### Redirect Values
| Value | Condition |
|---|---|
| `"/profile"` | `isProfileComplete: false` — new employee, profile not filled yet |
| `"/dashboard"` | `isProfileComplete: true` — returning employee |

### Cookie Set
```
Name:     refreshToken
HttpOnly: true
MaxAge:   7 days
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `400` | Missing email or password | `"Email and password are required"` |
| `401` | Wrong email | `"Invalid email or password"` |
| `401` | Wrong password | `"Invalid email or password"` (same message — prevents user enumeration) |
| `401` | Account deactivated by admin | `"Your account has been deactivated. Contact your administrator."` |
| `403` | Wrong email domain | `"Only company email addresses are allowed"` |
| `429` | Too many attempts | `"Too many login attempts, please try again later."` |

### Notes
- Wrong email and wrong password return **identical error messages** intentionally — prevents attackers from discovering which emails are registered
- Each login **rotates the refresh token** — new token issued, old one replaced in DB
- `accessToken` expires in **15 minutes**
- `refreshToken` expires in **7 days**

---

## POST `/refresh`
Issues a new access token using the refresh token stored in the httpOnly cookie. Called automatically by frontend when a 401 is received.

### Access
```
Public — no authentication required
Not rate limited — must work even under high load
Requires refreshToken cookie (sent automatically by browser)
```

### Request Headers
```
No additional headers needed
Cookie sent automatically by browser if withCredentials: true
```

### Request Body
```
None
```

### Success Response `200`
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Cookie Rotated
```
Old refreshToken cookie → deleted
New refreshToken cookie → set (new 7 day expiry)
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `401` | No refresh token cookie | `"Refresh token not found, Please log in"` |
| `401` | Token not found in DB | `"Invalid or expired refresh token, Please log in"` |
| `401` | Token expired in DB | `"Invalid or expired refresh token, Please log in"` |
| `401` | Account deactivated | `"Your account has been deactivated."` |

### Notes
- Refresh token is **rotated on every call** — each refresh issues a brand new refresh token
- This limits the window of a stolen refresh token to one use
- Cookie is automatically cleared on error responses
- Frontend should redirect to `/login` if this endpoint returns 401

---

## POST `/logout`
Deletes the refresh token from the database and clears the cookie. Ends the user session completely.

### Access
```
Protected — requires valid accessToken
```

### Request Headers
```
Authorization: Bearer <accessToken>
```

### Request Body
```
None
```

### Success Response `200`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Cookie Cleared
```
refreshToken cookie → deleted
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `401` | No access token | `"Not authorized, token missing"` |
| `401` | Expired access token | `"Token expired, please log in again"` |
| `401` | Invalid access token | `"Invalid token, authentication failed"` |

### Notes
- Refresh token is deleted from MongoDB — user cannot get new access tokens
- Even if logout is called without a cookie, it succeeds gracefully
- After logout, old `accessToken` still technically works until it expires (15 min) — this is acceptable since access tokens are short-lived
- For immediate invalidation, admin should also set `isActive: false`

---

# Profile

## GET `/me`
Returns the authenticated user's profile including their own sensitive data and assigned customers.

### Access
```
Protected — requires valid accessToken
```

### Request Headers
```
Authorization: Bearer <accessToken>
```

### Request Body
```
None
```

### Success Response `200`
```json
{
  "success": true,
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@fab5network.com",
    "role": "employee",
    "phone": "9876543210",
    "dob": "1995-06-15T00:00:00.000Z",
    "isProfileComplete": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "adharNumber": "123456789012",
    "panNumber": "ABCDE1234F"
  },
  "customers": [
    {
      "id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Acme Corp",
      "phone": "9876543210",
      "status": "Active",
      "circuitId": "CKT-2024-00001"
    }
  ]
}
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `401` | No token | `"Not authorized, token missing"` |
| `401` | Expired token | `"Token expired, please log in again"` |
| `401` | Invalid token | `"Invalid token, authentication failed"` |
| `401` | Account deactivated | `"Your account has been deactivated."` |
| `404` | User deleted from DB | `"User not found"` |

### Notes
- `adharNumber` and `panNumber` are returned **only on this route** — never on login or register responses
- `customers` is limited to 50 records — paginate separately for full list
- `customers` shows only customers managed by this user

---

## PUT `/me`
Updates the authenticated user's profile. Marks `isProfileComplete: true` on first completion.

### Access
```
Protected — requires valid accessToken
```

### Request Headers
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Request Body
```json
{
  "name": "John Doe",
  "dob": "1995-06-15",
  "phone": "9876543210",
  "adharNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "password": "newpassword123"
}
```

### Field Rules
| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | String | ✅ | Max 50 characters |
| `dob` | Date | ✅ | Valid date string `YYYY-MM-DD` |
| `phone` | String | ✅ | Indian mobile — starts with 6-9, exactly 10 digits |
| `adharNumber` | String | ✅ | Exactly 12 digits |
| `panNumber` | String | ✅ | Format: `ABCDE1234F` (5 letters, 4 digits, 1 letter) |
| `password` | String | ❌ | Optional — min 8 characters if provided |

### Success Response `200`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@fab5network.com",
    "role": "employee",
    "phone": "9876543210",
    "dob": "1995-06-15T00:00:00.000Z",
    "isProfileComplete": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "redirect": "/dashboard"
}
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `400` | Any required field missing | `"All fields are required to complete your profile"` |
| `400` | Invalid phone number | `"Please enter a valid 10-digit Indian mobile number"` |
| `400` | Invalid Aadhaar | `"Aadhaar number must be exactly 12 digits"` |
| `400` | Invalid PAN | `"Please enter a valid PAN number"` |
| `400` | Short new password | `"Password must be at least 8 characters"` |
| `401` | No or invalid token | Auth error |
| `404` | User not found | `"User not found"` |

### Notes
- `adharNumber` and `panNumber` are unique — if another user has the same value, save will fail with a duplicate key error
- `isProfileComplete` is set to `true` automatically — no need to send it
- `redirect: "/dashboard"` tells frontend to navigate after update
- Password field is optional — only include if user wants to change it

---

## GET `/all`
Returns dashboard data based on the authenticated user's role.

### Access
```
Protected — requires valid accessToken
All roles can access but response data differs by role
```

### Request Headers
```
Authorization: Bearer <accessToken>
```

### Query Parameters
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | Number | `1` | Page number for pagination |
| `limit` | Number | `25` | Records per page |

### Example Request
```
GET /api/users/all?page=1&limit=25
```

### Success Response — Admin / Owner `200`
```json
{
  "success": true,
  "role": "admin",
  "users": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@fab5network.com",
      "role": "employee",
      "isActive": true,
      "createdAt": "..."
    }
  ],
  "customers": [
    {
      "id": "...",
      "name": "Acme Corp",
      "managedBy": { "name": "John Doe", "email": "john@fab5network.com", "role": "employee" }
    }
  ],
  "orders": [
    {
      "id": "...",
      "customer": { "name": "Acme Corp", "circuitId": "CKT-2024-00001" },
      "status": "Active"
    }
  ]
}
```

### Success Response — Employee `200`
```json
{
  "success": true,
  "role": "employee",
  "customers": [
    {
      "id": "...",
      "name": "Acme Corp",
      "phone": "9876543210",
      "status": "Active",
      "circuitId": "CKT-2024-00001"
    }
  ],
  "orders": [
    {
      "id": "...",
      "customer": { "name": "Acme Corp", "circuitId": "CKT-2024-00001" },
      "status": "Active"
    }
  ]
}
```

### Success Response — Order Generation `200`
```json
{
  "success": true,
  "role": "order_generation",
  "orders": [
    {
      "id": "...",
      "customer": { "name": "Acme Corp", "circuitId": "CKT-2024-00001" },
      "status": "Approved"
    }
  ]
}
```
> ⚠️ Pricing fields are stripped from orders for this role

### Success Response — Project Manager `200`
```json
{
  "success": true,
  "role": "project_manager",
  "orders": [
    {
      "id": "...",
      "customer": {
        "name": "Acme Corp",
        "circuitId": "CKT-2024-00001",
        "address": "..."
      },
      "status": "Generated"
    }
  ]
}
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `401` | No or invalid token | Auth error |

---

# Password Reset

## POST `/request-reset`
Sends a password reset OTP to the provided email if it exists in the system.

### Access
```
Public — no authentication required
Rate limited — 10 requests per 15 min
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@fab5network.com"
}
```

### Success Response `200`
```json
{
  "success": true,
  "message": "If this email exists, an OTP has been sent."
}
```

> ⚠️ **Always returns the same response** whether the email exists or not. This is intentional — prevents attackers from discovering which emails are registered (email enumeration attack).

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `400` | Missing email | `"Email is required"` |
| `429` | Too many requests | `"Too many login attempts, please try again later."` |
| `500` | Email send failure | `"Failed to send OTP. Please try again."` |

### Notes
- OTP stored in Redis with key `otp:reset:john@fab5network.com`
- OTP expires in 10 minutes
- Do NOT tell the user if the email exists or not

---

## POST `/verify-reset-otp`
Verifies the password reset OTP and issues a short-lived reset token.

### Access
```
Public — no authentication required
Rate limited — 10 requests per 15 min
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@fab5network.com",
  "otp": "847291"
}
```

### Field Rules
| Field | Type | Required | Rules |
|---|---|---|---|
| `email` | String | ✅ | Must match email from Step 1 |
| `otp` | String | ✅ | 6-digit code from email |

### Success Response `200`
```json
{
  "success": true,
  "message": "OTP verified. Use the reset token to set your new password.",
  "resetToken": "a3f8c2d1e4b5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
}
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `400` | Missing fields | `"Email and OTP are required"` |
| `400` | Wrong OTP | `"Invalid or expired OTP"` |
| `400` | OTP expired | `"Invalid or expired OTP"` |
| `429` | Too many requests | `"Too many login attempts, please try again later."` |

### Notes
- `resetToken` is valid for **15 minutes** only
- Store `resetToken` in React state — **never in localStorage**
- OTP is deleted from Redis after successful verification
- Reset token is hashed with SHA-256 before storing in MongoDB

---

## PATCH `/reset-password`
Sets a new password using the reset token received from Step 2.

### Access
```
Public — no authentication required
Rate limited — 10 requests per 15 min
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "resetToken": "a3f8c2d1e4b5f6a7b8c9d0e1f2a3b4c5...",
  "password": "mynewpassword123"
}
```

### Field Rules
| Field | Type | Required | Rules |
|---|---|---|---|
| `resetToken` | String | ✅ | Token from Step 2, valid 15 min |
| `password` | String | ✅ | Minimum 8 characters |

### Success Response `200`
```json
{
  "success": true,
  "message": "Password reset successful. Please log in with your new password."
}
```

### Cookie Cleared
```
refreshToken cookie → deleted (all existing sessions invalidated)
```

### Error Responses
| Status | Scenario | Message |
|---|---|---|
| `400` | Missing fields | `"Reset token and new password are required"` |
| `400` | Invalid reset token | `"Reset token is invalid or has expired"` |
| `400` | Expired reset token (15 min) | `"Reset token is invalid or has expired"` |
| `400` | Password too short | `"Password must be at least 8 characters"` |
| `429` | Too many requests | `"Too many login attempts, please try again later."` |

### Notes
- All existing sessions are **invalidated** after password reset
- User must log in again with new password
- Old refresh tokens no longer work
- Frontend should redirect to `/login` after success

---

# Health Check

## GET `/health`
Returns server and database health status.

### Access
```
Public — no authentication required
Not rate limited
```

### Success Response `200`
```json
{
  "status": "OK",
  "db": "connected",
  "uptime": 3600.5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### DB Values
| Value | Meaning |
|---|---|
| `"connected"` | MongoDB is healthy |
| `"disconnected"` | MongoDB is down |

---

# Complete Routes Reference

| Method | Route | Auth | Rate Limited | Description |
|---|---|---|---|---|
| `POST` | `/api/users/register/send-otp` | ❌ | ✅ | Step 1: Send registration OTP |
| `POST` | `/api/users/register/verify` | ❌ | ✅ | Step 2: Verify OTP, create account |
| `POST` | `/api/users/login` | ❌ | ✅ | Login, receive tokens |
| `POST` | `/api/users/refresh` | 🍪 | ❌ | Get new access token silently |
| `POST` | `/api/users/logout` | ✅ | ❌ | End session, clear cookie |
| `GET` | `/api/users/me` | ✅ | ❌ | Get own profile |
| `PUT` | `/api/users/me` | ✅ | ❌ | Update profile |
| `GET` | `/api/users/all` | ✅ | ❌ | Role-based dashboard data |
| `POST` | `/api/users/request-reset` | ❌ | ✅ | Step 1: Send reset OTP |
| `POST` | `/api/users/verify-reset-otp` | ❌ | ✅ | Step 2: Verify OTP, get reset token |
| `PATCH` | `/api/users/reset-password` | ❌ | ✅ | Step 3: Set new password |
| `GET` | `/health` | ❌ | ❌ | Server health check |

---

# Fields Never Returned in Any Response

These fields are always excluded from all API responses regardless of route:

```
password
refreshToken
refreshTokenExpire
resetPasswordToken
resetPasswordExpire
adharNumber  (except GET /me — own profile only)
panNumber    (except GET /me — own profile only)
```
