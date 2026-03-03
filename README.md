# VoyageEdu: Campus Map Platform

## 📌 Project Description

**VoyageEdu** is an interactive web application that helps students and parents explore educational institutions across India. The platform provides a comprehensive campus mapping system with detailed institution information, comparison tools, and AISHE verification. Users can search for colleges, view them on an interactive map, compare institutions side-by-side, and access detailed information about courses, facilities, and contact details.

### Key Features
- 🗺️ **Interactive Campus Map** - Visualize institutions on an interactive map
- 🔍 **Advanced Search & Filters** - Find institutions by location, courses, and criteria
- 📊 **Institution Comparison** - Compare multiple institutions side-by-side
- ✅ **AISHE Verification** - Verify institutional data with AISHE codes
- 💬 **Contact System** - Send inquiries and visit requests
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** or **bun** - Comes with Node.js
- **MongoDB** - Cloud account (MongoDB Atlas) or local installation
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd voyage-campus-map-main
\`\`\`

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

\`\`\`bash
cd backend
npm install
\`\`\`

**Configure Environment Variables:**

Create a \`.env\` file in the \`backend\` folder by copying \`.env.example\`:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit the \`.env\` file and add your configuration:

\`\`\`dotenv
# MongoDB Connection String (required)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# Server Port (default: 3001)
PORT=3001

# JWT Secret Key (change this to a secure random string)
JWT_SECRET=your-secure-secret-key-here

# LocationIQ API Key (optional, for geocoding)
LOCATIONIQ_API_KEY=your-locationiq-api-key

# Environment Mode
NODE_ENV=development
\`\`\`

**MongoDB Setup:**
- If using **MongoDB Atlas** (recommended):
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a free account and cluster
  3. Copy your connection string and add it to \`.env\`
  4. Add your IP address to the IP whitelist

- If using **Local MongoDB**:
  1. Install MongoDB locally
  2. Use: \`mongodb://localhost:27017/voyageedu\`

**Start Backend Server:**

\`\`\`bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
\`\`\`

The backend will run on \`http://localhost:3001\`

### 3. Frontend Setup

In a new terminal, navigate to the frontend directory and install dependencies:

\`\`\`bash
cd frontend
npm install
\`\`\`

**Configure Environment Variables:**

Create a \`.env\` file in the \`frontend\` folder by copying \`.env.example\`:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit the \`.env\` file with your API configuration:

\`\`\`dotenv
# API Configuration (must match your backend URL)
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_URL=http://localhost:3001

# Environment Mode
VITE_ENV=development
\`\`\`

**Start Frontend Development Server:**

\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at \`http://localhost:5173\`

### 4. Access the Application

Once both servers are running:
- **Frontend**: Open [http://localhost:5173](http://localhost:5173) in your browser
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **API Documentation**: [http://localhost:3001](http://localhost:3001) (root endpoint shows available routes)

---

## 📋 Available Scripts

### Backend Scripts

\`\`\`bash
npm run dev          # Start development server with auto-reload
npm start            # Start production server
npm run import-maha  # Import colleges data from Maharashtra
npm run geocode-maha # Geocode colleges in Maharashtra
npm test             # Run tests
\`\`\`

### Frontend Scripts

\`\`\`bash
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run build:dev  # Build for development
npm run lint       # Run ESLint checks
npm run preview    # Preview production build
\`\`\`

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. **Backend won't start - Port 3001 already in use**
\`\`\`bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
\`\`\`

#### 2. **MongoDB connection error**
- Check your \`MONGO_URI\` in \`.env\`
- Verify your IP is whitelisted in MongoDB Atlas
- Ensure your username and password are correct (URL-encode special characters)

#### 3. **CORS errors in frontend**
- Verify backend is running on port 3001
- Check \`VITE_API_URL\` in frontend \`.env\` matches backend URL
- Confirm CORS is enabled in \`backend/src/server.js\`

#### 4. **Dependencies installation fails**
\`\`\`bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### 5. **Node modules taking too much space**
Use alternative package managers:
\`\`\`bash
# Using bun (faster and smaller)
bun install

# Using yarn
yarn install
\`\`\`

---

## 🗂️ Project Structure

\`\`\`
voyage-campus-map-main/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Main server file
│   ├── .env.example         # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── App.tsx          # Main App component
│   ├── public/              # Static assets
│   ├── .env.example         # Environment template
│   └── package.json
├── README.md
└── .gitignore
\`\`\`

---
