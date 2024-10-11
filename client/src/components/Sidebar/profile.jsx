import React, { useState, useEffect } from "react";
import { LuLogOut } from "react-icons/lu";
import { logout, getUserDetails } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            <div className="px-4 py-2 rounded-md flex items-center justify-between">
                <button
                    className="flex items-center gap-4 rounded-md"
                    onClick={handleLogout}
                >
                    <LuLogOut size="18px" />
                    Logout
                </button>
            </div>
        </>
    );
}
