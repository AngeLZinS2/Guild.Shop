import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Queue } from './pages/Queue';
import { History } from './pages/History';
import { Catalog } from './pages/Catalog';
import { Unauthorized } from './pages/Unauthorized';

// Admin Pages
import { DrugManagement } from './pages/admin/DrugManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { QueueManagement } from './pages/admin/QueueManagement';

import './index.css';

function App() {
  // Add custom styles for the sidebar toggle
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .sidebar-open {
          overflow: hidden;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/history" element={<History />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin/drugs" element={<DrugManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/queue" element={<QueueManagement />} />
            </Route>
            
            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;