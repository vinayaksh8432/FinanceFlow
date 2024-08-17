export default function Loan() {
    return (
        <div className="h-full w-screen py-2 px-4">
            <div className="bg-white rounded-xl p-6">
                <div className="">
                    <h1>Apply Loan in Minutes</h1>
                    <h2>Select One of Loans</h2>
                </div>
                <hr />
                <div className="flex justify-between py-2">
                    <button className="border border-gray-300 p-6 px-10 rounded-xl">
                        Gold
                    </button>
                    <button className="border border-gray-300 p-6 px-10 rounded-xl">
                        Home
                    </button>
                    <button className="border border-gray-300 p-6 px-10 rounded-xl">
                        Vehical
                    </button>
                    <button className="border border-gray-300 p-6 px-10 rounded-xl">
                        Personal
                    </button>
                    <button className="border border-gray-300 p-6 px-10 rounded-xl">
                        Personal
                    </button>
                    <button className="border border-gray-300 p-6 px-10 rounded-xl">
                        Personal
                    </button>
                </div>
                <hr />
                <div>
                    <h1>Choose Months</h1>
                </div>
            </div>
        </div>
    );
}
