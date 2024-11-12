import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginComponent from "../components/Login/loginComponent";
import SignUpComponent from "../components/Login/signUpComponent";
import loginBG from "../assets/loginBG.svg";

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
        <div className="bg-gradient-to-b from-blue-600 to-blue-400 h-screen text-white flex">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-1/2 bg-blue-100 h-full p-1.5 object-contain overflow-hidden"
            >
                <img
                    src={loginBG}
                    alt=""
                    className="h-full w-full object-cover object-top rounded-xl"
                />
            </motion.div>
            <div className="bg-gradient-to-b from-blue-600 to-blue-400 bg-opacity-45 h-full w-1/2 flex flex-col items-center justify-between py-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="text-xl">
                        FinanceFlow
                    </Link>
                </motion.div>

                <div className="absolute top-1/2 -translate-y-1/2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "signup"}
                            {...pageTransition}
                        >
                            {isLogin ? <LoginComponent /> : <SignUpComponent />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
