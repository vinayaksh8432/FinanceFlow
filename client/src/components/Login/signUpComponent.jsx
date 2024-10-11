import { IoMdArrowRoundForward } from "react-icons/io";
import React, { useState } from "react";
import { register } from "../../utils/api";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function SignUpComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
            <div className="bg-white px-8 py-4 rounded-lg">
                <h1 className="text-6xl text-center">Create Your Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="py-4 flex flex-col gap-4 items-center">
                        <input
                            type="text"
                            name="name"
                            className="outline-none border-2 rounded-full py-3 px-5 w-full"
                            placeholder="User Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            name="email"
                            className="outline-none border-2 rounded-full py-3 px-5 w-full"
                            placeholder="Phone / Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="border-2 bg-white py-3 px-4 rounded-full flex items-center w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="outline-none w-full"
                                placeholder="Password"
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
                            className="w-1/2 bg-black text-white px-5 py-3 rounded-full flex items-center justify-between"
                        >
                            Create Your Account
                            <IoMdArrowRoundForward size="25px" />
                        </button>
                    </div>

                    <div className="flex justify-center">
                        {error && (
                            <span className="text-red-500 text-sm">
                                {error}
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}
