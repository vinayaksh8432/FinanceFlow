import { MdArrowOutward } from "react-icons/md";
import bubbleicon from "../assets/bubbleicon.svg";

export default function Header() {
    return (
        <>
            <div className="flex justify-between p-2 px-4 border-b-2">
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
                <button className="bg-yellow-300 rounded-lg font-medium flex items-center gap-3 shadow-sm px-5">
                    Get Started <MdArrowOutward size={20}/>
                </button>
            </div>
        </>
    );
}
