const loanTypes = [
    {
        id: "personal",
        name: "Personal Loan",
        description: "For your personal needs",
        maxAmount: 1000000,
        interestRate: "10.99%",
    },
    {
        id: "home",
        name: "Home Loan",
        description: "Make your dream home a reality",
        maxAmount: 5000000,
        interestRate: "7.50%",
    },
    {
        id: "car",
        name: "Car Loan",
        description: "Drive your dream car today",
        maxAmount: 1500000,
        interestRate: "8.75%",
    },
    {
        id: "education",
        name: "Education Loan",
        description: "Invest in your future",
        maxAmount: 2000000,
        interestRate: "6.50%",
    },
    {
        id: "business",
        name: "Business Loan",
        description: "Grow your business",
        maxAmount: 3000000,
        interestRate: "11.50%",
    },
];

module.exports = { loanTypes };
