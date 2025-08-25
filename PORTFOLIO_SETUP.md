# 🏢 Double A Property Management System - Portfolio Edition

> A modern, full-stack property management system built with React, TypeScript, Node.js, Express, and MySQL. This portfolio version comes pre-configured with realistic demo data and test accounts.

## 🌟 Features

- **🏠 Property Management** - Manage multiple properties across different estates
- **👥 Tenant Management** - Complete tenant records with contact information
- **🏦 Landlord Management** - Track landlord information and bank details
- **💰 Rent Payment Tracking** - Record and monitor rent payments with penalty calculations
- **📊 Financial Reports** - Generate comprehensive financial reports and analytics
- **👨‍💼 Agent Commission Management** - Track agent performance and commissions
- **🔐 Authentication System** - Secure login with role-based access control
- **📱 Responsive Design** - Modern, mobile-friendly interface

## 🚀 Quick Portfolio Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn**

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd Double-A-Rent-Management-System--Modern-
npm install
```

### 2. Environment Configuration
The `.env` file is already configured for local development. If needed, update database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=property_management_portfolio
JWT_SECRET=portfolio-demo-jwt-secret-key-2025
PORT=5000
```

### 3. Database Setup (One Command!)
```bash
npm run portfolio-setup
```

This command will:
- ✅ Create the portfolio database
- ✅ Set up all tables and relationships
- ✅ Insert realistic demo data (18 properties, 12 tenants, payment history)
- ✅ Create demo user accounts

### 4. Start the Application
```bash
npm run dev
```

**Access Points:**
- 🌐 Frontend: http://localhost:5173
- 🔗 Backend API: http://localhost:5000/api

## 🎯 Demo Accounts

All demo accounts use the password: **`Demo123!`**

| Email | Role | Description |
|-------|------|-------------|
| `admin@property.com` | Administrator | Full system access |
| `manager@property.com` | Property Manager | Property and tenant management |
| `agent1@property.com` | Agent | Sarah Johnson - Real estate agent |
| `agent2@property.com` | Agent | Michael Chen - Real estate agent |
| `test@example.com` | Test User | General testing account |

## 📊 Portfolio Data Overview

### Premium Estates (6 Total)
- **Sunrise Heights** - Westlands (24 units, 20 occupied)
- **Garden View Residences** - Karen (18 units, 15 occupied)
- **The Mirage Complex** - Kileleshwa (30 units, 28 occupied)
- **Acacia Court** - Lavington (12 units, 10 occupied)
- **Palm Springs Estate** - Kilimani (20 units, 18 occupied)
- **Riverside Towers** - Muthaiga (16 units, 14 occupied)

### Property Types & Pricing
- **Bedsitter**: KES 25,000 - 28,000
- **1 Bedroom**: KES 32,000 - 40,000
- **2 Bedroom**: KES 45,000 - 60,000
- **3 Bedroom**: KES 60,000 - 80,000
- **4+ Bedroom**: KES 85,000 - 120,000
- **Commercial**: KES 150,000 - 200,000

### Diverse Tenant Portfolio
- Software Engineers & Tech Professionals
- Medical Doctors & Healthcare Workers
- Business Consultants & Lawyers
- Corporate Entities & Retail Businesses
- International Organizations

## 🛠️ Technical Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend
- **Node.js** with Express
- **MySQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **CORS** enabled
- **Express** middleware

### Development Tools
- **Nodemon** for auto-restart
- **Concurrently** for running both servers
- **ESLint** for code linting
- **TypeScript** for type safety

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── pages/             # Page components
│   ├── lib/               # Utility libraries
│   └── types/             # TypeScript definitions
├── server/                # Backend source code
│   ├── routes/            # API route handlers
│   ├── index.js           # Main server file
│   └── mockData.js        # Demo data generator
├── database_setup_portfolio.sql  # Complete database schema
├── setup_portfolio_db.js  # Database setup script
└── .env                   # Environment configuration
```

## 🔧 Available Scripts

```bash
npm run dev              # Start both frontend and backend
npm run client           # Start only frontend (Vite)
npm run server           # Start only backend (Node.js)
npm run build            # Build for production
npm run portfolio-setup  # Setup portfolio database
npm run setup-db         # Run database setup only
npm run lint             # Run ESLint
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Core Resources
- `GET|POST|PUT|DELETE /api/properties` - Property management
- `GET|POST|PUT|DELETE /api/tenants` - Tenant management
- `GET|POST|PUT|DELETE /api/landlords` - Landlord management
- `GET|POST|PUT|DELETE /api/agents` - Agent management
- `GET|POST|PUT|DELETE /api/rent-payments` - Payment tracking

### Analytics
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/reports/*` - Various reports

## 🎨 Key Features Showcase

### Dashboard Analytics
- Total properties and occupancy rates
- Monthly rent collection summaries
- Tenant and landlord statistics
- Visual charts and graphs

### Property Management
- Multi-estate property organization
- Status tracking (Vacant, Occupied, Maintenance)
- Rent amount and deposit management
- Property descriptions and details

### Financial Tracking
- Rent payment history and scheduling
- Penalty calculations for late payments
- Agent commission tracking
- Landlord remittance management
- Expense tracking and categorization

### User Experience
- Intuitive, modern interface
- Responsive design for all devices
- Real-time data updates
- Role-based access control
- Comprehensive search and filtering

## 🚨 Portfolio Notes

This is a **demonstration version** designed for portfolio purposes:

1. **Demo Data**: All data is fictional but realistic
2. **Security**: Uses development-friendly security settings
3. **Database**: Configured for local MySQL instance
4. **Authentication**: Simplified for demo purposes
5. **Performance**: Optimized for showcase scenarios

## 📞 Technical Support

For portfolio reviews or technical questions:
- Review the comprehensive codebase
- Check the database schema design
- Examine the API architecture
- Test the user interface features

## 🏆 Portfolio Highlights

This project demonstrates:
- **Full-Stack Development** with modern technologies
- **Database Design** with complex relationships
- **API Design** with RESTful principles
- **Frontend Architecture** with component-based design
- **State Management** with React Context and Query
- **Authentication & Authorization** implementation
- **Responsive Design** principles
- **Business Logic** implementation
- **Data Visualization** and reporting
- **Code Organization** and best practices

---

**Ready to impress? Your portfolio property management system is now live! 🚀**
