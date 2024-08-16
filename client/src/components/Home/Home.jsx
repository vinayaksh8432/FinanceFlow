import FullDetails from "./fullDetails";
import Overview from "./overview";
export default function Home() {
    return (
        <>
            <div className="h-full w-screen py-2 px-4">
                <Overview />
                <hr />
                <FullDetails />
            </div>
        </>
    );
}
