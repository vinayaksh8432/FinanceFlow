import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowRoundForward } from "react-icons/io";
import { TbEye, TbEyeClosed } from "react-icons/tb";

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.error) {
            setError(location.state.error);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill out all fields");
            return;
        }
        try {
            const response = await fetch(
                "http://localhost:3000/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Login error:", errorData);
                throw new Error(errorData.message || "Login failed");
            }

            const result = await response.json();
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || "Login failed. Please try again.");
        }
    };

    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <div>
                    <h1 className="text-6xl text-center leading-[4.25rem] font-['Greta'] font-bold">
                        Login to Your <br /> Account
                    </h1>
                </div>
                <div>
                    <form
                        className="flex flex-col gap-4 w-80"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            className="border border-zinc-300 rounded-full p-3 px-5"
                            placeholder="Phone / Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="flex items-center justify-between border p-3 border-zinc-300 rounded-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="outline-none pl-2 w-full"
                                placeholder="Passcode"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label
                                htmlFor="showPassword"
                                className="text-gray-500 cursor-pointer"
                            >
                                {showPassword ? (
                                    <TbEye size={25} />
                                ) : (
                                    <TbEyeClosed size={25} />
                                )}
                                <input
                                    id="showPassword"
                                    type="checkbox"
                                    className="hidden"
                                    checked={showPassword}
                                    onChange={() =>
                                        setShowPassword(!showPassword)
                                    }
                                />
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="border border-zinc-300 rounded-full px-5 p-3 bg-black text-white flex items-center justify-between"
                        >
                            Login to Your Account
                            <IoMdArrowRoundForward size={25} />
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