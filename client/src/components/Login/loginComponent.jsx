import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbEyeClosed } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { ring } from "ldrs";

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);

    const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);

    function onPaste(event) {
        const pasted = event.clipboardData
            ? event.clipboardData.getData("text/plain")
            : "";
        setOtpInputs(pasted.split("").slice(0, otpInputs.length));
    }

    const otpRefs = [
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
    ];

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/user`,
                {
                    credentials: "include",
                }
            );
            if (response.ok) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        }
    };

    useEffect(() => {
        if (location.state && location.state.error) {
            setError(location.state.error);
        }
        checkAuthStatus();
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill out all fields");
            return;
        }
        setIsLoading(true); // Set loading to true when submission starts
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
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
                throw new Error(errorData.message || "Login failed");
            }

            const result = await response.json();
            if (result.requireOtp) {
                setUserId(result.userId);
                setShowOtpInput(true);
            } else {
                localStorage.setItem("user", JSON.stringify(result.user));
                localStorage.setItem("token", result.token);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false); // Set loading to false when done
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        const fullOtp = otpInputs.join("");
        if (fullOtp.length !== 6) {
            setError("Please enter all 6 digits of the OTP");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, otp: fullOtp }),
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "OTP verification failed");
            }

            const result = await response.json();
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("token", result.token);
            navigate("/dashboard");
        } catch (error) {
            console.error("OTP verification error:", error);
            setError(
                error.message || "OTP verification failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        const newOtpInputs = [...otpInputs];
        newOtpInputs[index] = value.replace(/[^0-9]/g, "").slice(0, 1);
        setOtpInputs(newOtpInputs);

        // Move to next input if value is entered
        if (value && index < 5) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleResendOTP = async () => {
        setIsResendDisabled(true);
        setResendTimer(30);

        console.log("Attempting to resend OTP for userId:", userId);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/resend-otp`, // Updated endpoint
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId }),
                    credentials: "include",
                }
            );

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                let errorMessage;

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message;
                } else {
                    const textResponse = await response.text();
                    console.error("Non-JSON error response:", textResponse);
                    errorMessage = `Server error (${response.status}). Please try again.`;
                }

                throw new Error(errorMessage || "Failed to resend OTP");
            }

            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                console.log("OTP resent successfully");
            } else {
                console.warn(
                    "Unexpected response format:",
                    await response.text()
                );
                throw new Error("Unexpected response format from server");
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            setError(
                error.message || "Failed to resend OTP. Please try again."
            );
        } finally {
            const timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        setIsResendDisabled(false);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    ring.register();


    return (
        <>
            <div className="px-8 py-4 flex flex-col items-center rounded-lg">
                <h1 className="text-5xl text-center pb-2">Welcome Back</h1>
                <h1 className="text-center pb-10    ">
                    Enter your email and password to access your account
                </h1>
                <form
                    onSubmit={showOtpInput ? verifyOtp : handleSubmit}
                    className="w-full authForm"
                >
                    {!showOtpInput ? (
                        <>
                            <div className="flex flex-col py-4 gap-4 items-center">
                                <div className="w-full flex flex-col gap-1">
                                    <label htmlFor="email">
                                        Enter your email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        className="outline-none border-2 rounded-lg py-3 px-5 bg-white bg-opacity-10"
                                        placeholder="example@domain.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-1">
                                    <label htmlFor="password">
                                        Enter your password
                                    </label>
                                    <label
                                        htmlFor=""
                                        className="flex justify-between items-center border-2 rounded-lg py-3 px-5 w-full bg-white bg-opacity-10"
                                    >
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
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
                                                <FaRegEye size={25} />
                                            ) : (
                                                <TbEyeClosed size={25} />
                                            )}
                                            <input
                                                id="showPassword"
                                                type="checkbox"
                                                className="hidden"
                                                checked={showPassword}
                                                onChange={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            />
                                        </label>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-lg mt-6 px-5 p-3 bg-white text-black font-semibold flex items-center justify-between"
                                >
                                    Login to your Account
                                    {isLoading ? (
                                        // Default values shown
                                        <l-ring
                                            size="20"
                                            stroke="2"
                                            bg-opacity="0"
                                            speed="2.5"
                                            color="black"
                                        ></l-ring>
                                    ) : (
                                        <>
                                            <BsArrowRight size={25} />
                                        </>
                                    )}
                                </button>
                                <div className="flex items-center mt-2">
                                    <h1>Don't have an account ?</h1>
                                    <a
                                        onClick={() => navigate("/register")}
                                        className="px-2 text-yellow-300 font-semibold"
                                    >
                                        Sign up
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="pt-2">
                                Enter the OTP sent to {email}
                            </p>
                            <div className="flex gap-4 py-4 justify-center">
                                {otpInputs.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={otpRefs[index]}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-12 border-b-2 border-white text-center text-xl bg-transparent outline-none"
                                        value={digit}
                                        onChange={(e) =>
                                            handleOtpChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Backspace" &&
                                                !digit &&
                                                index > 0
                                            ) {
                                                otpRefs[
                                                    index - 1
                                                ].current.focus();
                                            }
                                        }}
                                        onPaste={onPaste}
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-lg mt-6 px-5 p-3 bg-white text-black font-semibold flex items-center justify-between"
                            >
                                Verify OTP
                                {isLoading ? (
                                    // Default values shown
                                    <l-ring
                                        size="20"
                                        stroke="2"
                                        bg-opacity="0"
                                        speed="2.5"
                                        color="black"
                                    ></l-ring>
                                ) : (
                                    <>
                                        <BsArrowRight size={25} />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isResendDisabled}
                                className={`pt-4 ${
                                    isResendDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isResendDisabled
                                    ? `Resend OTP in ${resendTimer}s`
                                    : "Resend OTP"}
                            </button>
                        </div>
                    )}
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
