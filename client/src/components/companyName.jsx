import bubbleicon from "../assets/bubbleicon.svg";

export default function CompanyName() {
    return (
        <>
            <div className="flex gap-4 bg-white p-4 rounded-xl shadow-inner">
                <img
                    src={bubbleicon}
                    alt="Finance Flow Logo"
                    className="rounded-lg w-10"
                />
                <div>
                    <h1>Finance Flow</h1>
                    <h2 className="font-extralight text-sm text-gray-400">
                        Your Money, Your Way
                    </h2>
                </div>
            </div>
        </>
    );
}
