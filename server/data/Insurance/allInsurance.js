const { HealthInsurance } = require("./healthInsurance");
const { CarInsurance } = require("./carInsurance");

const allInsurance = [
    {
        category: "Health",
        items: HealthInsurance.items,
    },
    {
        category: "Car",
        items: CarInsurance.items,
    },
];

module.exports = { HealthInsurance, CarInsurance, allInsurance };
