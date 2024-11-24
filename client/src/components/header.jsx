import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import logo from "@/assets/logo.svg";
import { MoveRight } from "lucide-react";

export default function Header() {
    const location = useLocation();
    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/register";

    return (
        <div className="flex justify-between px-36 items-center pt-8">
            <div className="px-4 h-10 text-white flex items-center gap-4">
                <img src={logo} alt="" className="w-7 h-auto" />
                <h1 className="text-2xl leading-[1]">FinanceFlow</h1>
            </div>
            <div className="fixed left-1/2 -translate-x-1/2 w-2/5 z-50">
                <ul className="mx-auto h-10 bg-blue-600 backdrop-blur-xl bg-opacity-25 py-2 border border-slate-400 rounded-full flex justify-between text-white text-center px-8 items-center">
                    <li>Overview</li>
                    <li>Overview</li>
                    <li>Overview</li>
                    <li>Overview</li>
                </ul>
            </div>
            <div className="flex gap-2 items-center">
                <Link
                    to="/login"
                    className="h-10 px-4 tracking-wider flex items-center gap-2 text-white"
                >
                    Sign in
                    <MoveRight />
                </Link>
            </div>
        </div>
    );
}
