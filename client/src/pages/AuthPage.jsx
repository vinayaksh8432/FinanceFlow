import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RxInstagramLogo } from "react-icons/rx";
import { RiTwitterXLine } from "react-icons/ri";
import { GrLinkedin } from "react-icons/gr";
import LoginComponent from "../components/loginComponent";
import SignUpComponent from "../components/signUpComponent";
import Header from "../components/header";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLogin(location.pathname === "/login");
    }, [location]);

    const toggleAuth = () => {
        const newPath = isLogin ? "/signup" : "/login";
        navigate(newPath);
    };

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center justify-center h-[85vh]">
                <div className="border border-gray-300 py-12 px-24 rounded-xl shadow-sm">
                    {isLogin ? <LoginComponent /> : <SignUpComponent />}
                    <div className="flex flex-col gap-4 items-center">
                        <button
                            onClick={toggleAuth}
                            className="text-blue-500 hover:underline"
                        >
                            {isLogin
                                ? "Need an account? Sign up"
                                : "Already have an account? Log in"}
                        </button>
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-xl font-bold font-[Merriweather]">
                                Get in Touch
                            </h1>
                            <div className="flex gap-4">
                                <RxInstagramLogo size="25px" />
                                <RiTwitterXLine size="25px" />
                                <GrLinkedin size="25px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
