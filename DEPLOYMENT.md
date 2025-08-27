# 🚀 Deployment Guide - Double A Property Management System

This guide provides step-by-step instructions for deploying the Double A Property Management System in both development and production environments.

## 📋 Prerequisites

### System Requirements
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher (or yarn v1.22.0+)
- **SQLite**: Built-in (no additional installation required)
- **Git**: For version control

### Hardware Requirements (Production)
- **Minimum**: 1GB RAM, 1 CPU core, 10GB storage
- **Recommended**: 2GB RAM, 2 CPU cores, 20GB storage

## 🛠️ Development Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Double-A-Rent-Management-System--Modern-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The project comes with a pre-configured `.env` file for development:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=property_management_portfolio
JWT_SECRET=portfolio-demo-jwt-secret-key-2025
PORT=5000
NODE_ENV=development
DEMO_MODE=true
```

### 4. Database Setup
```bash
# Setup database with demo data
npm run setup-db

# Alternative: Portfolio setup (includes demo data)
npm run portfolio-setup
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run client  # Frontend (Vite dev server)
npm run server  # Backend (Node.js with SQLite)
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

### Demo Login Credentials
- **Email**: `admin@property.com`
- **Password**: `Demo123!`

## 🌐 Production Deployment

### Option 1: Traditional VPS/Server Deployment

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

#### 2. Clone and Setup
```bash
# Clone repository
git clone <your-repository-url>
cd Double-A-Rent-Management-System--Modern-

# Install dependencies
npm install

# Build frontend
npm run build
```

#### 3. Production Environment
Create a production `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=property_management_production
JWT_SECRET=your_very_secure_jwt_secret_here
PORT=5000
NODE_ENV=production
DEMO_MODE=false
```

#### 4. Database Setup
```bash
# Create production database
npm run setup-db
```

#### 5. Start with PM2
```bash
# Start the application
pm2 start server/index.cjs --name "property-management"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 6. Nginx Configuration
Create `/etc/nginx/sites-available/property-management`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /path/to/your/app/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/property-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

CMD ["npm", "start"]
```

#### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  property-management:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - JWT_SECRET=your_jwt_secret_here
    volumes:
      - ./database:/app/database
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
    depends_on:
      - property-management
    restart: unless-stopped
```

#### 3. Deploy
```bash
docker-compose up -d
```

### Option 3: Cloud Platform Deployment

#### Netlify (Frontend) + Railway (Backend)

**Frontend (Netlify):**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

**Backend (Railway):**
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

#### Vercel (Full-Stack)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment | development | No |
| `JWT_SECRET` | JWT signing key | - | Yes |
| `DB_NAME` | Database name | property_management_portfolio | No |
| `DEMO_MODE` | Enable demo features | false | No |

### Security Considerations

#### Production Security Checklist
- [ ] Change default JWT secret
- [ ] Use HTTPS (SSL certificate)
- [ ] Set up proper CORS origins
- [ ] Implement rate limiting
- [ ] Regular database backups
- [ ] Update dependencies regularly
- [ ] Use environment variables for secrets
- [ ] Set up monitoring and logging

#### Database Security
```bash
# Backup database
cp database/property_management.db database/backup-$(date +%Y%m%d).db

# Scheduled backup (crontab)
0 2 * * * cp /path/to/app/database/property_management.db /path/to/backups/backup-$(date +\%Y\%m\%d).db
```

## 📊 Monitoring & Maintenance

### Health Check Endpoints
- `GET /api/health` - API health check
- `GET /` - Frontend health check

### Log Monitoring
```bash
# PM2 logs
pm2 logs property-management

# System logs
sudo journalctl -u nginx -f
```

### Performance Monitoring
- Monitor memory usage: `pm2 monit`
- Check disk space: `df -h`
- Monitor database size: `du -sh database/`

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port 5000
sudo lsof -i :5000
# Kill process
sudo kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check database file permissions
ls -la database/
# Fix permissions
chmod 644 database/property_management.db
```

#### 3. Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. API Connection Issues
- Check CORS configuration
- Verify API base URL in frontend
- Check network connectivity

### Performance Optimization

#### Frontend Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Enable gzip in nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

#### Backend Optimization
- Enable SQLite WAL mode for better concurrency
- Implement database connection pooling
- Add caching for frequently accessed data
- Optimize database queries

## 📞 Support & Maintenance

### Regular Tasks
- **Daily**: Monitor application logs
- **Weekly**: Check disk space and performance
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and rotate secrets

### Backup Strategy
- **Database**: Daily automated backups
- **Application**: Version control (Git)
- **Configuration**: Document all changes

## 🎯 Performance Benchmarks

### Expected Performance (Production)
- **Response Time**: < 200ms for API calls
- **Page Load**: < 2 seconds initial load
- **Concurrent Users**: 50-100 simultaneous users
- **Database**: 1000+ records without performance impact

### Scaling Considerations
- **Horizontal**: Multiple server instances with load balancer
- **Vertical**: Increase server resources (RAM, CPU)
- **Database**: Consider PostgreSQL for larger deployments
- **Caching**: Implement Redis for session management

---

**Need Help?** 
- Check logs: `pm2 logs` or browser dev tools
- Review configuration files
- Verify environment variables
- Test API endpoints manually

**Ready for Production!** 🚀
