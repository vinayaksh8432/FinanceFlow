import { IoMdArrowRoundForward } from "react-icons/io";
import React, { useState } from "react";
import { register } from "@/utils/api";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { ring } from "ldrs";

ring.register();

export default function SignUpComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
            <div className="px-8 py-4 rounded-lg">
                <h1 className="text-5xl text-center pb-2">Create Account</h1>
                <h1 className="text-center pb-5">
                    Enter your name, email and password to create your account
                </h1>
                <form onSubmit={handleSubmit} className="authForm">
                    <div className="py-4 flex flex-col gap-4 items-center">
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="email">Enter your name</label>
                            <input
                                type="text"
                                name="name"
                                className="outline-none border-2 rounded-lg py-3 px-5 bg-white bg-opacity-10"
                                placeholder="Name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="email">Enter your email</label>
                            <input
                                type="email"
                                name="email"
                                className="outline-none border-2 rounded-lg py-3 px-5 bg-white bg-opacity-10"
                                placeholder="example@domain.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="password">
                                Enter your password
                            </label>
                            <div className="flex justify-between items-center border-2 rounded-lg py-3 px-5 w-full bg-white bg-opacity-10">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="outline-none bg-transparent"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <label
                                    htmlFor="showPassword"
                                    className="cursor-pointer"
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
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-lg mt-6 px-5 p-3 bg-white text-black font-semibold flex items-center justify-between"
                        >
                            Create Your Account
                            {isLoading ? (
                                // Default values shown
                                <l-ring
                                    size="20"
                                    stroke="2"
                                    bg-opacity="0"
                                    speed="2.5"
                                    color="black"
                                />
                            ) : (
                                <>
                                    <BsArrowRight size={25} />
                                </>
                            )}
                        </button>
                        <div className="flex items-center mt-2">
                            <h1>Already have an account ?</h1>
                            <a
                                onClick={() => navigate("/login")}
                                className="px-2 text-yellow-300 font-semibold cursor-pointer"
                            >
                                Sign in
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        {error && (
                            <span className="text-amber-600 text-sm bg-blue-100 px-4 py-1 rounded-full flex gap-1 items-center">
                                <WarningCircle />
                                {error}
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}
