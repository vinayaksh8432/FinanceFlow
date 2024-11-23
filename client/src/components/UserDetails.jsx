import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getUserDetails, logout } from "../utils/api";
import { User } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { LuBell } from "react-icons/lu";
import { SlSettings } from "react-icons/sl";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useNotifications } from "@/context/notification";
import { format } from "date-fns";

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
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
    } = useNotifications();

    const handleNotificationClick = (notif) => {
        markAsRead(notif.id);
        if (notif.link) {
            navigate(notif.link);
        }
    };

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
            path: "/insurance",
            label: "Insurance",
        },
        {
            path: "/portfolio",
            label: "My Assets",
        },
        {
            path: "/market",
            label: "Market",
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
        <div className="flex justify-between h-18 p-6 border-b border-neutral-300 bg-white shadow-sm">
            <NavLink
                to={`/dashboard${activeRoute ? activeRoute.path : ""}`}
                className="text-2xl leading-[1] flex items-center gap-6 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
                {activeRoute ? activeRoute.label : "undefined"}
            </NavLink>

            <div className="flex relative dropdown-container">
                <div className="flex gap-6 items-center">
                    <div className="flex gap-4 items-center relative">
                        <button
                            onClick={toggleNotification}
                            className="relative group"
                        >
                            <LuBell
                                size={32}
                                className="bg-white p-1.5 rounded-full border-2 border-blue-400 hover:bg-blue-50 transition-all duration-200 text-blue-500"
                            />
                            {unreadCount > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-white text-xs">
                                        {unreadCount}
                                    </span>
                                </div>
                            )}
                        </button>

                        <AnimatePresence>
                            {notification && (
                                <motion.div
                                    variants={menuVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="absolute z-10 w-80 -right-5 top-12 border bg-white rounded-xl flex flex-col shadow-lg"
                                >
                                    <div>
                                        <div className="absolute -top-4 right-7 border-8 border-b-black border-transparent" />
                                        <div className="absolute -top-4 right-7 border-8 border-b-white border-transparent" />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h1 className="font-semibold text-lg">
                                                Notifications
                                            </h1>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="">
                                            {notifications.length === 0 ? (
                                                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                                                    No new notifications
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {notifications.map(
                                                        (notif) => (
                                                            <div
                                                                key={notif.id}
                                                                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors relative border ${
                                                                    !notif.read
                                                                        ? "bg-blue-50"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    handleNotificationClick(
                                                                        notif
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex justify-between">
                                                                    <p
                                                                        className={`text-sm ${
                                                                            !notif.read
                                                                                ? "font-medium"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {
                                                                            notif.message
                                                                        }
                                                                    </p>
                                                                    <button
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            clearNotification(
                                                                                notif.id
                                                                            );
                                                                        }}
                                                                        className="text-gray-400 hover:text-gray-600 absolute -top-1 -right-1 bg-white rounded-full"
                                                                    >
                                                                        <IoMdCloseCircleOutline
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {format(
                                                                        new Date(
                                                                            notif.timestamp
                                                                        ),
                                                                        "MMM d, yyyy h:mm a"
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-300"></div>
                    <div className="flex gap-4 items-center relative">
                        <button onClick={toggleUser} className="group">
                            <User
                                size={32}
                                className="bg-white p-1.5 rounded-full border-2 border-blue-400 hover:bg-blue-50 transition-all duration-200 text-blue-500"
                            />
                        </button>

                        <AnimatePresence>
                            {viewProfile && (
                                <motion.div
                                    variants={menuVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="absolute z-10 w-80 -right-2 top-12 border-0 bg-white rounded-xl flex flex-col shadow-lg"
                                >
                                    <div className="absolute -top-4 right-4 border-8 border-b-blue-600 border-transparent" />

                                    {user ? (
                                        <>
                                            <div className="rounded-t-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <User
                                                        size={50}
                                                        className="bg-white/90 rounded-full text-blue-500 p-3"
                                                    />
                                                    <div className="text-white">
                                                        <h1 className="font-semibold text-lg">
                                                            {user.name}
                                                        </h1>
                                                        <h2 className="text-sm text-blue-100">
                                                            {user.email}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2 flex items-center gap-2">
                                                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                                    <SlSettings size={18} />
                                                    View Profile
                                                </button>
                                                <div className="h-8 w-1 bg-blue-300"></div>
                                                <button
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                                    onClick={handleLogout}
                                                >
                                                    <IoMdCloseCircleOutline
                                                        size={20}
                                                    />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            INVALID USER
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
