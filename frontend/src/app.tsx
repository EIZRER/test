import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { UserProvider } from '../src/contexts/UserContext';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile'
import MyEventsPage from './pages/MyEventsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import EventDetail from './pages/EventDetailPage';

const App: React.FC = () => {
  return (
    <AntApp>
      <UserProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetail />} />
              
              {/* Protected routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events"
                element={
                  <ProtectedRoute>
                    <MyEventsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </AntApp>
  );
};

export default App;
