import bubbleicon from "../../assets/bubbleicon.svg";

export default function CompanyName() {
    return (
        <>
            <div className="flex gap-3 bg-white p-3 rounded-lg shadow-sm">
                <img
                    src={bubbleicon}
                    alt="Finance Flow Logo"
                    className="rounded-lg w-10"
                />
                <div className="flex flex-col justify-center gap-0.5">
                    <h1 className="leading-[1]">Finance Flow</h1>
                    <h2 className="font-extralight text-sm text-gray-400 leading-[1]">
                        Your Money, Your Way
                    </h2>
                </div>
            </div>
        </>
    );
}
