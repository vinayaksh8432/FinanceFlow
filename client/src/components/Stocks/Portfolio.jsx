import { useEffect, useState } from "react";
import { getPortfolioData } from "../../utils/api"; // Adjust the import path as needed
import { FiSearch } from "react-icons/fi";
import { CurrencyInr, FunnelSimple } from "@phosphor-icons/react";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

export default function Portfolio() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPortfolio = async () => {
            try {
                const data = await getPortfolioData();
                if (!data) {
                    throw new Error("No data received from server");
                }
                if (isMounted) {
                    if (!Array.isArray(data.holdings)) {
                        data.holdings = []; // Initialize empty array if holdings is missing
                    }
                    setPortfolioData(data);
                }
            } catch (err) {
                console.error("Error fetching portfolio:", err);
                if (isMounted) {
                    setError(err.message);
                }
            }
        };

        fetchPortfolio();

        return () => {
            isMounted = false;
        };
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("all"); // all, profit, loss

    if (error) return <div className="error">{error}</div>;
    if (!portfolioData) return null;

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center bg-white rounded-xl p-4">
                <div className="flex gap-4">
                    <div className="bg-gray-200 flex h-fit rounded-full p-1.5 text-blue-600">
                        <RiMoneyRupeeCircleLine size={25} />
                    </div>
                    <div className="border-r border-gray-300 pr-4 flex flex-col gap-2">
                        <h1 className="uppercase text-sm">Total Asset Value</h1>
                        <p className="font-medium text-3xl">
                            ₹ {portfolioData?.data?.totalInvestment || 0}
                        </p>
                    </div>
                </div>

                <div className="px-4">
                    <h1>products</h1>
                    <div className="flex gap-2">
                        <div className="bg-blue-50 px-2 py-1">in stock</div>
                        <div className="bg-blue-50 px-2 py-1">loss</div>
                        <div className="bg-blue-50 px-2 py-1">profit</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <div className="flex items-center bg-white px-3 rounded-full overflow-hidden text-base relative border border-gray-300">
                    <FiSearch className="text-gray-400" size={22} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 outline-none text-gray-700 placeholder-gray-400"
                        placeholder="Search holdings..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={filterOption}
                        onChange={(e) => setFilterOption(e.target.value)}
                        className="border border-gray-300 shadow-sm px-4 py-2 rounded-full bg-white hover:bg-gray-50"
                    >
                        <option value="all">Filter</option>
                        <option value="profit">Profit</option>
                        <option value="loss">Loss</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full bg-white">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Company
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Symbol
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Investment Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {portfolioData.data?.holdings &&
                        portfolioData.data.holdings.length > 0 ? (
                            portfolioData.data.holdings.map((holding) => (
                                <tr
                                    key={holding._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                {holding.companyName[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {holding.companyName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {holding.sector || "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {holding.symbol}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {holding.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        <div className="flex items-center">
                                            <CurrencyInr className="mr-1" />
                                            {holding.currentPrice}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        <div className="flex items-center">
                                            <CurrencyInr className="mr-1" />
                                            {holding.investmentValue}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No holdings found in your portfolio.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
