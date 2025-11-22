const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // Pipe, Motor, Pump, Electrical, Spare Part
    brand: { type: String },
    unit: { type: String, required: true }, // meter, piece, set
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, default: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
