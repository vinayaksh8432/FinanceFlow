import { useState } from "react";
import Home from "../components/Home/Home";
import Sidebar from "../components/Sidebar/sidebar";
import Loan from "../components/Loan/Loan";

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("home");

    const renderActiveSection = () => {
        switch (activeSection) {
            case "home":
                return <Home />;
            case "loan":
                return <Loan />;
            // case "transactions":
            //     return <Transactions />;
            // case "emi":
            //     return <EMI />;
            default:
                return <Home />;
        }
    };

    return (
        <>
            <div className="flex bg-gray-100 ">
                <Sidebar setActiveSection={setActiveSection} />
                {renderActiveSection()}
            </div>
        </>
    );
}
