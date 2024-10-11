import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowRoundForward } from "react-icons/io";
import { TbEyeClosed } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

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

    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <div className="bg-white px-8 py-4 flex flex-col items-center rounded-lg">
                <h1 className="text-6xl text-center">Login to Your Account</h1>
                <form
                    onSubmit={showOtpInput ? verifyOtp : handleSubmit}
                    className="w-full"
                >
                    {!showOtpInput ? (
                        <>
                            <div className="flex flex-col py-4 gap-4 items-center">
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    className="outline-none border-2 rounded-full py-3 px-5 w-full"
                                    placeholder="Phone / Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <label
                                    htmlFor=""
                                    className="flex justify-between items-center border-2 rounded-full py-3 px-5 w-full"
                                >
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        className="outline-none w-full"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <label
                                        htmlFor="showPassword"
                                        className="text-gray-500 cursor-pointer"
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
                                                setShowPassword(!showPassword)
                                            }
                                        />
                                    </label>
                                </label>
                                <button
                                    type="submit"
                                    className="rounded-full px-5 p-3 bg-black text-white flex items-center justify-between w-1/2"
                                >
                                    Login to Your Account
                                    <IoMdArrowRoundForward size={25} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="text-gray-600 pt-2">
                                Enter the OTP sent to {email}
                            </p>
                            <div className="flex gap-4 py-4 justify-center">
                                {otpInputs.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={otpRefs[index]}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-12 border-2 rounded-lg text-center text-xl"
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
                                className="border-2 rounded-full px-5 p-3 bg-black text-white flex items-center justify-between w-1/2 mb-4"
                            >
                                Verify OTP
                                <IoMdArrowRoundForward size={25} />
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isResendDisabled}
                                className={`text-blue-600 ${
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
                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center">
                            <TailSpin
                                visible={true}
                                height="80"
                                width="80"
                                color="#000000"
                                ariaLabel="tail-spin-loading"
                                radius="1"
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
