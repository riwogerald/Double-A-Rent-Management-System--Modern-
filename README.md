# Property Management System

A modern web-based property management system built with React, Node.js, and MySQL.

## Features

- **Dashboard**: Real-time statistics and overview
- **Property Management**: Track properties, estates, and occupancy
- **Tenant Management**: Manage tenant information and leases
- **Rent Collection**: Record payments with automatic penalty calculation
- **Commission Tracking**: 5% company commission, 1% agent commission
- **Reporting**: Generate various financial and operational reports
- **Authentication**: Secure login system

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- TanStack Query for state management
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MySQL database
- JWT authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE property_management;
```

2. Import the database schema:
```bash
mysql -u root -p property_management < server/database/schema.sql
```

3. Update your MySQL credentials in `.env` file

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=property_management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

### Running the Application

1. Start both frontend and backend:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend API on http://localhost:5000

2. Default login credentials:
- Email: admin@propertyms.com
- Password: password

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

## Business Logic

### Penalty Calculation
- 0.5% daily penalty on outstanding rent
- Compound interest calculation

### Commission Structure
- Company: 5% of rent collected
- Agents: 1% of rent collected

## Database Schema

The system includes the following main entities:
- Users (authentication)
- Agents
- Landlords
- Estates
- Properties
- Tenants
- Tenancy Agreements
- Rent Payments
- Company Expenses
- Remittances
- Employees

## Development Phases

- ✅ **Phase 1**: Database schema and project foundation
- 🔄 **Phase 2**: Full CRUD operations for all entities
- ⏳ **Phase 3**: Advanced features (PDF generation, reporting)
- ⏳ **Phase 4**: Testing and deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.