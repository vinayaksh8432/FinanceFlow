import { CaretCircleRight, User } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default function Cards() {
    const card = [
        { image: <User size={28} />, name: "Accounts" },
        { image: <User size={28} />, name: "Activities" },
        { image: <User size={28} />, name: "Loan" },
    ];

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/dashboard/loan");
    };

    return (
        <>
            <div className="grid grid-cols-4 gap-4">
                {card.map((item, index) => (
                    <div
                        key={index}
                        className="p-4 border border-gray-300 rounded-xl flex flex-col items-center relative cursor-pointer hover:bg-gray-100"
                        onClick={handleNavigate}
                    >
                        {item.image}
                        <h1>{item.name}</h1>
                        <button className="absolute right-2 bottom-2">
                            <CaretCircleRight size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}
