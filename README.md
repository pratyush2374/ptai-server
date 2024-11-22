# PTAI (Personal Trainer AI) - Server Side 🚀

Welcome to the **PTAI (Personal Trainer AI)** backend! This server is built with **Node.js**, **Express.js**, and **MongoDB** to handle all the logic and operations for our fitness app. It powers all authentication, user management, and fitness data storage for the PTAI platform.

---

## 🛠️ Tech Stack

- **Backend**:
    - **Node.js** + **Express.js**
    - **MongoDB** for data storage 🗄️
    - **JWT (JSON Web Tokens)** for secure authentication 🔐
    - **Cloudinary** for storing and serving user avatars 📸

- **File Upload**:
    - **Multer** middleware for handling file uploads locally before uploading to Cloudinary 🌐

- **Error Handling**:
    - **Custom API Response** and **API Error** classes for consistent error handling and structured API responses 🛠️

---

## 🚀 Features

### **Authentication & User Management**
- **POST /register**: Register a new user (email, password, full name, username, avatar) 👤
- **POST /login**: Login with email/username and password 🔑
- **POST /logout**: Log out from the current session 🚪
- **POST /refresh**: Refresh access and refresh tokens 🔄

### **User Data Management**
- **GET /current-user**: Get details of the logged-in user 👤
- **PUT /update/fullname**: Update your full name ✍️
- **PUT /update/username**: Update your username 🆔
- **PUT /update/avatar**: Upload and update your avatar 🌟

### **Password Management**
- **POST /change-password**: Change your account password 🔑

---

## 🛠️ Middleware

- **Multer Middleware**: Handles file uploads for user avatars 💻
    - The file is first uploaded locally and then pushed to **Cloudinary** for cloud storage.

- **Cloudinary Integration**:
    - Upload avatar images to Cloudinary for easy access and storage 🌥️

- **Verify User Middleware**:
    - Verifies that the user is authenticated before allowing access to protected routes ✅

---

## 💡 Custom Classes

### **ApiResponse**:
A custom class that standardizes all API responses into a clean and structured format.
- **Fields**: status, data, message

### **ApiError**:
A custom error handler class that ensures all errors are sent in a structured and consistent format.
- **Fields**: statusCode, message

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/pr/ptai-backend.git
