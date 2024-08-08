import { IoMdArrowRoundForward } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import bubbleicon from "../assets/bubbleicon.svg";
export default function Login() {
    return (
        <>
            <div className="h-screen flex items-end">
                <div className="flex flex-col items-center justify-center gap-4 w-2/3 h-[95vh] mx-auto shadow-2xl bg-white rounded-t-[8rem]">
                    <div className="flex relative md:absolute -translate-y-72 items-center gap-10">
                        <h1 className="text-xl font-bold font-[Merriweather] flex items-center gap-2">
                            <img src={bubbleicon} alt="" className="rounded-lg w-8" />
                            Finance Flow
                        </h1>
                        <button className="bg-yellow-300 rounded-full p-2 px-6 font-medium flex items-center gap-3">
                            Get Started <MdArrowOutward />
                        </button>
                    </div>
                    <div className="pb-12">
                        <h1 className="text-6xl font-['Merriweather'] font-bol">
                            Login to your Account
                        </h1>
                    </div>
                    <div>
                        <form className="flex flex-col gap-4 w-80">
                            <input
                                type="email"
                                name=""
                                id=""
                                className="border border-zinc-300 rounded-full p-3 px-5"
                                placeholder="Phone / Email"
                            />
                            <input
                                type="password"
                                name=""
                                id=""
                                className="border border-zinc-300 rounded-full p-3 px-5"
                                placeholder="Passcode"
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
                </div>
            </div>
        </>
    );
}
