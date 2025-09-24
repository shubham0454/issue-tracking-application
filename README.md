# Issue Tracker Application

A full-stack issue tracking application built with Node.js/Express backend and Angular frontend.

## Features

### Backend
- ✅ REST API with Express.js and MongoDB
- ✅ Health check endpoint (`GET /health`)
- ✅ CRUD operations for issues
- ✅ Advanced search and filtering
- ✅ Sorting and pagination
- ✅ Input validation with Joi
- ✅ Error handling and logging
- ✅ CORS enabled for frontend integration

### Frontend
- ✅ Angular 19+ with TypeScript
- ✅ Responsive design
- ✅ Issues list with filtering and search
- ✅ Create and edit issue forms
- ✅ Issue detail view with full JSON display
- ✅ Sorting and pagination
- ✅ Real-time form validation

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- Joi for validation
- CORS, Helmet for security

### Frontend
- Angular 19+
- TypeScript
- RxJS for reactive programming
- Responsive CSS Grid/Flexbox

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Docker)
- Angular CLI (`npm install -g @angular/cli`)

### Option 1: Manual Setup

#### Backend Setup
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB connection string
npm run dev

#### Frontend Setup
cd frontend
npm install
ng serve

## API Documentation

### Base URL: `http://localhost:3000`

#### Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/health` | Health check | None |
| GET | `/issues` | List issues | `search`, `status`, `priority`, `assignee`, `sortBy`, `sortOrder`, `page`, `pageSize` |
| GET | `/issues/:id` | Get single issue | None |
| POST | `/issues` | Create issue | Body: Issue object |
| PUT | `/issues/:id` | Update issue | Body: Partial issue object |


#### Query Parameters for GET /issues

- `search`: Search in title and description
- `status`: Filter by status (open, in-progress, resolved, closed)
- `priority`: Filter by priority (low, medium, high, critical)  
- `assignee`: Filter by assignee (partial match)
- `sortBy`: Sort field (default: updatedAt)
- `sortOrder`: Sort direction (asc/desc, default: desc)
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10, max: 100)

#### Example Requests

**Search and filter issues:**
GET /issues?search=bug&status=open&priority=high&page=1&pageSize=10

## Application URLs

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart

### Frontend Development  
cd frontend
ng serve     # Runs dev server with hot reload
ng build     # Build for production
ng test      # Run unit tests

### Database
The application uses MongoDB with the following collections:
- `issues` - Main issues collection with text search indexes


### Production Build
# Backend
cd backend && npm run start

# Frontend  
cd frontend && ng build --configuration=production


## Testing

### Manual Testing Flow
1. Start both backend and frontend
2. Navigate to http://localhost:4200
3. Create a new issue using the "Create Issue" button
4. Test search functionality
5. Apply different filters (status, priority, assignee)
6. Test sorting by clicking column headers
7. Click on an issue row to view details
8. Edit an issue using the edit button
9. Verify pagination works with multiple issues

### API Testing
Use tools like Postman or curl to test the REST endpoints:

# Health check
curl http://localhost:3000/health

# Get all issues
curl http://localhost:3000/issues

# Create issue
curl -X POST http://localhost:3000/issues \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Issue","description":"Test Description","reporter":"test@example.com"}'

## Architecture

### Backend Architecture
backend/
├── src/
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express route handlers  
│   ├── middleware/    # Custom middleware (validation, etc.)
│   └── app.js         # Express app configuration
├── server.js          # Application entry point
└── package.json
```

### Frontend Architecture
frontend/src/app/
├── components/
│   ├── issues-list/   # Main issues table with filtering
│   ├── issue-detail/  # Single issue view
│   └── issue-form/    # Create/edit issue form
├── services/          # API communication
├── models/            # TypeScript interfaces
└── app.module.ts      # Angular app configuration
