
# 🏡 Airbnb Clone – Full Stack Web Application

## 🧠 Overview

This project is a full-stack Airbnb-inspired web application that allows users to explore, create, and manage property listings with integrated map visualization and user authentication.

The system is built using a scalable backend architecture with Node.js and MongoDB, supporting dynamic content rendering and real-time user interactions.

---

## ✨ Key Features

* 🔐 User Authentication (Login / Signup)
* 🏠 Create, Edit, Delete property listings
* 🖼️ Image upload with cloud storage (Cloudinary)
* 📍 Map integration using Mapbox API
* ⭐ Reviews and ratings system
* 🔒 Authorization (only owner can edit/delete listings)
* 📱 Fully responsive UI

---

## ⚙️ Tech Stack

* **Frontend:** EJS, CSS, Bootstrap
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** Passport.js
* **Maps:** Mapbox API
* **Cloud Storage:** Cloudinary

---

## 📊 Project Highlights

* Implements **CRUD operations** for property listings
* Integrated **Mapbox API for real-time geolocation visualization**
* Designed using **MVC architecture for scalability**
* Built with **7+ core features and modular backend structure**

---

## 🧪 System Architecture

* Frontend renders dynamic UI using EJS templates
* Backend (Node.js + Express) handles routing and business logic
* MongoDB stores user, listing, and review data
* Mapbox API provides location-based services
* Cloudinary handles image storage and delivery

---

## 📁 Project Structure

* `/models` → Database schemas
* `/routes` → Application routes
* `/controllers` → Business logic
* `/views` → EJS templates
* `/public` → Static files (CSS, JS)

---

## 🚀 Run Locally

```bash
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
MAPBOX_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
SESSION_SECRET=
```

---

## 🎯 Impact

This project demonstrates:

* Full-stack development using **MVC architecture**
* Integration of **third-party APIs (Mapbox, Cloudinary)**
* Implementation of **authentication and role-based authorization**
* Building scalable backend systems with Node.js and MongoDB
