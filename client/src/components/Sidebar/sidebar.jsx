import CompanyName from "./companyName";
import Menu from "./menu";
import Profile from "./profile";

export default function Sidebar({ setActiveSection }) {
    return (
        <>
            <div className="w-80 h-screen py-2 px-4 name flex flex-col justify-between">
                <div>
                    <CompanyName />
                    <Menu setActiveSection={setActiveSection} />
                </div>
                <Profile />
            </div>
        </>
    );
}
