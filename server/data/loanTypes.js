const loanTypes = [
    {
        id: "personal",
        typeImage: "assets/personal.svg",
        name: "Personal",
        description:
            "Get a Personal Loan upto 12 lakhs in few easy steps with FinanceFlow",
        shortDescription: "For all your needs",
        interestRate: "8%",
        upto: "12 Lakhs",
        maxAmount: 1200000, // 12 lakhs
        allowedTenures: ["12 Months", "24 Months", "36 Months"],
    },
    {
        id: "home",
        typeImage: "assets/home.svg",
        name: "Home",
        description:
            "Get a Step Closer to your Dream Home with FinanceFlow Home Loan",
        shortDescription: "For your dream home",
        interestRate: "7.50%",
        upto: "3 Crore",
        maxAmount: 30000000, // 3 crores
        allowedTenures: [
            "12 Months",
            "24 Months",
            "36 Months",
            "48 Months",
            "60 Months",
        ],
    },
    {
        id: "car",
        typeImage: "assets/car.svg",
        name: "Car",
        description:
            "Drive your Dream Car with FinanceFlow Car Loan at best interest rate.",
        shortDescription: "For your dream car",
        interestRate: "8.75%",
        upto: "45 Lakh",
        maxAmount: 4500000, // 45 lakhs
        allowedTenures: [
            "12 Months",
            "24 Months",
            "36 Months",
            "48 Months",
            "60 Months",
        ],
    },
    {
        id: "education",
        typeImage: "assets/education.svg",
        name: "Education",
        description:
            "Give wings to your career with FinanceFlow Education Loan at best interest rate.",
        shortDescription: "For your bright future",
        interestRate: "6.50%",
        upto: "25 Lakhs",
        maxAmount: 2500000, // 25 lakhs
        allowedTenures: ["24 Months", "36 Months", "48 Months", "60 Months"],
    },
    {
        id: "gold",
        typeImage: "assets/gold.svg",
        name: "Gold",
        description:
            "Apply for Gold Loan with FinanceFlow and get the best interest rates",
        shortDescription: "For your urgent needs",
        interestRate: "11.50%",
        upto: "1 Crore",
        maxAmount: 10000000, // 1 crore
        allowedTenures: ["12 Months", "24 Months", "36 Months"],
    },
    {
        id: "business",
        typeImage: "assets/business.svg",
        name: "Business",
        description:
            "Grow your Business with FinanceFlow Business Loan at best interest rate",
        shortDescription: "For your business needs",
        interestRate: "9.75%",
        upto: "50 Lakhs",
        maxAmount: 5000000, // 50 lakhs
        allowedTenures: ["12 Months", "24 Months", "36 Months", "48 Months"],
    },
];

module.exports = { loanTypes };
