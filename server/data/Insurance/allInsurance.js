const { HealthInsurance } = require("./healthInsurance");
const { CarInsurance } = require("./carInsurance");
const { TwoWheelInsurance } = require("./twoWheelInsurance");
const { LifeInsurance } = require("./lifeInsurance");

const allInsurance = [
    {
        category: "Health",
        items: HealthInsurance.items,
    },
    {
        category: "Car",
        items: CarInsurance.items,
    },
    {
        category: "TwoWheeler",
        items: TwoWheelInsurance.items,
    },
    {
        category: "Life",
        items: LifeInsurance.items,
    },
];

module.exports = {
    HealthInsurance,
    CarInsurance,
    TwoWheelInsurance,
    allInsurance,
};
