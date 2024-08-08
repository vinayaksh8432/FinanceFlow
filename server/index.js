const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const CustomerModel = require("./model/customer");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect("mongodb://127.0.0.1:27017/customer", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    CustomerModel.findOne({ email: email })
        .then((user) => {
            if (user) {
                if (user.password === password) res.json("success");
                else res.json("password is incorrect");
            } else res.json("no records exist");
        })
        .catch((err) => res.status(500).json("Internal server error"));
});

app.post("/signup", (req, res) => {
    CustomerModel.create(req.body)
        .then((customer) => res.json(customer))
        .catch((err) => res.status(500).json(err));
});

app.listen(3001, () => {
    console.log("server is currently running"); // Fixed URL
});
