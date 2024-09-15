import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Theme
import { themeSettings } from "theme";

// Scenes
import {
  Layout,
  Dashboard,
  Users,
  Login,
  Feeds,
  Tournaments,
  Chats,
  Games,
  Groups,
  Payments,
  Notifications,
  Settings
} from "scenes";
import './i18n';

// App
const App = () => {
  const mode = useSelector((state) => state.global.mode);
  // theme setting
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      // Redirect to login if no token is found
      return <Navigate to="/login" replace />;
    }
  
    return children; // Render the children if token exists
  };
  const BypassRoute = ({ children }) => {
    const token = localStorage.getItem("token");
  
    if (token) {
      // Redirect to login if no token is found
      return <Navigate to="/dashboard" replace />;
    }
  
    return children; // Render the children if token exists
  };
  return (
    <div className="app">
      <BrowserRouter>
        {/* Theme Provider */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<BypassRoute><Login /></BypassRoute>} />
            {/* Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/feeds" element={<ProtectedRoute><Feeds /></ProtectedRoute>} />
              <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
              <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
              <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
              <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
