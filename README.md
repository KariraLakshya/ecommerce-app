# E-Commerce SPA 🛍️

A complete single-page e-commerce application built from scratch with a Node.js backend and a Vanilla JavaScript frontend. This project features user authentication, product listings with filters, and a persistent shopping cart.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---
## 🚀 Features

- **Full Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
- **Product Catalog:** View a list of all products with dynamic client-side filtering by category and price.
- **Shopping Cart:** Add, remove, and update item quantities in the cart.
- **Persistent Cart:** Cart items are saved in `localStorage`, so they persist even after logging out or closing the browser.
- **Admin Panel:** A separate page for admins to add new products to the database.
- **Secure API:** Backend routes are protected to ensure only authorized users (or admins) can perform certain actions.
- **Responsive Design:** A clean, modern UI that works on various screen sizes.

---
## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, Mongoose, JSON Web Token (JWT), bcrypt.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Database:** MongoDB (via Atlas or local)

---
## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### **Prerequisites**
- Node.js installed on your machine
- npm or yarn
- A MongoDB database (either local or a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```
4.  **Set up Environment Variables:**
    Create a file named `.env` in the root of the project and add your configuration variables based on the `.env.example` file.

---
## 🔐 Environment Variables

Your `.env` file should contain the following variables:

.env.example
Your MongoDB connection string
MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/yourDatabaseName"

Your secret key for signing JSON Web Tokens
JWT_SECRET="your_super_secret_key"

---
## 📜 Available Scripts

In the project directory, you can run:

- **`npm run dev`**
  Runs the server using `nodemon`, which automatically restarts on file changes. The server will be available at `http://localhost:5000`.

- **`npm start`**
  Runs the server in production mode using `node`.

- **`npm run seed`**
  Populates the database with sample product data from the `utils/seeder.js` file. This will clear all existing products first.

- **`npm run destroy`**
  Deletes all product data from the database.

---
## 🗺️ API Endpoints

A brief overview of the available API routes.

| Method | Endpoint              | Description                    | Protected | Admin Only |
| :----- | :-------------------- | :----------------------------- | :-------- | :--------- |
| POST   | `/api/auth/register`  | Register a new user            | No        | No         |
| POST   | `/api/auth/login`     | Log in a user                  | No        | No         |
| GET    | `/api/items`          | Get all items (with filters)   | No        | No         |
| POST   | `/api/items`          | Add a new item                 | Yes       | Yes        |
| GET    | `/api/cart`           | Get the logged-in user's cart  | Yes       | No         |
| POST   | `/api/cart`           | Add/update an item in the cart | Yes       | No         |
| DELETE | `/api/cart/:itemId`   | Remove an item from the cart   | Yes       | No         |

---
## 📄 License

This project is licensed under the MIT License.