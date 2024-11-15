import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";

export default function Header() {
    const location = useLocation();
    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

    return (
        <div className="flex gap-4 px-36 items-center pt-4">
            <div className="h-10 w-1/2 bg-blue-500 backdrop-blur-lg bg-opacity-25 py-2 border border-slate-400 rounded">
                &nbsp;
            </div>
            <div className="w-full h-10 bg-blue-500 backdrop-blur-lg bg-opacity-25 py-2 border border-slate-400 rounded flex items-center justify-center gap-4 text-white text-center">
                <div className="pb-0.5 flex gap-2 items-center">
                    <h1 className="text-lg leading-[1]">Finance Flow</h1>
                    <h1 className="text-sm leading-[1]">
                        Your Money, Your Way
                    </h1>
                </div>
            </div>
            <div className="w-1/2 h-14 flex gap-2 items-center">
                {isAuthPage ? (
                    <Link
                        to="/"
                        className="border-2 rounded-full px-4 flex items-center gap-2"
                    >
                        Get Started <MdArrowOutward />
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="h-10 border px-4 tracking-wider flex items-center gap-2 text-white bg-blue-500 rounded text-nowrap"
                        >
                            <VscAccount /> Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="h-10 border px-4 flex items-center gap-2 text-white bg-blue-500 rounded text-nowrap"
                        >
                            Open your Account <MdArrowOutward />
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
