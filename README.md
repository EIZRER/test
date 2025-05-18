# Live Event Map

An interactive map application for finding and creating local events.

## Features

- Interactive Google Maps integration
- Event creation and management
- User authentication
- Search and filter events by category
- Responsive design

## Technology Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

### Frontend
- React with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- Google Maps API integration
- Axios for API requests

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Google Maps API key

### Environment Variables

#### Backend (.env file in backend directory)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/live_event_map
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env file in frontend directory)
```
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/EIZRER/Live_Event_map.git
cd Live_Event_map
```

2. Install dependencies for the root, backend, and frontend
```bash
npm run install-all
```

3. Start the development servers
```bash
npm start
```

This will run both the backend server on port 3000 and the frontend development server on port 5173.

### Production Build

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user
- `POST /api/users/:userId/upload` - Upload user avatar/cover image

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create a new event
- `PUT /api/events/:eventId` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/user/:userId` - Get events by user ID

## License

This project is licensed under the ISC License. 