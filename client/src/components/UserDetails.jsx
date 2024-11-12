import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getUserDetails, logout } from "../utils/api";
import { User } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { LuBell } from "react-icons/lu";
import StockSearch from "./Stocks/components/StockSearch";

const menuVariants = {
    initial: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transformOrigin: "top right",
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            duration: 0.3,
            stiffness: 300,
            damping: 20,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
            duration: 0.25,
        },
    },
};

export default function UserDetails() {
    const [user, setUser] = useState("");
    const [viewProfile, setViewProfile] = useState(false);
    const [notification, setNotification] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const activeRouteLabel = [
        {
            path: "/home",
            label: "Home",
        },
        {
            path: "/loan",
            label: "Loans",
        },
        {
            path: "/portfolio",
            label: "My Assets",
        },
        {
            path: "/market",
            label: "Market",
            component: StockSearch,
        },
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserDetails();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    const toggleUser = () => {
        setViewProfile(!viewProfile);
        setNotification(false);
    };

    const toggleNotification = () => {
        setNotification(!notification);
        setViewProfile(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (viewProfile || notification) &&
                !event.target.closest(".dropdown-container")
            ) {
                setViewProfile(false);
                setNotification(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [viewProfile, notification]);

    const activeRoute = activeRouteLabel.find((route) =>
        location.pathname.startsWith(`/dashboard${route.path}`)
    );
    return (
        <div className="flex justify-between border-b border-blue-400 h-18 p-6 bg-blue-200">
            <NavLink
                to={`/dashboard${activeRoute ? activeRoute.path : ""}`}
                className="text-2xl leading-[1] flex items-center gap-6"
            >
                {activeRoute ? activeRoute.label : "undefined"}

                {/* {activeRoute?.component && <activeRoute.component />} */}
            </NavLink>

            <div className="flex relative dropdown-container">
                <div className="flex gap-4 items-center cursor-pointer">
                    <div className="flex gap-2 items-center pr-2">
                        <LuBell
                            onClick={toggleNotification}
                            size={30}
                            className="bg-white p-1 rounded-md border border-blue-400 hover:bg-zinc-100 transition-colors"
                        />
                        <AnimatePresence>
                            {notification && (
                                <motion.div
                                    variants={menuVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="absolute z-10 w-auto min-w-52 right-14 top-12 text-sm border bg-blue-50 rounded-lg flex flex-col shadow-lg"
                                >
                                    <div className="absolute -top-4 right-3 border-8 border-b-blue-50 border-transparent" />
                                    <div className="flex gap-2 items-center p-4 ">
                                        <div>
                                            <h1 className="font-medium">
                                                Notifications
                                            </h1>
                                            <h1 className="text-xs text-gray-600">
                                                No new notifications
                                            </h1>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        |
                        <User
                            onClick={toggleUser}
                            size={30}
                            className="bg-white p-1 rounded-md border border-blue-400 hover:bg-zinc-100 transition-colors"
                        />
                        <AnimatePresence>
                            {viewProfile && (
                                <motion.div
                                    variants={menuVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="absolute z-10 w-auto min-w-52 right-0 top-12 text-sm border bg-blue-50 rounded-lg flex flex-col shadow-lg"
                                >
                                    <div className="absolute -top-4 right-3 border-8 border-b-blue-50 border-transparent" />
                                    {user ? (
                                        <div className="flex gap-2 items-center p-4 ">
                                            <User
                                                size={50}
                                                className="bg-zinc-300 rounded-full text-gray-500 py-2 border-b border-gray-300"
                                            />
                                            <div>
                                                <h1 className="font-medium">
                                                    {user.name}
                                                </h1>
                                                <h1 className="text-xs text-gray-600">
                                                    {user.email}
                                                </h1>
                                            </div>
                                        </div>
                                    ) : (
                                        <h1>INVALID USER</h1>
                                    )}
                                    <div className="flex flex-col border-t border-gray-300 py-1">
                                        <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-blue-100/50 transition-colors text-left">
                                            View Profile
                                        </button>
                                        <button
                                            className="flex items-center gap-2 text-red-600 hover:bg-red-100 px-4 py-1.5 transition-colors text-left"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
