import React, { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { IoIosArrowUp } from "react-icons/io";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { logout, getUserDetails } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [viewProfile, setViewProfile] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserDetails();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
                // If there's an error fetching user data, assume the user is not authenticated
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    const toggleLogout = () => {
        setViewProfile(!viewProfile);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            <div className="bg-white p-3 rounded-md flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <CgProfile size="35px" />
                    <div>
                        {user ? (
                            <>
                                <h1 className="font-semibold text-xs">
                                    {user.name}
                                </h1>
                                <h2 className="font-extralight text-xs text-gray-400">
                                    {user.email}
                                </h2>
                            </>
                        ) : (
                            <h1 className="font-extralight text-sm text-gray-400">
                                Loading...
                            </h1>
                        )}
                    </div>
                </div>
                <div className="relative">
                    {viewProfile && (
                        <div className="absolute w-40 bg-white bottom-[3.25rem] p-2 -right-3 rounded-md flex flex-col gap-2">
                            <button className="w-full flex justify-between items-center gap-2">
                                View Profile
                                <FaArrowUpRightFromSquare size="15px" />
                            </button>
                            <button
                                className="w-full flex justify-between items-center gap-2"
                                onClick={handleLogout}
                            >
                                Logout
                                <LuLogOut size="18px" />
                            </button>
                        </div>
                    )}
                    <button
                        className="logout rounded-full p-1"
                        onClick={toggleLogout}
                    >
                        <IoIosArrowUp size="18px" />
                    </button>
                </div>
            </div>
        </>
    );
}
