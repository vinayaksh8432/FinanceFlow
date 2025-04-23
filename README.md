# FinanceFlow

FinanceFlow is a comprehensive financial management platform that helps users manage loans, insurance, and investment portfolios. This full-stack application provides users with tools to apply for loans, get insurance quotes, and track their financial assets.

## 🌟 Features

-   **User Authentication** - Secure login and registration system
-   **Loan Management**
    -   Apply for various types of loans (Personal, Home, Education, Business, etc.)
    -   Track loan application status
    -   Generate and download loan application PDFs
-   **Insurance Services**
    -   Get quotes for different insurance types (Life, Health, Car, Two-Wheeler)
    -   Compare insurance options from different providers
-   **Portfolio Management**
    -   Track your financial assets and investments
    -   Visualize portfolio performance with interactive charts
-   **User Profile Management**
    -   Update personal information
    -   View transaction history
-   **Admin Dashboard**
    -   Manage users and applications
    -   View system statistics

## 🛠️ Technology Stack

### Frontend

-   **React.js** - UI library
-   **Vite** - Build tool
-   **TailwindCSS** - Styling
-   **React Router Dom** - Navigation
-   **Axios** - API requests
-   **Recharts** - Data visualization
-   **Framer Motion** - Animations
-   **jsPDF** - PDF generation

### Backend

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **MongoDB** - Database
-   **Mongoose** - ODM for MongoDB
-   **JWT** - Authentication
-   **Bcrypt** - Password hashing
-   **Nodemailer** - Email services
-   **Multer** - File uploading

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
