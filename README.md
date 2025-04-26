<div align="center">
  <img src="client/src/assets/logo.svg" alt="FinanceFlow Logo" width="250" height="auto"/>
  
  # FinanceFlow

  <p>A comprehensive financial management platform for loans, insurance, and investment portfolios</p>
  
  [![Deployment Status](https://img.shields.io/badge/deployment-live-success?style=for-the-badge&logo=vercel)](https://financeflow-lovat.vercel.app/)
  [![Node.js](https://img.shields.io/badge/Node.js-v14.0+-success?style=for-the-badge&logo=node.js)](https://nodejs.org)
  [![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
</div>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🔐 Secure Authentication</h3>
      <ul>
        <li>JWT-based authentication</li>
        <li>OTP verification for enhanced security</li>
        <li>Password recovery workflow</li>
      </ul>
    </td>
    <td width="50%">
      <h3>💰 Loan Management</h3>
      <ul>
        <li>Multiple loan types (Personal, Business, Education)</li>
        <li>Document upload functionality</li>
        <li>Application tracking with status updates</li>
        <li>PDF generation for loan documents</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🛡️ Insurance Services</h3>
      <ul>
        <li>Compare insurance providers</li>
        <li>Get personalized quotes</li>
        <li>Multiple insurance types (Life, Health, Vehicle)</li>
        <li>Policy management dashboard</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📊 Portfolio Management</h3>
      <ul>
        <li>Track financial assets</li>
        <li>Interactive visualization with charts</li>
        <li>Performance analysis</li>
        <li>Investment recommendations</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>👤 User Management</h3>
      <ul>
        <li>Personal profile management</li>
        <li>Activity history and logs</li>
        <li>Notification center</li>
        <li>Document storage</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🧑‍💼 Admin Dashboard</h3>
      <ul>
        <li>User management</li>
        <li>Application approval workflow</li>
        <li>Statistical insights</li>
        <li>System monitoring tools</li>
      </ul>
    </td>
  </tr>
</table>

## 🎮 Demo

<div align="center">
  <table>
    <tr>
      <td align="center">
        <strong>Live Demo:</strong><br>
        <a href="https://financeflow-lovat.vercel.app/">https://financeflow-lovat.vercel.app/</a>
      </td>
    </tr>
    <tr>
      <td align="center">
        <strong>Test Credentials:</strong><br>
        Email: demo@example.com<br>
        Password: Demo@123
      </td>
    </tr>
  </table>
</div>

## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <th>Frontend</th>
      <th>Backend</th>
      <th>DevOps & Tools</th>
    </tr>
    <tr>
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
      <td>
        <img src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git"/>
        <img src="https://img.shields.io/badge/-npm-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm"/>
        <img src="https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/>
        <img src="https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint"/>
        <img src="https://img.shields.io/badge/-Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black" alt="Prettier"/>
      </td>
    </tr>
  </table>
</div>

## 📋 Installation

<details>
<summary>Click to expand installation instructions</summary>

### Prerequisites

-   Node.js (v14+)
-   MongoDB (local or Atlas)
-   npm or yarn

### Clone the repository

```bash
git clone <repository-url>
cd FinanceFlow
```

### Configure Environment Variables

Create `.env` files in both client and server directories:

**Server (.env)**

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
EMAIL_USER=your_email_for_sending_notifications
EMAIL_PASSWORD=your_email_password
```

**Client (.env)**

```
VITE_BACKEND_URL=http://localhost:3000
```

### Install Dependencies & Run

**Backend:**

```bash
cd server
npm install
npm run dev
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

</details>

## 🏛 Architecture

<div align="center">
  <img src="https://mermaid.ink/img/pako:eNp1kc1OwzAQhF_F2nMq9ZAeurJIQlyQuFDgBlJUObueJhaOHdlOIUp5d5wfKqhwnc_jGc_uCbUsQBf41lRWcRKE3lnNNVrHRwEzrrFwXmm_uyUhqq4d_SoF5aaGq9OXcHKvlP4tHY5GDvMxrjpbwcE554Xn4JZUbwxqCROCjOzevFnNOPVNEDgYH6OsZcwUbuxV-G3yHkxunM5wnxBYlkFaFcpVqQcz3_rJ6EbZt7wZxPLCHkEL4E9WK6ZAO1-TZKjwHHRhSMYqg6xq0-QxHZC81xXlOyyzjDFP26DRlhbdj6KxEsIbKUjnRoHMoBm1Y4aSjZyWB1BwQn3HLB-iGPtfoH1Tw3i4WjyuFqv7-HI4QL4YLIbDvKwWoB27NW9m8gzxcB1fXe8BfZlzpg?type=png" alt="FinanceFlow Architecture" width="80%"/>
</div>

## 📡 API Endpoints

<details>
<summary>Click to view API endpoints</summary>

### Authentication

-   `POST /api/users/register` - Register new user
-   `POST /api/users/login` - User login
-   `POST /api/users/verify-otp` - OTP verification
-   `POST /api/users/resend-otp` - Resend OTP
-   `POST /api/users/reset-password` - Request password reset
-   `POST /api/users/update-password` - Update password
-   `POST /api/users/logout` - User logout

### Loan Management

-   `GET /api/loan-types` - Get all loan types
-   `GET /api/loan-applications` - Get user's loan applications
-   `POST /api/loan-applications` - Submit new application
-   `PUT /api/loan-applications/approve/:id` - Approve application (admin)
-   `PUT /api/loan-applications/reject/:id` - Reject application (admin)

### Portfolio Management

-   `GET /api/portfolio` - Get user's portfolio
-   `POST /api/portfolio/add-stock` - Add stock to portfolio
-   `PUT /api/portfolio/update-stock/:symbol` - Update stock in portfolio
-   `DELETE /api/portfolio/remove-stock/:symbol` - Remove stock from portfolio

### Insurance Services

-   `GET /api/insurance-types` - Get all insurance types
-   `GET /api/insurance-types/all` - Get all insurance providers
-   `POST /api/insurance-quotas/create` - Create insurance quota
-   `GET /api/insurance-quotas/user-quotas` - Get user's quotas
-   `DELETE /api/insurance-quotas/delete/:id` - Delete insurance quota

</details>

## 📱 Responsive Design

FinanceFlow is designed to work seamlessly across all devices - from desktops to tablets and mobile phones. The responsive UI adapts to different screen sizes to provide an optimal user experience.

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Desktop</strong></td>
      <td align="center"><strong>Mobile</strong></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/400x200?text=Desktop+View" alt="Desktop View"/></td>
      <td><img src="https://via.placeholder.com/150x300?text=Mobile+View" alt="Mobile View"/></td>
    </tr>
  </table>
</div>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the FinanceFlow Team</p>
  <p>
    <a href="https://linkedin.com">LinkedIn</a> •
    <a href="https://github.com">GitHub</a> •
    <a href="https://twitter.com">Twitter</a>
  </p>
</div>
