import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineDateRange } from "react-icons/md";
export default function Overview() {
    const today = new Date();
    const firstDay = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
    ); // Start of the week (Monday)
    const lastDay = new Date(today.setDate(today.getDate() + 6)); // End of the week (Sunday)

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        return `${day} ${month}`;
    };

    const firstDate = formatDate(firstDay);
    const lastDate = formatDate(lastDay);
    const year = lastDay.getFullYear();

    const formattedWeek = `${firstDate} - ${lastDate}, ${year}`;

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
                    <button className="flex items-center  gap-2 border border-gray-300 shadow-sm p-2 rounded-lg text-gray-500">
                        <MdOutlineDateRange size="20px" />
                        {formattedWeek}
                        <IoIosArrowDown />
                    </button>
                </div>
            </div>
        </>
    );
}
