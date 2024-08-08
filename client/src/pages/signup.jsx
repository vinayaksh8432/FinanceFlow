import { MdArrowOutward } from "react-icons/md";
import bubbleicon from "../assets/bubbleicon.svg";
import { RxInstagramLogo } from "react-icons/rx";
import { RiTwitterXLine } from "react-icons/ri";
import { GrLinkedin } from "react-icons/gr";
import { IoMdArrowRoundForward } from "react-icons/io";
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:3001/signup", { name, email, password })
            .then((result) => {
                console.log(result);
                navigate("/login");
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
                    <div className="w-1/2 flex flex-col items-center gap-6 self-end pt-8">
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
                                    type="name"
                                    name="name"
                                    id=""
                                    className="border border-zinc-300 rounded-full p-3 px-5"
                                    placeholder="User Name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    id=""
                                    className="border border-zinc-300 rounded-full p-3 px-5"
                                    placeholder="Phone / Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    id=""
                                    className="border border-zinc-300 rounded-full p-3 px-5"
                                    placeholder="Set Passcode"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <button
                                    type="submit"
                                    className="border border-zinc-300 rounded-full px-5 p-3 bg-black text-white flex items-center justify-between"
                                >
                                    Create Account
                                    <IoMdArrowRoundForward size="25px" />
                                </button>
                            </form>
                        </div>
                        <div>
                            <Link to="/login">Login?</Link>
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
