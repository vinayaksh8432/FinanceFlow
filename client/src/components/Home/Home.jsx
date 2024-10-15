import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../utils/api";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { CaretDown, User } from "@phosphor-icons/react";
import Cards from "./Cards";

export default function Home() {
    const [user, setUser] = useState("");
    const [viewProfile, setViewProfile] = useState(false);
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

    const toggleLogout = () => {
        setViewProfile(!viewProfile);
    };

    return (
        <>
            <div className="px-4 flex flex-col gap-4">
                <div className="flex justify-between py-2">
                    <div>
                        <h1 className="text-lg">Hi, {user.name}!</h1>
                        <h2 className="text-gray-500 leading-[1]">
                            Welcome back!
                        </h2>
                    </div>

                    <div className="flex relative">
                        {viewProfile && (
                            <div className="z-10 w-full min-w-40 absolute px-4 py-3 border right-0 top-12 text-sm bg-slate-200 rounded-xl flex flex-col gap-2">
                                <button className="flex items-center gap-2">
                                    <FaArrowUpRightFromSquare size="12px" />
                                    View Profile
                                </button>
                                <hr className="border-t border-neutral-400" />
                                <button className="flex items-center gap-2">
                                    <FaArrowUpRightFromSquare size="12px" />
                                    View Profile
                                </button>
                            </div>
                        )}
                        <div
                            onClick={toggleLogout}
                            className="flex gap-4 items-center cursor-pointer"
                        >
                            <div className="flex gap-2 items-center">
                                <User
                                    size={28}
                                    className="bg-zinc-300 rounded-full text-gray-500 p-1 border border-gray-300"
                                />

                                {user ? (
                                    <>
                                        <h1>{user.name}</h1>
                                    </>
                                ) : (
                                    <h1>INVALID USER</h1>
                                )}
                            </div>
                            <button className="rounded-full">
                                <CaretDown />
                            </button>
                        </div>
                    </div>
                </div>
                <Cards />
            </div>
        </>
    );
}
