# Dirav Mobile App

A React Native mobile application for the Dirav personal finance management platform, built with Expo and designed for students.

## Screenshots

The mobile app mirrors the web application with a blue primary color theme and provides all core features:
- Dashboard with financial overview
- Budget planning and transaction tracking
- Savings goals management
- Student opportunities and discounts
- AI-powered financial advisor
- Financial literacy blog articles

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Navigate to the mobile app directory:
```bash
cd DiravMobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS) to run the app on your device.

## Project Structure

```
DiravMobile/
├── App.js                    # Main app entry point with navigation
├── app.json                  # Expo configuration
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/
│   │   ├── colors.js        # Color palette (blue primary)
│   │   └── config.js        # API configuration
│   ├── context/
│   │   └── FinancesContext.js # Global state management
│   ├── screens/
│   │   ├── DashboardScreen.js
│   │   ├── PlanningScreen.js
│   │   ├── SavingsScreen.js
│   │   ├── OpportunitiesScreen.js
│   │   ├── AIAdvisorScreen.js
│   │   └── BlogsScreen.js
│   └── services/
│       └── api.js           # API service layer
└── assets/                  # Images and icons
```

## Features

### 1. Dashboard
- Financial overview cards (Balance, Savings, Monthly Allowance)
- Featured opportunities carousel
- Recent transactions list
- Daily AI insights

### 2. Budget Planning
- Monthly allowance tracker with progress bar
- Add income/expense transactions
- Transaction history

### 3. Savings Goals
- Create and track savings goals
- Progress visualization
- Contribute to goals

### 4. Opportunities
- Browse student discounts, scholarships, and privileges
- Filter by category
- Search functionality

### 5. AI Advisor
- Chat interface for financial advice
- Personalized recommendations

### 6. Blogs
- Financial literacy articles
- Featured and grid layouts

## Backend Integration

The app is configured to connect to the Dirav backend API. Update the API base URL in `src/constants/config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://your-backend-url/api/v1',
  TIMEOUT: 10000,
};
```

### Available API Endpoints (from Backend)

| Feature | Endpoint | Status |
|---------|----------|--------|
| Auth - Register | POST /auth/register | ✅ Available |
| Auth - Login | POST /auth/login | ✅ Available |
| User Profile | GET /users/me | ✅ Available |
| Accounts | GET/POST/PUT/DELETE /accounts | ✅ Available |
| Transactions | GET/POST/PUT/DELETE /transactions | ✅ Available |
| Budgets | GET/POST/PUT/DELETE /budgets | ✅ Available |
| Budget Progress | GET /budgets/:id/progress | ✅ Available |
| Savings Goals | GET/POST/PUT/DELETE /savings | ✅ Available |
| Contribute to Savings | POST /savings/:id/contribute | ✅ Available |

## Missing APIs Needed for Full Functionality

The following APIs are **NOT** currently available in the backend and need to be implemented:

### 1. **Opportunities API** (High Priority)
```
GET    /api/v1/opportunities              - List all opportunities
GET    /api/v1/opportunities/:id          - Get opportunity details
POST   /api/v1/opportunities/:id/claim    - Claim an opportunity
GET    /api/v1/opportunities/categories   - List categories
```
**Required fields:** id, title, provider, category, type (discount/scholarship/privilege), amount, location, description, expiryDate, terms

### 2. **AI Advisor API** (High Priority)
```
POST   /api/v1/advisor/chat               - Send message to AI advisor
GET    /api/v1/advisor/insights           - Get personalized insights
GET    /api/v1/advisor/tips               - Get daily tips
POST   /api/v1/advisor/analyze            - Analyze spending patterns
```
**Required fields:** user context, spending history, conversation history

### 3. **Blogs/Articles API** (Medium Priority)
```
GET    /api/v1/blogs                      - List all articles
GET    /api/v1/blogs/:id                  - Get article details
GET    /api/v1/blogs/categories           - List categories
GET    /api/v1/blogs/featured             - Get featured articles
POST   /api/v1/blogs/:id/bookmark         - Bookmark an article
```
**Required fields:** id, title, excerpt, content, category, readTime, image, featured, author, publishedAt

### 4. **Analytics API** (Medium Priority)
```
GET    /api/v1/analytics/spending         - Get spending breakdown
GET    /api/v1/analytics/trends           - Get spending trends over time
GET    /api/v1/analytics/comparison       - Compare to last period
GET    /api/v1/analytics/categories       - Spending by category
```

### 5. **Notifications API** (Low Priority)
```
GET    /api/v1/notifications              - List notifications
PUT    /api/v1/notifications/:id/read     - Mark as read
POST   /api/v1/notifications/settings     - Update notification preferences
```

### 6. **User Preferences API** (Low Priority)
```
GET    /api/v1/users/me/preferences       - Get user preferences
PUT    /api/v1/users/me/preferences       - Update preferences
PUT    /api/v1/users/me/avatar            - Update profile picture
```

## Building for Production

### Android
```bash
npx expo build:android
# or with EAS Build
npx eas build --platform android
```

### iOS
```bash
npx expo build:ios
# or with EAS Build
npx eas build --platform ios
```

## Environment Configuration

For different environments, create environment-specific config files or use environment variables:

```javascript
// Development
BASE_URL: 'http://localhost:8080/api/v1'

// Staging
BASE_URL: 'https://staging-api.dirav.com/api/v1'

// Production
BASE_URL: 'https://api.dirav.com/api/v1'
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the Dirav personal finance platform.
