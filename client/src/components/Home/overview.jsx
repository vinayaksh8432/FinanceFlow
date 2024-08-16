import { MdOutlineDateRange, MdAccessTime } from "react-icons/md";
import { useState, useEffect } from "react";

export default function Overview() {
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        return `${day} ${month}`;
    };

    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes}`;
    };

    const [currentHour, setCurrentHour] = useState(new Date().getHours());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHour(new Date().getHours());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const today = new Date();
    const formattedDate = formatDate(today);
    const formattedTime = formatTime(today);

    return (
        <>
            <div className="flex py-6 bg-white rounded-t-xl items-center justify-between px-6">
                <div>
                    <h1>Overview</h1>
                    <h2 className="text-gray-500 text-sm">
                        Welcome back, xyz!
                    </h2>
                </div>
                <div>
                    <button className="flex items-center gap-2 border border-gray-300 shadow-sm p-2 rounded-lg text-gray-500">
                        <MdOutlineDateRange size="20px" />
                        {formattedDate} {formattedTime}
                        <MdAccessTime
                            size="20px"
                            style={{
                                transform: `rotate(${currentHour * 360}deg)`,
                            }}
                        />
                    </button>
                </div>
            </div>
        </>
    );
}
