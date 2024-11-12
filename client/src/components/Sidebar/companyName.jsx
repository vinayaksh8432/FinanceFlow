import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";

export default function CompanyName({ isCollapsed, toggleSidebar }) {
    return (
        <>
            {isCollapsed ? (
                <button
                    onClick={toggleSidebar}
                    className="h-full w-full mx-auto flex justify-center items-center"
                >
                    <GoSidebarCollapse size={25} />
                </button>
            ) : (
                <div className="flex justify-between items-center p-4">
                    <div
                        className={`transition-opacity duration-500 text-nowrap ${
                            isCollapsed ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        <h1 className="text-lg">Finance Flow</h1>
                        <h2 className="font-light text-xs text-neutral-800 leading-[1]">
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
