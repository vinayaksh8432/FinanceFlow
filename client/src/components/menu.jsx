import { HiMiniHome } from "react-icons/hi2";
export default function Menu() {
    return (
        <>
            <div>
                <h1 className="my-4 uppercase text-gray-400 font-[SFPro-Reg]">
                    Menu
                </h1>
                <div className="flex flex-col gap-2">
                    <button className="w-full flex items-center gap-2 rounded-md bg-white p-2 px-4 ">
                        <HiMiniHome />
                        Dashboard
                    </button>
                    <button className="w-full flex items-center gap-2 rounded-md bg-white p-2 px-4 ">
                        <HiMiniHome />
                        Activities
                    </button>
                    <button className="w-full flex items-center gap-2 rounded-md bg-white p-2 px-4 ">
                        <HiMiniHome />
                        Transactions
                    </button>
                    <button className="w-full flex items-center gap-2 rounded-md bg-white p-2 px-4 ">
                        <HiMiniHome />
                        Stocks
                    </button>
                    <button className="w-full flex items-center gap-2 rounded-md bg-white p-2 px-4 ">
                        <HiMiniHome />
                        EMI / Loans
                    </button>
                </div>
            </div>
        </>
    );
}
