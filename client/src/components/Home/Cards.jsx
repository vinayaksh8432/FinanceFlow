export default function Cards() {
    const total = [
        {
            id: 1,
            name: "Total Balance",
            balance: 5000,
            backgroundColor: "bg-green-500",
        },
        {
            id: 2,
            name: "Total Income",
            income: 10000,
            backgroundColor: "bg-green-500",
        },
        {
            id: 3,
            name: "Total Expenses",
            expenses: 5000,
            backgroundColor: "bg-red-500",
        },
    ];

    return (
        <>
            <div className="flex gap-4">
                {total.map((items) => (
                    <div
                        key={items.id}
                        className="flex-1 p-4 bg-white rounded-xl shadow-md"
                    >
                        <h1>{items.name}</h1>
                        <h2>
                            {items.balance || items.income || items.expenses}
                        </h2>
                    </div>
                ))}
            </div>
        </>
    );
}
