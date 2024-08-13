import FullDetails from "../components/fullDetails";
import Overview from "../components/overview";
import Sidebar from "../components/sidebar";

export default function Dashbaord() {
    return (
        <>
            <div className="flex bg-gray-100 ">
                <Sidebar />
                <div className="h-full w-screen py-2 px-4">
                    <Overview />
                    <hr />
                    <FullDetails />
                </div>
            </div>
        </>
    );
}
