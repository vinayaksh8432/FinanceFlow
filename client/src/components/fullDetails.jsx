import Balance from "../card/balance";
import Cards from "../card/cards";
import CreditScore from "../card/creditScore";

export default function FullDetails() {
    return (
        <>
            <div className="grid gap-6 bg-white p-6 shadow-sm">
                <Balance />
                <Cards />
                <CreditScore />
            </div>
        </>
    );
}
