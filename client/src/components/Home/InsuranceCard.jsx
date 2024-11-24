import { fetchAllInsurance } from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InsuranceCard() {
    const navigate = useNavigate();
    const [insurance, setInsurance] = useState([]);

    useEffect(() => {
        const getInsurance = async () => {
            try {
                const response = await fetchAllInsurance();
                setInsurance(response);
            } catch (error) {
                console.error(error);
            }
        };
        getInsurance();
    });

    return (
        <>
            <div className="rounded-xl overflow-hidden border border-gray-300">
                <div className="flex justify-between items-center px-4 py-2">
                    <p>
                        Get health, motor, life and pocket insurance plans in
                        just a few clicks! 100% online, 100% hassle-free.
                    </p>

                    <div>
                        <button
                            onClick={() =>
                                navigate(
                                    "/dashboard/insurance/applynewinsurance"
                                )
                            }
                            className="text-lg bg-clip-text text-transparent bg-gradient-to-t from-blue-500 to-blue-800 font-bold"
                        >
                            Explore
                        </button>
                    </div>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-4 px-4 py-4">
                    {Object.values(insurance).map((category) => {
                        const item = category.items[0]; // Get only the first item of each category
                        return (
                            <div className="border border-gray-300 rounded-xl overflow-hidden">
                                <div className="flex gap-2 items-center justify-between bg-gray-100 pl-2 py-2">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/${item.image}`}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-full border bg-white shadow-inner"
                                        />
                                        <div className="text-sm max-w-44">
                                            <h1 className="truncate">
                                                {item.name}
                                            </h1>
                                            <h3 className="truncate">
                                                {item.itemId}
                                            </h3>
                                        </div>
                                    </div>
                                    <label className="bg-white text-xs border border-r-0 px-2 py-1 pr-1 rounded-l-full shadow-inner">
                                        {item.type}
                                    </label>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="text-xs px-2 py-1">
                                        {Object.values(item.details).map(
                                            (detail, index) => (
                                                <ul
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <li className="font-bold">
                                                        -
                                                    </li>
                                                    <li>{detail}</li>
                                                </ul>
                                            )
                                        )}
                                    </div>
                                    <div className="flex justify-center gap-4 mx-auto py-2">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/dashboard/insurance/applynewinsurance"
                                                )
                                            }
                                            className="text-blue-600"
                                        >
                                            Know More
                                        </button>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/dashboard/insurance/applynewinsurance"
                                                )
                                            }
                                            className="rounded-full bg-blue-600 text-white px-4 py-1"
                                        >
                                            Get Quote
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
