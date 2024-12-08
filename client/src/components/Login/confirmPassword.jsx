import { updatePassword } from "@/utils/api";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";

export default function ConfirmPassword() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.newPassword !== formData.confirmNewPassword) {
            alert("Passwords don't match!");
            setLoading(false);
            return;
        }

        try {
            const response = await updatePassword(formData.newPassword);
            console.log(response);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to update password");
        } finally {
            isLoading(false);
        }
    };

    return (
        <>
            <div>
                <h1 className="text-4xl text-center pb-2">
                    Confirm new password
                </h1>
                <form
                    action={handleSubmit}
                    className="flex flex-col gap-2 authForm"
                >
                    <h1>New Password</h1>
                    <input
                        type="password"
                        name="newPassword"
                        autoComplete="new-password"
                        className="outline-none border-2 rounded-lg py-3 px-5 bg-white bg-opacity-10 w-full"
                        placeholder="Enter new password"
                        onChange={handleChange}
                    />
                    <h1>Confirm Password</h1>
                    <input
                        type="password"
                        name="confirmNewPassword"
                        autoComplete="new-password"
                        className="outline-none border-2 rounded-lg py-3 px-5 bg-white bg-opacity-10 w-full"
                        placeholder="Confirm your new password"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full rounded-lg mt-6 px-5 p-3 bg-white text-black font-semibold flex items-center justify-between"
                    >
                        Verify OTP
                        {loading ? (
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
                </form>
            </div>
        </>
    );
}
