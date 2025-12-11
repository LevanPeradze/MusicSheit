# Architecture Document - Musical School Website

## Overview
This document outlines the technical architecture and direction for the Musical School Website project.

## System Architecture

### High-Level Architecture
```
┌─────────────────┐
│   React SPA     │  (Frontend - Port 5173)
│   (Vite)        │
└────────┬────────┘
         │ HTTP/REST API
         │
┌────────▼────────┐
│  Express.js     │  (Backend - Port 3000)
│  Server         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│  DB   │ │ Files │  (Future)
│       │ │       │
└───────┘ └───────┘
```

## Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Styling**: CSS (Global styles, component-scoped)
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **API Style**: RESTful
- **Data Format**: JSON

### Future Additions
- **Database**: MongoDB or PostgreSQL (TBD)
- **Authentication**: JWT tokens or session-based
- **File Storage**: Local filesystem or cloud storage (AWS S3, etc.)
- **Real-time**: WebSockets (Socket.io) for notifications (optional)

## Project Structure

```
lecture/
├── server.js                 # Express server entry point
├── index.html                # Vite HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
├── src/
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global styles
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── MainPage.jsx
│   │   └── [future pages]
│   ├── components/          # Reusable components (future)
│   ├── hooks/               # Custom React hooks (future)
│   ├── context/             # React Context providers (future)
│   ├── utils/               # Utility functions (future)
│   └── services/            # API service layer (future)
├── server/
│   ├── routes/              # API route handlers (future)
│   ├── controllers/         # Business logic (future)
│   ├── models/              # Data models (future)
│   ├── middleware/          # Custom middleware (future)
│   └── config/              # Configuration files (future)
└── doc/                     # Documentation
    ├── ARCHITECTURE.md
    └── INCREMENT_UPDATE_*.md
```

## API Architecture

### Current Endpoints
- `POST /api/login` - User authentication

### Future API Structure
```
/api
├── /auth
│   ├── POST /login
│   ├── POST /logout
│   └── POST /register
├── /users
│   ├── GET /profile
│   ├── PUT /profile
│   └── GET /:id
├── /courses
│   ├── GET /
│   ├── GET /:id
│   ├── POST /
│   └── PUT /:id
├── /teachers
│   ├── GET /
│   └── GET /:id
└── /schedule
    ├── GET /
    └── POST /
```

## Data Flow

### Authentication Flow
```
User Input → LoginPage Component
    ↓
API Call (POST /api/login)
    ↓
Express Server Validation
    ↓
Response (Success/Error)
    ↓
State Update → Redirect/Error Display
```

### Component Communication
- **Props**: Parent to child data flow
- **State**: Local component state
- **Context**: Global state (future - user session, theme, etc.)
- **Router**: Navigation and URL state

## Styling Architecture

### Approach
- **Global Styles**: `src/index.css` for base styles, resets, and common utilities
- **Component Styles**: Inline styles or CSS classes (no CSS-in-JS initially)
- **Theme**: Dark/red/grey color scheme defined in global CSS
- **Responsive**: Mobile-first approach with CSS Grid and Flexbox

### Color System
- **Primary Dark**: `#1a1a1a`, `#2d2d2d`
- **Accent Red**: `#d4a574` (muted burgundy)
- **Grey Scale**: `#b8b8b8`, `#a0a0a0`, `#3a3a3a`
- **Success**: Green variants
- **Error**: Red variants

## Security Considerations

### Current
- Input validation on backend
- Error messages don't reveal user existence
- HTTPS ready (when deployed)

### Future
- JWT token-based authentication
- Password hashing (bcrypt)
- CSRF protection
- Rate limiting
- Input sanitization
- SQL injection prevention (when DB added)
- XSS prevention

## Development Workflow

### Local Development
1. **Backend**: `npm start` → Express on port 3000
2. **Frontend**: `npm run dev:frontend` → Vite on port 5173
3. **Proxy**: Vite proxies `/api/*` to backend

### Build Process
- **Frontend Build**: `npm run build` → Vite bundles React app
- **Output**: `dist/` folder with static assets
- **Deployment**: Serve `dist/` folder via Express or separate static server

## State Management Strategy

### Current
- React Hooks (useState) for local component state
- URL state via React Router

### Future Considerations
- **React Context**: For global state (user session, theme)
- **State Management Library**: Redux or Zustand (if complexity grows)
- **Server State**: React Query or SWR for API data caching

## Database Design (Future)

### Potential Schema
```
Users
├── id
├── username
├── email
├── password_hash
├── role (student/teacher/admin)
└── profile_data

Courses
├── id
├── name
├── description
├── teacher_id
└── schedule

Enrollments
├── id
├── student_id
├── course_id
└── enrollment_date
```

## Performance Considerations

### Frontend
- Code splitting with React.lazy()
- Image optimization
- CSS optimization (minification)
- Bundle size monitoring

### Backend
- API response caching (future)
- Database query optimization
- Static file serving optimization
- Compression middleware

## Scalability

### Horizontal Scaling
- Stateless API design (ready for load balancing)
- Database connection pooling (when DB added)
- Session storage externalization (Redis, if needed)

### Vertical Scaling
- Efficient algorithms
- Database indexing
- Caching strategies

## Deployment Strategy (Future)

### Options
1. **Monolithic**: Single server (Express serves both API and static files)
2. **Separated**: Frontend on CDN/static host, Backend on separate server
3. **Containerized**: Docker containers for easy deployment
4. **Cloud**: AWS, Heroku, Vercel, etc.

## Testing Strategy (Future)

### Frontend
- Unit tests: Jest + React Testing Library
- Component tests
- Integration tests

### Backend
- Unit tests: Jest
- API tests: Supertest
- Integration tests

## Documentation Standards

### Code Documentation
- JSDoc comments for functions
- README files for major features
- Inline comments for complex logic

### API Documentation
- OpenAPI/Swagger (future)
- Endpoint documentation in code

## Version Control

### Git Workflow
- Feature branches
- Incremental commits
- Clear commit messages

## Monitoring & Logging (Future)

### Backend
- Request logging
- Error logging
- Performance monitoring

### Frontend
- Error boundary components
- Error tracking (Sentry, etc.)

## Migration Path

### Phase 1: Current (Foundation)
- ✅ Basic React setup
- ✅ Express backend
- ✅ Authentication (hardcoded)

### Phase 2: Database Integration
- Add database
- Migrate hardcoded data
- User management

### Phase 3: Feature Expansion
- Course management
- Teacher features
- Student portal

### Phase 4: Advanced Features
- Real-time updates
- File uploads
- Payment integration

### Phase 5: Production Ready
- Security hardening
- Performance optimization
- Testing coverage
- Deployment

---

*This architecture document will be updated as the project evolves.*

