const HealthInsurance = {
    items: [
        {
            itemId: "Aditya Birla Health Insurance",
            image: "assets/abgh.svg",
            name: "Aditya Birla Group Health Plan",
            type: "Group",
            price: "8182",
            coverage: "500000",
            details: {
                1: "Coverage even with Asthama, Blood Pressure, Cholestrol and Diabetes",
                2: "Covers pre and post hospitalization for 30 & 60 days respectively",
                3: "Covers 527 daycare procedures",
            },
        },
        {
            itemId: "Bajaj Allianz General Insurance",
            image: "assets/bajaj.svg",
            name: "Bajaj Allianz Health Guard Insurance Plan",
            type: "Retail",
            price: "6962",
            coverage: "500000",
            details: {
                1: "3 plan variants to choose from - Silver, Gold & Platinum",
                2: "Modern treatment methods covered",
                3: "Plan variants cover - Bariatric surgery, Maternity benefits, organ donor expenses and more",
            },
        },
    ],
};

module.exports = { HealthInsurance };
