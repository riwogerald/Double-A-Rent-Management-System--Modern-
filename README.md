# 🏢 Double A Property Management System

> A comprehensive, modern property management system built with React, TypeScript, Node.js, Express, and MySQL. Designed to streamline property management operations with intuitive interfaces and robust functionality.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=netlify)](https://double-a-man-sys.netlify.app/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Project-green?style=for-the-badge)](#)
[![Tech Stack](https://img.shields.io/badge/Full%20Stack-React%20%2B%20Node.js-orange?style=for-the-badge)](#)

## 🌐 Live Demo

**[View Live Application](https://double-a-man-sys.netlify.app/)**

### 🎯 Demo Accounts (Password: `Demo123!`)
- **Administrator**: `admin@property.com`
- **Property Manager**: `manager@property.com`
- **Agent (Sarah)**: `agent1@property.com`
- **Agent (Michael)**: `agent2@property.com`
- **Test User**: `test@example.com`

## 🌟 Key Features

### 🏠 **Property Management**
- Multi-estate property organization across premium locations
- Real-time occupancy tracking and status management
- Comprehensive property details with descriptions and amenities
- Support for various property types (Bedsitter to Commercial)

### 👥 **Tenant & Landlord Management**
- Complete tenant profiles with contact and emergency information
- Landlord banking details and payment preferences
- Move-in/move-out date tracking
- Tenant history and lease management

### 💰 **Financial Operations**
- Automated rent collection with payment method tracking
- Smart penalty calculations for late payments (0.5% daily compound)
- Agent commission management (1-2.5% based on performance)
- Company commission tracking (5% standard rate)
- Expense categorization and vendor management

### 📊 **Analytics & Reporting**
- Real-time dashboard with key performance indicators
- Occupancy rate analytics and trends
- Monthly collection summaries and financial reports
- Visual charts and data visualization
- Export capabilities for financial records

### 🔐 **Security & Authentication**
- JWT-based authentication system
- Role-based access control (Admin, Manager, Agent)
- Secure password hashing with bcrypt
- Session management and auto-logout

### 📱 **User Experience**
- Fully responsive design for all devices
- Intuitive navigation with modern UI/UX
- Real-time data updates and notifications
- Advanced search and filtering capabilities

## 🛠️ Technology Stack

### **Frontend Architecture**
- **React 19** - Latest version with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **TanStack Query** - Powerful data synchronization
- **React Router v7** - Advanced routing solution
- **Lucide React** - Beautiful icon library
- **Recharts** - Responsive chart library

### **Backend Infrastructure**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database management
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing library
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### **Development Tools**
- **ESLint** - Code linting and quality
- **Nodemon** - Auto-restart development server
- **Concurrently** - Run multiple processes
- **PostCSS** - CSS processing tool

## 📈 Portfolio Highlights

### **Complex Business Logic**
- ✅ Compound interest penalty calculations
- ✅ Multi-tier commission structures
- ✅ Automated occupancy rate calculations
- ✅ Financial reporting and analytics
- ✅ Property valuation algorithms

### **Advanced Database Design**
- ✅ 10+ interconnected tables with foreign keys
- ✅ Optimized indexes for performance
- ✅ Stored procedures for business logic
- ✅ Transaction management for data integrity
- ✅ Comprehensive data validation

### **Modern Development Practices**
- ✅ Component-based architecture
- ✅ Custom hooks for state management
- ✅ API route organization and middleware
- ✅ Error handling and validation
- ✅ Responsive design principles

### **Real-World Application**
- ✅ Handles 6 estates with 18+ properties
- ✅ Manages 12+ diverse tenant profiles
- ✅ Processes multiple payment methods
- ✅ Tracks 5 professional agents
- ✅ Complete financial transaction history

## 🚀 Quick Start (Portfolio Setup)

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

### One-Command Setup
```bash
git clone <repository-url>
cd Double-A-Rent-Management-System--Modern-
npm install
npm run portfolio-setup
npm run dev
```

### Manual Setup (Detailed)

#### 1. **Clone and Install**
```bash
git clone <repository-url>
cd Double-A-Rent-Management-System--Modern-
npm install
```

#### 2. **Environment Configuration**
The `.env` file is pre-configured for portfolio use:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=property_management_portfolio
JWT_SECRET=portfolio-demo-jwt-secret-key-2025
PORT=5000
```

#### 3. **Database Setup with Demo Data**
```bash
# Option 1: Automated setup with demo data
npm run portfolio-setup

# Option 2: Manual setup
npm run setup-db
```

#### 4. **Start the Application**
```bash
npm run dev
```

**Access Points:**
- 🌐 **Frontend**: http://localhost:5173
- 🔗 **Backend API**: http://localhost:5000/api
- 📊 **Live Demo**: https://double-a-man-sys.netlify.app/

## 📊 Demo Data Overview

### **6 Premium Estates**
| Estate | Location | Units | Occupancy | Rent Range |
|--------|----------|-------|-----------|------------|
| Sunrise Heights | Westlands | 24 | 83% | KES 25K-65K |
| Garden View | Karen | 18 | 83% | KES 35K-85K |
| The Mirage | Kileleshwa | 30 | 93% | KES 28K-70K |
| Acacia Court | Lavington | 12 | 83% | KES 60K-120K |
| Palm Springs | Kilimani | 20 | 90% | KES 150K-200K |
| Riverside Towers | Muthaiga | 16 | 88% | Commercial |

### **Diverse Tenant Portfolio**
- 👩‍💻 **Tech Professionals** - Software engineers, startup entrepreneurs
- 👩‍⚕️ **Healthcare Workers** - Doctors, medical specialists
- 👨‍💼 **Business Leaders** - Consultants, lawyers, finance managers
- 🏢 **Corporate Clients** - International consulting firms, retail businesses
- 👨‍🎓 **Media Professionals** - Journalists, NGO coordinators

### **Financial Highlights**
- 💰 **Monthly Collections**: KES 850,000+
- 📈 **Average Occupancy**: 87%
- 🏦 **Payment Methods**: Bank transfer, M-Pesa, Cash, Cheque
- 💳 **Commission Tracking**: Agent-based performance metrics

## 📜 API Documentation

### **Authentication**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - New user registration

### **Core Resources**
- `GET|POST|PUT|DELETE /api/properties` - Property management
- `GET|POST|PUT|DELETE /api/tenants` - Tenant management
- `GET|POST|PUT|DELETE /api/landlords` - Landlord management
- `GET|POST|PUT|DELETE /api/agents` - Agent management
- `GET|POST|PUT|DELETE /api/estates` - Estate management
- `GET|POST|PUT|DELETE /api/rent-payments` - Payment tracking

### **Analytics & Reports**
- `GET /api/dashboard/stats` - Dashboard KPIs
- `GET /api/reports/occupancy` - Occupancy reports
- `GET /api/reports/financial` - Financial summaries
- `GET /api/reports/defaulters` - Payment defaulters

### **Utility Functions**
- `GET /api/utils/calculate-penalty` - Penalty calculations
- `GET /api/utils/calculate-commission` - Commission calculations
- `POST /api/generate-mock-data` - Demo data generation

## 🧠 Business Logic & Algorithms

### **Penalty Calculation System**
```javascript
// Compound interest penalty calculation
const calculatePenalty = (outstandingAmount, daysPastDue) => {
  const dailyRate = 0.005; // 0.5% daily
  return outstandingAmount * Math.pow(1 + dailyRate, daysPastDue) - outstandingAmount;
};
```

### **Commission Structure**
- 🏢 **Company Commission**: 5% of collected rent
- 👨‍💼 **Agent Commission**: 1-2.5% based on performance
- 💰 **Net Remittance**: Rent - Company Commission - Agent Commission

### **Occupancy Rate Algorithm**
```javascript
const occupancyRate = (occupiedUnits / totalUnits) * 100;
```

## 🗄️ Database Architecture

### **Core Tables (10+)**
```sql
-- Authentication & Users
users (id, email, password, role, full_name, is_active)

-- Property Management
estates (estate_no, name, location, total_houses, occupied_houses)
properties (property_no, estate_id, landlord_id, agent_id, house_type, rent_amount, status)

-- Stakeholder Management
landlords (landlord_no, name, bank_account, bank_name, address)
agents (agent_no, name, commission_rate, is_active)
tenants (tenant_no, property_id, name, occupation, move_in_date, is_active)

-- Financial Operations
rent_payments (payment_no, tenant_id, amount_paid, payment_method, penalty_amount)
remittances (remittance_no, landlord_id, rent_collected, company_commission)
company_expenses (receipt_no, description, amount, category, vendor)
```

### **Relationships & Constraints**
- 🔗 Foreign key relationships between all entities
- 🗓️ Indexes for performance optimization
- ⚙️ Stored procedures for complex business logic
- 🔒 Triggers for automatic data updates

## 📁 Project Structure

```
💼 Double-A-Rent-Management-System/
├── 🎨 src/                     # Frontend React application
│   ├── 🧩 components/         # Reusable UI components
│   ├── 📋 pages/              # Route-based page components
│   ├── 🌐 contexts/           # React Context providers
│   ├── 🔌 lib/                # Utilities and API client
│   └── 🏷️ types/              # TypeScript definitions
├── 🗺️ server/                 # Backend Node.js application
│   ├── 🛫 routes/             # API route handlers
│   ├── 📦 index.js            # Main server entry point
│   └── 📊 mockData.js         # Demo data generation
├── 🖾 database_setup_portfolio.sql  # Complete database schema
├── ⚙️ setup_portfolio_db.js   # Automated setup script
└── 📄 .env                 # Environment configuration
```

## 🏆 Portfolio Achievements

### **Technical Excellence**
- 🚀 **Modern Stack**: Latest React 19, Node.js, TypeScript
- 🎨 **UI/UX Design**: Responsive Tailwind CSS implementation
- 📊 **Data Visualization**: Interactive charts and analytics
- 🔐 **Security**: JWT authentication with role-based access
- 📈 **Performance**: Optimized queries and caching strategies

### **Business Application**
- 🏢 **Real Estate Focus**: Comprehensive property management
- 💰 **Financial Tracking**: Complete rent and commission system
- 👥 **Stakeholder Management**: Multi-role user system
- 📄 **Reporting**: Business intelligence and analytics
- 🌐 **Scalability**: Multi-estate, multi-tenant architecture

### **Code Quality**
- 🧩 **Component Architecture**: Reusable, maintainable components
- 🔄 **State Management**: Context API with React Query
- 🏷️ **Type Safety**: Full TypeScript implementation
- 🧨 **Error Handling**: Comprehensive validation and error management
- 📝 **Documentation**: Well-documented codebase

## 💯 Development Roadmap

- ✅ **Phase 1**: Core system architecture and authentication *(Completed)*
- ✅ **Phase 2**: Full CRUD operations and business logic *(Completed)*
- ✅ **Phase 3**: Advanced analytics and reporting *(Completed)*
- ✅ **Phase 4**: Portfolio deployment and demo data *(Completed)*
- 🚀 **Future**: PDF generation, mobile app, advanced analytics

## 🎉 Getting Started

1. **Explore the Live Demo**: [https://double-a-man-sys.netlify.app/](https://double-a-man-sys.netlify.app/)
2. **Try Demo Accounts**: Use any demo account with password `Demo123!`
3. **Local Development**: Follow the quick start guide above
4. **Review the Code**: Examine the comprehensive codebase
5. **Test Features**: Explore all management modules

---

**🎆 This portfolio project demonstrates full-stack development expertise with modern technologies, complex business logic, and real-world application design. Ready to impress!**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.