import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { UserProvider } from './contexts/UserContext';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AntApp>
      <UserProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <div>Home Page</div>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </BrowserRouter>
      </UserProvider>
    </AntApp>
  );
};

export default App;
