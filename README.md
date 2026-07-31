# 🛒 MERN Shop – Full Stack E-Commerce Platform

A modern and fully responsive e-commerce application built with the MERN stack (MongoDB, Express.js, React, and Node.js).

This project provides a complete online shopping experience, including authentication, product management, shopping cart, wishlist, order tracking, online payments, notifications, and an advanced admin dashboard.

---

## 🚀 Live Demo

🌐 Frontend

https://your-frontend-url.vercel.app

⚙️ Backend API

https://your-backend-url.onrender.com

📦 GitHub Repository

https://github.com/luvpradeep/mern-ecommerce

---

## ✨ Features

### 👤 User Features

- User registration and login
- JWT authentication
- Email verification with OTP
- Forgot password using OTP
- User profile management
- Product search and filtering
- Product sorting and pagination
- Product reviews and ratings
- Shopping cart
- Wishlist management
- Checkout process
- Razorpay payment integration
- Order history
- Invoice PDF generation
- Notification system
- Responsive mobile-friendly design

---

### 👨‍💼 Admin Features

- Admin authentication
- Dashboard analytics
- Product management (CRUD)
- User management
- Order management
- Revenue statistics
- Low-stock product monitoring
- Sales reports
- Charts and analytics

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- React Toastify
- React Icons
- Chart.js
- CSS3

---

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js
- Multer
- Cloudinary
- PDFKit

---

### Database

- MongoDB Atlas
- Mongoose

---

### Payment Gateway

- Razorpay

---

## ☁️ Deployment


- Frontend | Vercel
- Backend | Render
- Database | MongoDB Atlas
- Image Storage | Cloudinary

---

## 📂 Project Structure

```bash
mern-ecommerce/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── screenshots/
│
└── README.md
```

---

## 📸 Screenshots

### 🔐 Login Page

Displays:

- User login
- JWT authentication
- Remember me functionality
- Forgot password link

<img src="./screenshots/login.png" width="100%">

---

### 📝 Register Page

Displays:

- User registration
- Name, email, and password validation
- OTP verification
- Responsive design

<img src="./screenshots/register.png" width="100%">

---

### 🔑 Forgot Password Page

Displays:

- Email verification
- OTP generation
- Password reset

<img src="./screenshots/forgot-password.png" width="100%">

---

### 🏠 Home Page

Displays:

- Hero section
- Product search
- Category filters
- Product grid
- Pagination

<img src="./screenshots/home.png" width="100%">

---

### 📱 Product Details Page

Displays:

- Product image
- Product description
- Reviews and ratings
- Add to Cart button
- Wishlist button

<img src="./screenshots/product-details.png" width="100%">

---

### 🛒 Cart Page

Displays:

- Selected products
- Quantity management
- Price summary
- Remove item option

<img src="./screenshots/cart.png" width="100%">

---

### ❤️ Wishlist Page

Displays:

- Saved products
- Remove from wishlist option

<img src="./screenshots/wishlist.png" width="100%">

---

### 💳 Checkout Page

Displays:

- Shipping address
- Payment method
- Order summary
- Razorpay integration

<img src="./screenshots/checkout.png" width="100%">
<img src="./screenshots/checkout1.png" width="100%">

---

### 👤 Profile Page

Displays:

- User details
- Email verification
- Password reset
- Order history

<img src="./screenshots/profile.png" width="100%">

---

### 🔔 Notifications Page

Displays:

- Order updates
- Read and unread notifications

<img src="./screenshots/notifications.png" width="100%">

---

### 📦 Orders Page

Displays:

- Order history
- Delivery status
- Invoice download

<img src="./screenshots/orders.png" width="100%">
<img src="./screenshots/orders1.png" width="100%">
<img src="./screenshots/orders2.png" width="100%">
---

### 👨‍💼 Admin Dashboard

Displays:

- Revenue analytics
- Sales charts
- User statistics
- Order statistics

<img src="./screenshots/admin-dashboard.png" width="100%">
<img src="./screenshots/admin-dashboard1.png" width="100%">

---

### 🛠️ Admin Product Management

Displays:

- Add products
- Edit products
- Delete products

<img src="./screenshots/admin-products.png" width="100%">
<img src="./screenshots/admin-products1.png" width="100%">
<img src="./screenshots/admin-products2.png" width="100%">

---

### 📋 Admin Order Management

Displays:

- View orders
- Change order status

<img src="./screenshots/admin-orders.png" width="100%">

---

### 📋 Admin User Management

Displays:

- View Users
- Change User to Admin
- Delete User

<img src="./screenshots/admin-user.png" width="100%">

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/luvpradeep/mern-ecommerce.git
```

---

### Install frontend dependencies

```bash
cd client
npm install
npm run dev
```

---

### Install backend dependencies

```bash
cd server
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

EMAIL_USER=

EMAIL_PASS=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=
```

---

Create a `.env` file inside the client directory.

```env
VITE_API_URL=
VITE_RAZORPAY_KEY=
```

---

## 🧩 Implemented Modules

### Authentication

- Register
- Login
- Logout
- Email verification
- OTP verification
- Password reset

### Products

- Product listing
- Search
- Filters
- Sorting
- Pagination

### Shopping Cart

- Add items
- Remove items
- Increase quantity
- Decrease quantity

### Wishlist

- Add products
- Remove products

### Orders

- Place orders
- Track orders
- Download invoices

### Notifications

- Read notifications
- Delete notifications

---

## 📈 Upcoming Features

- Coupon system
- AI chatbot
- Dark mode
- Multi-language support
- Product recommendations
- Advanced reports
- Inventory management

---

## 👨‍💻 Author

### Pradeep D

Frontend Developer | MERN Stack Developer

GitHub:

https://github.com/luvpradeep

---

## ⭐ Support

If you like this project, don't forget to give it a star on GitHub.

```
⭐ Star this repository if you found it helpful.
```