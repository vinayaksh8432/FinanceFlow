import { IoMdArrowRoundForward } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import bubbleicon from "../assets/bubbleicon.svg";
import { RxInstagramLogo } from "react-icons/rx";
import { RiTwitterXLine } from "react-icons/ri";
import { GrLinkedin } from "react-icons/gr";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill out all fields");
            return;
        }
        axios
            .post("http://localhost:3001/login", { email, password })
            .then((result) => {
                console.log(result);
                if (result.data === "success") {
                    navigate("/dashboard");
                } else {
                    alert("Incorrect credentials or not registered");
                    navigate("/signup");
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <div className="h-screen flex items-end bg-login-BG bg-contain">
                <div className="w-2/3 h-[95vh] flex flex-col justify-between p-20 mx-auto shadow-2xl bg-white rounded-t-[7rem]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={bubbleicon}
                                alt="Finance Flow Logo"
                                className="rounded-lg w-10"
                            />
                            <div>
                                <h1 className="text-xl font-bold font-[Merriweather]">
                                    Finance Flow
                                </h1>
                                <h2 className="font-extralight text-sm text-gray-400">
                                    Your Money, Your Way
                                </h2>
                            </div>
                        </div>
                        <button className="bg-yellow-300 rounded-full p-2 px-6 font-medium flex items-center gap-3 shadow-sm">
                            Get Started <MdArrowOutward />
                        </button>
                    </div>
                    <div className="w-1/2 flex flex-col items-center gap-6">
                        <div>
                            <h1 className="text-6xl text-center leading-[4.25rem] font-['Greta'] font-bold">
                                Login to Your <br />
                                Account
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
                                    className="border border-zinc-300 rounded-full p-3 px-5"
                                    placeholder="Phone / Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    className="border border-zinc-300 rounded-full p-3 px-5"
                                    placeholder="Passcode"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="submit"
                                    className="border border-zinc-300 rounded-full px-5 p-3 bg-black text-white flex items-center justify-between"
                                >
                                    Login to Your Account
                                    <IoMdArrowRoundForward size="25px" />
                                </button>
                            </form>
                        </div>
                        <div>
                            <Link to="/signup">SignUp?</Link>
                        </div>
                        <div className="flex flex-col items-center gap-5">
                            <h1 className="text-xl font-bold font-[Merriweather] flex items-center gap-2">
                                Get in Touch
                            </h1>
                            <div className="flex gap-5">
                                <RxInstagramLogo size="25px" />
                                <RiTwitterXLine size="25px" />
                                <GrLinkedin size="25px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
