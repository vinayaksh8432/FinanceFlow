import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginComponent from "../components/Login/loginComponent";
import SignUpComponent from "../components/Login/signUpComponent";
import Header from "../components/header";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLogin(location.pathname === "/login");
    }, [location]);

    return (
        <div>
            <Header />
            <div className="bg-gray-100 px-20 py-20 flex justify-center">
                <div className="flex flex-col bg-gray-200 rounded-3xl">
                    <div className="space-x-4 bg-gray-200 px-4 py-2 rounded-t-xl text-xl text-right">
                        <a
                            onClick={() => navigate("/login")}
                            className={`hover:cursor-pointer ${
                                isLogin ? "border-b-2 border-black" : ""
                            }`}
                        >
                            Sign in
                        </a>
                        <a
                            onClick={() => navigate("/register")}
                            className={`hover:cursor-pointer ${
                                !isLogin ? "border-b-2 border-black" : ""
                            }`}
                        >
                            Sign up
                        </a>
                    </div>
                    {isLogin ? <LoginComponent /> : <SignUpComponent />}
                </div>
            </div>
        </div>
    );
}
