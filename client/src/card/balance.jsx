import { FaArrowDown } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
export default function Balance() {
    return (
        <>
            <div className="flex flex-col gap-6 border border-gray-200 rounded-3xl p-5 shadow-sm">
                <h1>My Balance</h1>
                <h2 className="text-5xl ">₹6,37,55,200</h2>
                <div className="flex gap-4 justify-center">
                    <button className="flex items-center gap-2 bg-blue-50 text-blue-600 w-1/2 rounded-xl justify-center py-4">
                        <FaArrowUp />
                        Send Money
                    </button>
                    <button className="flex items-center gap-2 bg-blue-50 text-blue-600 w-1/2 rounded-xl justify-center py-4">
                        Recieve Money
                        <FaArrowDown />
                    </button>
                </div>
            </div>
        </>
    );
}
