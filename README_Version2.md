# 7x - Financial Empowerment for Students

## 1. Project Overview

**7x** is a mobile application designed to empower students by providing them with tools for budgeting, financial planning, and accessing student-centric privileges. Born from an innovation bootcamp, 7x aims to foster financial literacy and help students manage their money effectively.

This document outlines the technical specifications, development roadmap, and deployment strategy for the Minimum Viable Product (MVP) of the 7x application.

### 1.1. MVP Features

The core features for the MVP are:
1.  **Allowance Planning:** Students can set up and track their monthly or weekly allowance.
2.  **Transaction Management:** Manually add income and expenses to track their balance.
3.  **Opportunity Hub:** Access to a curated list of discounts, scholarships, and opportunities.
4.  **AI-Powered Advice:** Receive simple, rule-based advice on spending and saving habits.
5.  **Saving Goals:** Set and monitor progress towards specific saving goals.
6.  **Financial Literacy Blog:** A dedicated section with articles on financial topics.
7.  **Manual Tracking:** The MVP will not integrate with bank accounts or payment gateways; all data entry is manual.

---

## 2. Recommended Technology Stack

This stack is chosen for its robustness, scalability, and performance, making it ideal for building and scaling the 7x application.

| Component      | Technology                                    | Justification                                                                                                                                                             |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**   | **React Native**                              | A popular cross-platform framework that allows for building a single app for both iOS and Android from one codebase. Its use of JavaScript makes it accessible to many developers. |
| **Backend**    | **Go** with **Gin** framework                 | Go offers excellent performance, strong typing, and concurrency support, making it ideal for building a high-performance, scalable backend. Gin provides a simple and efficient way to build REST APIs. |
| **Database**   | **PostgreSQL**                                | A powerful, open-source relational database known for its reliability and data integrity, which is crucial for financial data. It can handle complex queries and scales well.    |
| **AI/ML**      | **Python** with **Flask/FastAPI** (Microservice) | For the "AI advices" feature. Python is the industry standard for machine learning. A simple rule-based system can be built first, with the potential to evolve into a more complex ML model. |
| **Deployment** | **Docker**, **Heroku** (Backend), **App/Play Stores** | Docker containers ensure consistency across environments. Heroku is a developer-friendly platform for deploying the backend and AI service, while the mobile app will be distributed via the official app stores. |

---

## 3. System Architecture

The application will follow a microservices-oriented architecture to ensure scalability and separation of concerns.

```
+------------------------+      +--------------------------+
|   React Native Mobile App   |      |   (iOS & Android)      |
+------------------------+      +--------------------------+
           |                                  |
           | HTTPS (REST API)                 | HTTPS (REST API)
           |                                  |
+----------v------------------+      +---------v----------------+
|        Go Backend           |      |   Python AI Service      |
|    (Gin Framework)          |      |   (Flask/FastAPI)        |
| - User Authentication       |      | - Financial Advice Engine|
| - Transaction Logic         |      | - Spending Analysis      |
| - Goals & Budgets           |      +--------------------------+
| - Blog Content API          |
+-----------------------------+
           |
           | SQL Connection
           |
+----------v------------------+
|     PostgreSQL Database     |
| - Users, Transactions,      |
|   Goals, Budgets, Blogs     |
+-----------------------------+
```

---

## 4. Step-by-Step Development Plan

### Phase 1: Backend Development (Go & PostgreSQL)

#### Step 1: Setup Environment
- Install Go and PostgreSQL.
- Create a project directory and initialize a new Go module: `go mod init github.com/<your-repo>/7x-backend`.
- Install core dependencies:
  - `go get -u github.com/gin-gonic/gin` (for the web server)
  - `go get -u github.com/jackc/pgx/v5` (for PostgreSQL connectivity)
  - `go get -u github.com/golang-jwt/jwt/v4` (for authentication)

#### Step 2: Database Schema Design
- This remains the same. The database schema is language-agnostic.
- Design tables for `users`, `transactions`, `budgets`, `saving_goals`, and `blog_posts`.
- **`users`**: `id`, `username`, `email`, `password_hash`, `created_at`.
- **`transactions`**: `id`, `user_id`, `type` (income/expense), `amount`, `description`, `date`.
- **`budgets`**: `id`, `user_id`, `period` (weekly/monthly), `amount`, `start_date`.
- **`saving_goals`**: `id`, `user_id`, `goal_name`, `target_amount`, `current_amount`, `deadline`.
- **`blog_posts`**: `id`, `title`, `content`, `author`, `published_at`.

#### Step 3: API Endpoint Development
- Create a modular structure for your API handlers (e.g., in a `handlers` or `controllers` package). Define `structs` for your data models.
- Implement JWT-based authentication for user sign-up and login. Gin middleware is perfect for protecting routes.
- Develop CRUD (Create, Read, Update, Delete) endpoints for each feature:
  - **Transactions:** Add, view, and list transactions.
  - **Budgets:** Set and retrieve budget plans.
  - **Goals:** Create, update, and track saving goals.
  - **Blog:** Fetch blog posts.

### Phase 2: Frontend Development (React Native)

*(This phase remains unchanged from the previous version.)*

#### Step 1: Setup Environment
- Set up your machine for React Native development (Node.js, Watchman, JDK, Android Studio/Xcode).
- Create a new React Native project: `npx react-native init 7xApp`.

#### Step 2: UI/UX Implementation
- Create reusable UI components (Buttons, Inputs, Cards).
- Implement navigation using React Navigation.
- Build screens for all features.

#### Step 3: API Integration
- Use `axios` to connect the frontend to the Go backend API.
- Manage state with Redux Toolkit or React Context.
- Securely store the JWT on the device.

### Phase 3: AI Service (Python)

*(This phase remains unchanged.)*

#### Step 1: Setup Environment
- Install Python, Pip, and Flask/FastAPI.

#### Step 2: Develop the Rule-Based Engine
- Create a simple `/advice` endpoint that accepts transaction history and returns saving tips.

---

## 5. Deployment Plan

#### Backend (Go) & AI Service (Python)
1.  **Containerize:** Create a `Dockerfile` for the Go backend. A multi-stage build is highly recommended for Go to produce a small, secure, and optimized final container image. Create a separate `Dockerfile` for the Python service.
2.  **Choose a Platform:** Heroku remains a great choice for the MVP.
    - Push the Docker images to Heroku's container registry.
    - Provision a PostgreSQL database instance via Heroku Add-ons.
    - Configure environment variables in the Heroku dashboard.
3.  **CI/CD (Optional but Recommended):** Set up GitHub Actions to automatically build and deploy your containerized applications whenever you push to the `main` branch.

#### Frontend (React Native)
*(This section remains unchanged.)*

1.  **Prepare for Build:** Generate release builds (APK for Android, IPA for iOS).
2.  **Google Play Store (Android):** Create a developer account, set up the app listing, and upload the build for review.
3.  **Apple App Store (iOS):** Enroll in the developer program, use Xcode to upload the build, and submit for review.

---

This updated plan aligns with your decision to use Go for the backend. What's the next area you'd like to detail? We can start writing the Go code for the first API endpoint or define the database schema more formally.