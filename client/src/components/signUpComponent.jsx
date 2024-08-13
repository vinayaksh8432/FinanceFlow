import { IoMdArrowRoundForward } from "react-icons/io";
import React, { useState } from "react";
import { register } from "../utils/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUpComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const result = await register({ name, email, password });
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/login");
        } catch (error) {
            setError("Signup failed. Please try again.");
        }
    };
    return (
        <>
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-6xl text-center leading-[4.25rem] font-['Greta'] font-bold">
                        Create Your
                        <br />
                        Account
                    </h1>
                </div>
                <div>
                    <form
                        className="flex flex-col gap-4 w-80"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            name="name"
                            className="border border-zinc-300 rounded-full p-3 px-5"
                            placeholder="User Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            name="email"
                            className="border border-zinc-300 rounded-full p-3 px-5"
                            placeholder="Phone / Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            name="password"
                            className="border border-zinc-300 rounded-full p-3 px-5"
                            placeholder="Set Passcode"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="border border-zinc-300 rounded-full px-5 p-3 bg-black text-white flex items-center justify-between"
                        >
                            Create Account
                            <IoMdArrowRoundForward size="25px" />
                        </button>
                        <div className="flex items-center justify-center">
                            {error && (
                                <span className="text-red-500 text-sm">
                                    {error}
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
