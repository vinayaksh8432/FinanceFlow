import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginComponent from "../components/Login/loginComponent";
import SignUpComponent from "../components/Login/signUpComponent";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const location = useLocation();

    useEffect(() => {
        setIsLogin(location.pathname === "/login");
    }, [location]);

    const pageTransition = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration: 0.3, ease: "easeInOut" },
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[url('assets/loginBG.svg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
            <div className="w-1/2 h-full flex justify-end absolute right-0">
                <div className="text-white backdrop-blur-md bg-gradient-to-br from-blue-600/85 to-blue-400/85 flex flex-col items-center justify-center gap-6 rounded-l-3xl shadow-2xl p-8 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                    >
                        <Link
                            to="/"
                            className="text-2xl font-bold tracking-wider hover:text-blue-200 transition-colors"
                        >
                            FinanceFlow
                        </Link>
                    </motion.div>

                    {/* Auth Components */}
                    <div className="w-full max-w-md z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? "login" : "signup"}
                                {...pageTransition}
                                className="w-full"
                            >
                                {isLogin ? (
                                    <LoginComponent />
                                ) : (
                                    <SignUpComponent />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Wave decoration */}
                    <div className="absolute bottom-0 left-0 w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1440 320"
                            className="opacity-30"
                        >
                            <path
                                fill="rgba(255,255,255,0.2)"
                                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            ></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
