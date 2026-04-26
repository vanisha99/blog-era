import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { PostsProvider } from "./context/PostsContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BloggerDashboard from "./pages/blogger/BloggerDashboard";
import UserDashboard from "./pages/user/UserDashboard";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <PostsProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/blogger/dashboard" element={
                <ProtectedRoute allowedRoles={["blogger"]}><BloggerDashboard /></ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={["user"]}><UserDashboard /></ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </PostsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}