# EduJobs Connect - Full-Stack Platform

A comprehensive platform designed to help secondary school graduates in Rwanda find university opportunities and job vacancies.

## Project Structure

```
EduJobs-connect/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express backend API
├── docs/             # Project documentation
└── README.md         # This file
```

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API + useReducer
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Headless UI + Custom components
- **Icons**: Lucide React
- **Internationalization**: React-i18next (English, French, Kinyarwanda)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email Service**: Nodemailer

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Git installed

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EduJobs-connect
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Features

- **University Applications**: Browse and apply for scholarships, loans, and self-paid programs
- **Job Vacancies**: Search and apply for various job opportunities
- **Consulting Services**: CV writing, university guidance, and MIFOTRA setup
- **Multi-language Support**: English, French, and Kinyarwanda
- **Admin Panel**: Complete management system for administrators
- **Authentication**: Secure user registration and login with email verification

## Development Phases

- [x] Phase 1: Project Setup
- [ ] Phase 2: Authentication & User Management
- [ ] Phase 3: Core Features
- [ ] Phase 4: Admin Panel
- [ ] Phase 5: Advanced Features
- [ ] Phase 6: Testing & Deployment

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.
