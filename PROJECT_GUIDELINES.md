# Project Guidelines - Musical School Website

## Project Context
**Website Purpose**: Musical School Website
- A platform for a music school to manage students, courses, teachers, and school operations
- Will include student portal, course management, scheduling, and administrative features

## Development Approach

### 1. Goal
- Create a full-fledged musical school website by the end of our session

### 2. Development Style
- **Very small incremental changes** through each prompt
- Make minimal, focused changes per iteration
- Build step by step, one feature at a time
- User will provide prompts for each step

### 3. Architecture
- **Front-end and backend updated separately**
- Clear separation between client-side and server-side changes
- Update one layer at a time when possible

### 4. Technology Stack (Current)
- **Backend**: Node.js + Express.js
- **Frontend**: React (via Vite)
- **Server**: Backend on http://localhost:3000, Frontend on http://localhost:5173
- **No database** at the very start (will add later)
- **No external APIs** at the very start (will add later)

## Development Roadmap

### Phase 1: Foundation & Authentication ✅
- [x] Set up React frontend with Vite
- [x] Create login page with vibrant styling
- [x] Implement backend login endpoint with hardcoded credentials
- [x] Add error handling for incorrect credentials

### Phase 2: Core Pages & Navigation
- [ ] Create navigation/routing structure
- [ ] Build home/landing page
- [ ] Create about page
- [ ] Add contact page
- [ ] Implement page routing (React Router)

### Phase 3: Student Portal
- [ ] Dashboard after login
- [ ] Student profile page
- [ ] View enrolled courses
- [ ] View schedule/calendar
- [ ] Update profile information

### Phase 4: Course Management
- [ ] Course listing page
- [ ] Course detail pages
- [ ] Course categories (instruments, theory, etc.)
- [ ] Course enrollment functionality
- [ ] View course materials/assignments

### Phase 5: Teacher Features
- [ ] Teacher profiles
- [ ] Teacher dashboard
- [ ] Manage students
- [ ] Schedule management
- [ ] Grade/assignment submission

### Phase 6: Administrative Features
- [ ] Admin dashboard
- [ ] User management (students, teachers)
- [ ] Course creation/editing
- [ ] Schedule management
- [ ] Reports and analytics

### Phase 7: Enhanced Features
- [ ] Calendar/scheduling system
- [ ] Notifications system
- [ ] File uploads (assignments, materials)
- [ ] Messaging/communication
- [ ] Payment integration (if needed)

### Phase 8: Data Persistence
- [ ] Add database (likely MongoDB or PostgreSQL)
- [ ] Migrate hardcoded data to database
- [ ] Implement proper data models
- [ ] Add data validation

### Phase 9: Polish & Optimization
- [ ] Improve UI/UX
- [ ] Add loading states
- [ ] Error handling improvements
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Security enhancements

## Current Project Structure
```
lecture/
├── server.js              # Backend Express server
├── index.html             # Vite entry point
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
├── src/
│   ├── App.jsx           # Main React component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
└── PROJECT_GUIDELINES.md  # This file
```

## Current Features
- ✅ Login page with React
- ✅ Backend login API endpoint
- ✅ Error handling for authentication
- ✅ Vibrant, modern UI styling

## Notes
- User will provide prompts for each incremental step
- This roadmap serves as a course correction tool
- Features may be added/modified based on user requirements
- Always maintain small, incremental changes
- Keep frontend and backend updates separate when possible

---

*This document will be referenced throughout the development process to maintain consistency and approach.*
