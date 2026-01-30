# Dirav - Student Finance Management Platform

A comprehensive personal finance management platform designed specifically for students, featuring both a web application and mobile app.

## 🎨 Design

The UI uses **blue (#3b82f6)** as the primary color throughout both web and mobile applications.

## 📱 Applications

### Web Application (React + Vite)

Located in the root directory. A modern web dashboard built with:
- React 19
- Vite
- TailwindCSS
- React Router
- Recharts for data visualization

### Mobile Application (React Native + Expo)

Located in `/DiravMobile`. A cross-platform mobile app built with:
- React Native
- Expo
- React Navigation
- Axios for API calls

See [DiravMobile/README.md](./DiravMobile/README.md) for detailed mobile app documentation.

### Backend API (Go + Gin)

Located in `/dirav-backend`. A RESTful API built with:
- Go 1.23+
- Gin web framework
- GORM for database
- PostgreSQL

See [dirav-backend/README.md](./dirav-backend/README.md) for detailed API documentation.

## 🚀 Quick Start

### Web Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Mobile Application

```bash
cd DiravMobile

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

### Backend

```bash
cd dirav-backend

# Install Go dependencies
go mod tidy

# Run the server
go run ./cmd/api
```

## 📋 Features

| Feature | Web | Mobile | Backend API |
|---------|-----|--------|-------------|
| Dashboard | ✅ | ✅ | - |
| Budget Planning | ✅ | ✅ | ✅ |
| Transactions | ✅ | ✅ | ✅ |
| Savings Goals | ✅ | ✅ | ✅ |
| Opportunities | ✅ | ✅ | ❌ Missing |
| AI Advisor | ✅ | ✅ | ❌ Missing |
| Blogs | ✅ | ✅ | ❌ Missing |
| User Auth | - | - | ✅ |
| Analytics | - | - | Partial |

## 🔌 Missing Backend APIs

The following APIs need to be implemented in the backend to enable full functionality:

### 1. Opportunities API (High Priority)
```
GET    /api/v1/opportunities              - List all opportunities
GET    /api/v1/opportunities/:id          - Get opportunity details
POST   /api/v1/opportunities/:id/claim    - Claim an opportunity
GET    /api/v1/opportunities/categories   - List categories
```

### 2. AI Advisor API (High Priority)
```
POST   /api/v1/advisor/chat               - Send message to AI advisor
GET    /api/v1/advisor/insights           - Get personalized insights
GET    /api/v1/advisor/tips               - Get daily tips
POST   /api/v1/advisor/analyze            - Analyze spending patterns
```

### 3. Blogs/Articles API (Medium Priority)
```
GET    /api/v1/blogs                      - List all articles
GET    /api/v1/blogs/:id                  - Get article details
GET    /api/v1/blogs/categories           - List categories
GET    /api/v1/blogs/featured             - Get featured articles
POST   /api/v1/blogs/:id/bookmark         - Bookmark an article
```

### 4. Enhanced Analytics API (Medium Priority)
```
GET    /api/v1/analytics/spending         - Get spending breakdown
GET    /api/v1/analytics/trends           - Get spending trends
GET    /api/v1/analytics/comparison       - Compare to last period
GET    /api/v1/analytics/categories       - Spending by category
```

### 5. Notifications API (Low Priority)
```
GET    /api/v1/notifications              - List notifications
PUT    /api/v1/notifications/:id/read     - Mark as read
POST   /api/v1/notifications/settings     - Update preferences
```

### 6. User Preferences API (Low Priority)
```
GET    /api/v1/users/me/preferences       - Get user preferences
PUT    /api/v1/users/me/preferences       - Update preferences
PUT    /api/v1/users/me/avatar            - Update profile picture
```

## 📁 Project Structure

```
Dirav-Frontend/
├── src/                    # Web app source code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── context/            # React context (state management)
│   └── index.css           # Global styles
├── DiravMobile/            # React Native mobile app
│   ├── src/
│   │   ├── screens/        # Mobile screens
│   │   ├── context/        # State management
│   │   ├── services/       # API services
│   │   └── constants/      # Colors, config
│   └── App.js              # Mobile app entry
├── dirav-backend/          # Go backend API
│   ├── cmd/                # Main entry points
│   └── internal/           # Internal packages
└── public/                 # Static assets
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #3b82f6 | Buttons, links, active states |
| Primary Dark | #2563eb | Hover states |
| Secondary | #06b6d4 | Accents, progress bars |
| Success | #10b981 | Income, positive values |
| Error | #ef4444 | Expenses, warnings |
| Background | #f8fafc | Main background |

## 📄 License

This project is part of the Dirav personal finance platform.
