import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import MainLayout from "./layout/MainLayout";
import Dashbaord from "./pages/dashboard";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout />} path="/">
                        <Route element={<Login />} path="login" />
                        <Route element={<Dashbaord />} path="dashboard" />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
