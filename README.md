<h1 align="center">
  <img src="client/src/assets/logo.svg" alt="FinanceFlow Logo" width="25" height="auto"/>
  FinanceFlow
</h1>
 <p align="center">A comprehensive financial management platform for loans, insurance, and investment portfolios</p>

![image](https://github.com/user-attachments/assets/5972ea6a-d1d1-4521-b1ce-26121acb6824)

## 🌟 Features

-   🔐 **User Authentication** - Secure login and registration
-   💰 **Loan Management** - Apply for loans, track status, generate PDFs
-   🛡️ **Insurance Services** - Get quotes and compare providers
-   📊 **Portfolio Management** - Track financial assets with interactive charts
-   👤 **Profile Management** - Update personal info and view history
-   🧑‍💼 **Admin Dashboard** - Manage users and view statistics

## 🛠️ Technology Stack

 <table>
   <tr>
     <td align="center"><b>Frontend</b></td>
     <td>
       <img src="https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
       <img src="https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
       <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
       <img src="https://img.shields.io/badge/-React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white" alt="React Router"/>
       <img src="https://img.shields.io/badge/-Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" alt="Axios"/>
       <img src="https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square&logo=chart.js&logoColor=white" alt="Recharts"/>
       <img src="https://img.shields.io/badge/-Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer"/>
       <img src="https://img.shields.io/badge/-jsPDF-FA7343?style=flat-square&logo=javascript&logoColor=white" alt="jsPDF"/>
     </td>
   </tr>
   <tr>
     <td align="center"><b>Backend</b></td>
     <td>
       <img src="https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
       <img src="https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
       <img src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
       <img src="https://img.shields.io/badge/-Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white" alt="Mongoose"/>
       <img src="https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white" alt="JWT"/>
       <img src="https://img.shields.io/badge/-Bcrypt-003A70?style=flat-square&logo=lock&logoColor=white" alt="Bcrypt"/>
       <img src="https://img.shields.io/badge/-Nodemailer-22B573?style=flat-square&logo=gmail&logoColor=white" alt="Nodemailer"/>
       <img src="https://img.shields.io/badge/-Multer-FF6C37?style=flat-square&logo=file&logoColor=white" alt="Multer"/>
     </td>
   </tr>
   <tr>
     <td align="center"><b>DevOps</b></td>
     <td>
       <img src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git"/>
       <img src="https://img.shields.io/badge/-npm-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm"/>
       <img src="https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint"/>
       <img src="https://img.shields.io/badge/-Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black" alt="Prettier"/>
     </td>
   </tr>
 </table>
 
 ## 📋 Prerequisites
 
 -   Node.js (v14+)
 -   MongoDB (local or Atlas)
 -   npm or yarn
 
 ## 🚀 Installation
 
 ### Clone the repository
 
 ```bash
 git clone <repository-url>
 cd FinanceFlow
 ```
 
 ### Install dependencies
 
 ```bash
 # Install client dependencies
 cd client
 npm install
 
 # Install server dependencies
 cd ../server
 npm install
 ```
 
 ### Set up environment variables
 
 Create a `.env` file in the server directory with the following variables:
 
 ```
 MONGODB_URI=your_mongodb_connection_string
 JWT_SECRET=your_jwt_secret
 PORT=3000
 EMAIL_USER=your_email_for_sending_notifications
 EMAIL_PASSWORD=your_email_password
 ```
 
 ### Run the application
 
 ```bash
 # Run server
 cd server
 npm run dev
 
 # Run client (in a new terminal)
 cd client
 npm run dev
 ```
 
 ## 📁 Project Structure
 
 ```
 FinanceFlow/
 ├── client/                 # Frontend React application
 │   ├── src/
 │   │   ├── assets/         # Images and SVGs
 │   │   ├── components/     # Reusable UI components
 │   │   ├── context/        # React context for state management
 │   │   ├── layout/         # Page layouts
 │   │   ├── lib/            # Utility functions
 │   │   ├── pages/          # Main application pages
 │   │   └── utils/          # Helper functions
 │   └── ...
 │
 └── server/                 # Backend Node.js application
     ├── controllers/        # Request handlers
     ├── data/               # Static data
     ├── middleware/         # Express middleware
     ├── model/              # Mongoose models
     ├── public/             # Static files and uploads
     ├── routes/             # API routes
     ├── scripts/            # Database seeding scripts
     ├── utils/              # Utility functions
     └── index.js            # Entry point
 ```
 
 ## 🔒 Authentication
 
 The application uses JWT-based authentication with secure HTTP-only cookies for maintaining user sessions. User passwords are securely hashed using bcrypt before storage.
 
 ## 📱 Responsive Design
 
 The application is fully responsive and works on devices of all sizes, from mobile phones to desktop computers.
 
 ## 🤝 Contributing
 
 Contributions are welcome! Please feel free to submit a Pull Request.
 
 ## 📄 License
 
 This project is licensed under the terms found in the LICENSE file in the root directory.
