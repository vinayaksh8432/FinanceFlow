import CardA from "./cardA";
import CardB from "./cardB";

export default function Cards() {
    return (
        <>
            <div className="flex flex-col justify-between w-1/2 border border-gray-200 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between">
                    <h1>My Card</h1>
                    <button className="text-gray-500">+ Add Card</button>
                </div>
                <div className="flex gap-4">
                    <CardA />
                    <CardB />
                </div>
            </div>
        </>
    );
}
