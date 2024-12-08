import { useEffect, useRef, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { ring } from "ldrs";
import { WarningCircle } from "@phosphor-icons/react";
import ConfirmPassword from "./confirmPassword";
import { resetPassword } from "@/utils/api";

export default function ForgotPassword() {
    const checkAuthStatus = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/`,
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

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [userId, setUserId] = useState("");
    const [confrimShow, setConfimShow] = useState(false);

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

    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        if (!email) {
            setError("Please fill out all fields");
            return;
        }
        setIsLoading(true);
        try {
            const response = await resetPassword(email);
            console.log(response);
            console.log(response.userId);
            setUserId(response.userId);
            setShowOtpInput(true);
        } catch (error) {
            console.error("OTP sending error:", error);
            setError(
                error.message || "Failed to send OTP. Please try again later."
            );
        } finally {
            setIsLoading(false);
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
            toggleShow(true);
        } catch (error) {
            console.error("OTP verification error:", error);
            setError(
                error.message || "OTP verification failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const toggleShow = () => {
        setConfimShow(!confrimShow);
    };

    return (
        <>
            <div className="px-8 py-4 gap-8 flex flex-col items-center rounded-lg authForm">
                {confrimShow ? (
                    <ConfirmPassword />
                ) : (
                    <>
                        <div>
                            <h1 className="text-5xl text-center pb-2">
                                Forgot Password
                            </h1>
                            <h1 className="text-center">
                                Enter your email to receive a password reset otp
                            </h1>
                        </div>
                        <form
                            onSubmit={showOtpInput ? verifyOtp : handleSubmit}
                            className="w-full authForm flex flex-col gap-4"
                        >
                            {!showOtpInput ? (
                                <>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        className="outline-none border-2 rounded-lg py-3 px-5 bg-white bg-opacity-10 w-full"
                                        placeholder="example@domain.com"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg px-5 p-3 bg-white text-black font-semibold flex items-center justify-between"
                                    >
                                        Send OTP
                                        {isLoading ? (
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
                        </form>
                        <div className="flex justify-center">
                            {error && (
                                <span className="text-amber-600 text-sm bg-blue-50 px-4 py-1 rounded-full flex gap-1 items-center">
                                    <WarningCircle />
                                    {error}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
