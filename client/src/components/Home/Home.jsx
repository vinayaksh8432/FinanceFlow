import InsuranceCard from "./InsuranceCard";
import LoanCard from "./LoanCard";

export default function Home() {
    return (
        <>
            <div className="space-y-4">
                <LoanCard />
                <InsuranceCard />
            </div>
        </>
    );
}
