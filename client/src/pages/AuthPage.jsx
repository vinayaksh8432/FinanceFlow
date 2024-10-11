import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
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
            <div className="bg-[url('assets/bluebg.jpg')] m-auto h-[90.5vh] pt-20 flex flex-col items-center rounded-t-[50px]">
                <div className="w-1/2 bg-gray-100 rounded-3xl">
                    <div className="text-xl text-right space-x-4 py-4 px-8">
                        <a
                            onClick={() => navigate("/login")}
                            className={`hover:cursor-pointer transition-all duration-300 px-2 ${
                                isLogin ? "underline underline-offset-4" : ""
                            }`}
                        >
                            Sign in
                        </a>
                        <a
                            onClick={() => navigate("/register")}
                            className={`hover:cursor-pointer transition-all duration-300 px-2 ${
                                !isLogin ? "underline underline-offset-4" : ""
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
