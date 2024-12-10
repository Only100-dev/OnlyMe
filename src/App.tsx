import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthForms from './components/auth/AuthForms';
import UnauthorizedPage from './components/auth/UnauthorizedPage';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewAssessment from './pages/NewAssessment';
import AssessmentDetails from './pages/AssessmentDetails';
import Documents from './pages/Documents';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthForms />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {isAuthenticated ? (
          <Route
            element={
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 p-8 overflow-auto">
                  <Routes>
                    <Route path="/" element={
                      <ProtectedRoute requiredPermission="view_assessment">
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/new" element={
                      <ProtectedRoute requiredPermission="create_assessment">
                        <NewAssessment />
                      </ProtectedRoute>
                    } />
                    <Route path="/assessment/:id" element={
                      <ProtectedRoute requiredPermission="view_assessment">
                        <AssessmentDetails />
                      </ProtectedRoute>
                    } />
                    <Route path="/documents" element={
                      <ProtectedRoute requiredPermission="manage_documents">
                        <Documents />
                      </ProtectedRoute>
                    } />
                    <Route path="/audit" element={
                      <ProtectedRoute requiredPermission="view_reports">
                        <AuditLog />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute requiredPermission="manage_settings">
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                      <ProtectedRoute requiredPermission="manage_users">
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
              </div>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;