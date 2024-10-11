import CompanyName from "./companyName";
import Menu from "./menu";
import Profile from "./profile";

export default function Sidebar() {
    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <CompanyName />
                <Menu />
            </div>
            <Profile />
        </div>
    );
}
