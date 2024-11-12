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
                transition-all duration-300 ease-in-out
                ${isCollapsed ? "w-16 rounded-r-3xl" : "w-52"}
                bg-blue-300 sticky self-start top-0 h-screen 
                z-10 border border-l-0 border-t-0 border-blue-400
            `}
        >
            <div className="h-18 border-b border-b-blue-400 relative">
                <CompanyName
                    isCollapsed={isCollapsed}
                    toggleSidebar={toggleSidebar}
                />
            </div>
            <Menu isCollapsed={isCollapsed} />
        </div>
    );
}
