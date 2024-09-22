import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import bubbleicon from "../assets/bubbleicon.svg";
import { VscAccount } from "react-icons/vsc";

export default function Header() {
    const location = useLocation();
    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

    return (
        <div className="flex justify-between px-8 py-4 items-center">
            <div className="flex items-center gap-4">
                <img
                    src={bubbleicon}
                    alt="Finance Flow Logo"
                    className="rounded-lg w-10"
                />
                <div>
                    <h1 className="text-xl font-bold font-[Merriweather] leading-5">
                        Finance Flow
                    </h1>
                    <h1 className="font-extralight text-sm text-gray-400">
                        Your Money, Your Way
                    </h1>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                {isAuthPage ? (
                    <Link
                        to="/"
                        className="border-2 rounded-full py-2 px-4 flex items-center gap-2"
                    >
                        Get Started <MdArrowOutward />
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="py-2 px-4 tracking-wider flex items-center gap-2"
                        >
                            <VscAccount /> Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="border-2 rounded-full py-2 px-4 flex items-center gap-2"
                        >
                            Open your Account <MdArrowOutward />
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
