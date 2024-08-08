import CompanyName from "./companyName";
import Menu from "./menu";

export default function Sidebar() {
    return (
        <>
            <div className="w-80 h-screen bg-gray-100 py-2 px-4 name">
                <CompanyName />
                <Menu />
            </div>
        </>
    );
}
