import { NavLink } from "react-router-dom";
import {
    Bank,
    ChartLineUp,
    ShoppingCart,
    HouseLine,
} from "@phosphor-icons/react";
import { RiShieldCrossLine } from "react-icons/ri";

export default function Menu({ isCollapsed }) {
    const menuItems = [
        {
            path: "home",
            icon: <HouseLine size="25px" />,
            label: "Home",
        },
        {
            path: "loan",
            icon: <Bank size="25px" />,
            label: "Loans",
        },
        {
            path: "insurance",
            icon: <RiShieldCrossLine size="25px" />,
            label: "Insurance",
        },
        {
            path: "portfolio",
            icon: <ChartLineUp size="25px" />,
            label: "Assets",
        },
        {
            path: "market",
            icon: <ShoppingCart size="25px" />,
            label: "Market",
        },
    ];

    return (
        <div className="py-2 flex-1 overflow-hidden">
            <div className="flex flex-col gap-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center
                            transition-all duration-300 text-black
                            ${isActive ? "bg-white" : ""}
                        `}
                        title={item.label}
                    >
                        {isCollapsed ? (
                            <span className="pl-4 py-2">{item.icon}</span>
                        ) : (
                            <span className="flex items-center gap-4 px-4 py-2">
                                {item.icon}
                                <span>{item.label}</span>
                            </span>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
