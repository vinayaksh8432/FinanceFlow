import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";

export default function CompanyName({ isCollapsed, toggleSidebar }) {
    return (
        <>
            {isCollapsed ? (
                <div className="mx-auto flex items-center justify-center h-full">
                    <button
                        onClick={toggleSidebar}
                        className="mx-auto flex justify-center"
                    >
                        <GoSidebarCollapse size={25} />
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center p-4">
                    <div
                        className={`transition-opacity duration-500 text-nowrap ${
                            isCollapsed ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        <h1 className="text-lg">Finance Flow</h1>
                        <h2 className="font-light text-xs text-slate-200 leading-[1]">
                            Your Money, Your Way
                        </h2>
                    </div>
                    <button onClick={toggleSidebar}>
                        <GoSidebarExpand size={25} />
                    </button>
                </div>
            )}
        </>
    );
}
