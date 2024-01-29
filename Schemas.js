const mongoose = require("mongoose");

const toolsSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    description: String,
    quantity: Number,
    unit: String,
});

module.exports = mongoose.model("products", toolsSchema);  