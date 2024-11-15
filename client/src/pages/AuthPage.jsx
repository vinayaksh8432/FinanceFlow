import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginComponent from "../components/Login/loginComponent";
import SignUpComponent from "../components/Login/signUpComponent";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
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
        <div className="h-screen overflow-hidden bg-[url('assets/loginBG.svg')] bg-contain mx-auto flex">
            <div className="flex justify-end w-full ">
                <div className="text-white bg-gradient-to-b from-blue-500 to-blue-400 bg-opacity-45 flex flex-col items-center justify-center gap-4 w-1/3 rounded-l-3xl my-4 relative">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-12"
                    >
                        <Link to="/" className="text-xl">
                            FinanceFlow
                        </Link>
                    </motion.div>

                    <div className="mt-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? "login" : "signup"}
                                {...pageTransition}
                            >
                                {isLogin ? (
                                    <LoginComponent />
                                ) : (
                                    <SignUpComponent />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
