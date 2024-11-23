import { useState } from "react";
import CompanyName from "./companyName";
import Menu from "./menu";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className={`
                transition-all duration-300 ease-in-out text-white
                ${isCollapsed ? "w-20 rounded-r-3xl" : "w-52"}
                sticky self-start top-0 h-screen
                z-10 border-l-0 border-b-0 border-black bg-gradient-to-tr from-blue-500 to-blue-700
            `}
        >
            <div className="h-18 relative border-b border-neutral-300">
                <CompanyName
                    isCollapsed={isCollapsed}
                    toggleSidebar={toggleSidebar}
                />
            </div>
            <div className="">
                <Menu isCollapsed={isCollapsed} />
            </div>
        </div>
    );
}
