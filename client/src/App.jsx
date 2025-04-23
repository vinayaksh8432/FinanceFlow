import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/dashboard";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/homePage";
import Profile from "./components/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<AuthPage />} />
                    <Route path="forgotpassword" element={<AuthPage />} />
                    <Route path="register" element={<AuthPage />} />
                    <Route path="profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route
                        path="dashboard/*"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
