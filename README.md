# FA – Campus Lost & Found System

## Project Title
Campus Lost & Found Management System

## Student Information
Name: Lee Kar Yin  
Student ID: QIU-202510-008911  

---

## 1. Tools and Technologies Used

### Frontend
- HTML5  
- CSS3  
- JavaScript (Vanilla JS)

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB Atlas (Cloud Database)

### Security
- bcrypt (Password Hashing)  
- Backend Input Sanitization (XSS Prevention using DOMPurify / Custom Sanitizer)  
- Restricted Email Domain (@qiu.edu.my)  

### Deployment
- Github 
- Render (Cloud Hosting)
---

## 2. Steps to Run the Project

### 2.1 Prerequisites
- Node.js installed on your computer  
- MongoDB Atlas account (or local MongoDB)  
- `.env` file with your MongoDB connection string
---

### 2.2 Installation
1. Download or clone the project repository.  
2. Open terminal/command prompt in the project root folder.  
3. Install required packages:
4. npm install
---

### 2.3 Configuration
Create a `.env` file in the root directory and add:
MONGO_URI=your_mongodb_atlas_connection_string
PORT=3000
---

### 2.4 Running Locally
1. Start the server:
node server.js

2. Open your browser and navigate to:
http://localhost:3000/home.html

---

## 3. Project Structure & Navigation

- **Home Page:** [Landing page](https://campus-lost-found-23p0.onrender.com/home.html)  
- **Items Gallery:** [View all lost and found items](https://campus-lost-found-23p0.onrender.com/index.html)  
- **Post an Item:** Users must be logged in to post. New users can register via the Login/Register page.  
- **User Dashboard:** Manage your own posts and profile information.  

---

## 4. Key Features & Security

### 4.1 Restricted Domain
- Only users with **@qiu.edu.my** emails can register.  

### 4.2 Data Security
- All passwords are encrypted using **bcrypt** before being stored in the database.  

### 4.3 Input Protection
- Backend sanitization is implemented to prevent **Cross-Site Scripting (XSS)** attacks.  

### 4.4 Performance Optimization
- **Gzip compression** is enabled via compression middleware for faster performance.  0
---

## 5. Deployment
- The system is deployed on Render (Cloud Hosting).  

Live URL: [Campus Lost & Found Web Portal](https://campus-lost-found-23p0.onrender.com)
