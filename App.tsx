import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { EventDetails } from './pages/EventDetails';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { EventForm } from './pages/EventForm';
import { StorageService } from './services/storage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = StorageService.isAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events/new" 
            element={
              <ProtectedRoute>
                <EventForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events/edit/:id" 
            element={
              <ProtectedRoute>
                <EventForm />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;