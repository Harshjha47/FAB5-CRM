# 🛍️ E-Commerce Backend

A robust, modular **E-Commerce Backend** built using **Node.js**, **Express**, and **MongoDB**.  
It provides secure authentication, role-based access, product & order management, and admin operations — all following a clean MVC structure.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Email Service | Nodemailer |
| Environment Management | dotenv |
| Logging & Utils | Custom logger + validator utilities |

---

## 🧱 Project Architecture

```
E-COMMERCE BACKEND/
├── server.js               # Entry point
├── src/
│   ├── app.js              # Express config
│   ├── config/db.js        # Mongo connection
│   ├── routes/             # Route definitions
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose schemas
│   ├── middlewares/        # Auth/error middleware
│   ├── services/           # Email & payment utilities
│   └── utils/              # Logger, validator
└── package.json
```

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone <repo-url>
cd E-COMMERCE BACKEND

# Install dependencies
npm install

# Create .env file in root
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL_USER=youremail@example.com
EMAIL_PASS=yourpassword

# Run development server
npm run dev
```

Server runs at: **http://localhost:5000**

---

## 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and get JWT token |
| GET | `/profile` | Get logged-in user data |
| GET | `/admin-test` | Admin test route |

### 🧪 Example – Register User

**Request**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Div",
  "email": "div@example.com",
  "password": "123456"
}
```

**Response**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "6708fc2e2d51b03f2b9e1e22",
    "name": "Div",
    "email": "div@example.com"
  },
  "token": "<JWT_TOKEN>"
}
```

---

## 👤 User Routes (`/api/users`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/register` | Create new user |
| POST | `/login` | Authenticate user |
| POST | `/request-reset` | Request password reset |
| PATCH | `/reset-password` | Reset password |
| GET | `/me` | Get profile |
| PATCH | `/me` | Update profile |
| GET | `/addresses` | Fetch all addresses |
| POST | `/address` | Add new address |
| DELETE | `/addresses/:id` | Remove address |
| GET | `/wishlist` | Get wishlist |
| POST | `/wishlist/:productId` | Add to wishlist |
| DELETE | `/wishlist/:productId` | Remove from wishlist |

---

## 🧑‍💼 Admin Routes (`/api/admin`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get specific user |
| PUT | `/users/:id/role` | Change role |
| DELETE | `/users/:id` | Delete user |
| POST | `/products` | Add product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/orders` | List all orders |
| PUT | `/orders/:id/status` | Update order status |

---

## 🛍️ Product Routes (`/api/products`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/` | Get all products |
| GET | `/:id` | Get product by ID |
| POST | `/` | Add product |
| PUT | `/:id` | Update product |
| DELETE | `/:id` | Delete product |

---

## 📦 Order Routes (`/api/orders`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/` | Create order |
| GET | `/myorders` | User’s orders |
| GET | `/:id` | Get order by ID |
| PUT | `/:id/pay` | Mark order as paid |
| PUT | `/:id/deliver` | Mark as delivered |
| GET | `/` | Admin – all orders |

### 🧪 Example – Create Order

**Request**
```bash
POST /api/orders
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "orderItems": [
    { "product": "6708f8b72d51b03f2b9e1c8b", "qty": 2 }
  ],
  "shippingAddress": {
    "address": "123 Street",
    "city": "Delhi",
    "postalCode": "110011",
    "country": "India"
  },
  "paymentMethod": "COD",
  "itemsPrice": 2000,
  "totalPrice": 2100
}
```

**Response**
```json
{
  "message": "Order created successfully",
  "orderId": "671a12efb3a1cd02f4501f92",
  "status": "Pending"
}
```

---

## 🧱 Database Schema Overview

### 🧩 User Schema
```js
{
  name: String,
  email: String,
  password: String (hashed),
  role: { type: String, enum: ["user", "admin"], default: "user" },
  addresses: [AddressSchema],
  wishlist: [ProductId]
}
```

### 📦 Product Schema
```js
{
  name: String,
  description: String,
  category: String,
  price: Number,
  stock: Number,
  images: [String]
}
```

### 🧾 Order Schema
```js
{
  user: ObjectId,
  orderItems: [{ product: ObjectId, qty: Number }],
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  totalPrice: Number,
  isPaid: Boolean,
  isDelivered: Boolean
}
```

### 🛒 Cart Schema
```js
{
  user: ObjectId,
  items: [{ product: ObjectId, quantity: Number }],
  totalPrice: Number
}
```

---

## 🔄 ER Diagram / Data Flow (Textual Description)

```
User 1───∞ Order 1───∞ OrderItem
User 1───1 Cart 1───∞ CartItem
User 1───∞ WishlistItem
OrderItem ∞───1 Product
Product ∞───1 Category
```

**Flow Summary:**
1. A **User** registers/logs in → receives JWT.  
2. **Products** are managed by admins.  
3. Users add products to **Cart/Wishlist**.  
4. Orders are created → payment processed → order status updated.  
5. Admins can view/manage all orders and users.

---

## 🧰 Middlewares

| File | Purpose |
|------|----------|
| `authMiddleware.js` | JWT authentication & role-based access |
| `errorMiddleware.js` | Centralized error handling |

---

## 📧 Services

| File | Description |
|------|-------------|
| `emailService.js` | Sends registration, order, and password reset emails |
| `paymentService.js` | Integrates with payment gateway (Stripe/Razorpay ready) |

---

## 🧑‍💻 Contribution

1. Fork the repo  
2. Create your feature branch: `git checkout -b feature/your-feature`  
3. Commit changes: `git commit -m 'Add new feature'`  
4. Push branch: `git push origin feature/your-feature`  
5. Open a Pull Request 🎉

---

## 🪪 License

This project is licensed under the **MIT License** — free for personal and commercial use.

---

## 📞 Contact

**Author:** Div  
**Email:** you@example.com  
**GitHub:** [your-github-link]  
**LinkedIn:** [your-linkedin-profile]  

---

> 💡 *This backend is fully modular — easy to scale with features like coupons, analytics, and inventory management.*
