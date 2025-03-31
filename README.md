# 📲 WhatsApp Clone - Backend Setup & Configuration

## 🚀 Introduction
Welcome to the backend of the **WhatsApp Clone**! This guide will help you set up and configure the backend, including database connection, authentication, and email services.

---

## 📌 Prerequisites
Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB](https://www.mongodb.com/) (Cloud or Local Database)
- A valid email account (for transporter service, e.g., Gmail)

---

## 🛠 Project Setup

### 1️⃣ Clone the Repository
Run the following command to clone the project and navigate into it:
```sh
git clone https://github.com/yourusername/whatsapp-clone-backend.git
cd whatsapp-clone-backend
```

### 2️⃣ Install Dependencies
Install the required packages by running:
```sh
npm install
```

---

## ⚙️ Configuration

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory and add the following configurations:

```ini
# 🌐 Frontend URL
URL=http://yourFrontendURLHere

# 🗄️ MongoDB Connection
MONGO_URL=mongodb://yourMongoDBConnectionURLHere

# 🔑 JWT Authentication Secret Key
JWT_SECRET_KEY=yourJWTSecretKeyHere

# 📩 Email Transporter Service
Transporter_Service=gmail

# 📧 Email Credentials
Email=yourEmailHere
pass=yourEmailPasswordHere

# 🖼️ Image URL
IMAGE_URL=http://yourImageURLHere
```

> **🔒 Important:** Never expose `.env` files in a public repository. Add `.env` to `.gitignore`.

---

## ▶️ Running the Server

### 4️⃣ Start the Backend Server
Run the following command to start the Node.js server:
```sh
node index.js
```

If using **nodemon** for auto-restart on changes:
```sh
npm install -g nodemon
nodemon index.js
```

### 5️⃣ Verify the Setup
Once the server starts, you should see an output similar to:
```sh
Server is running on PORT: XXXX
Connected to MongoDB successfully
```
Now, test your API routes using **Postman**, **Thunder Client**, or connect it with the frontend.

---

## 🛠️ Troubleshooting
- **MongoDB connection error?** Ensure MongoDB is running and the `MONGO_URL` is correctly set.
- **Email service not working?** Enable [Less Secure Apps](https://myaccount.google.com/security) for Gmail or use an app password.
- **App crashes on startup?** Check logs and ensure all environment variables are set correctly.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

