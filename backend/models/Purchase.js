const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    supplierName: { type: String },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        costPrice: { type: Number, required: true }, // Cost price at time of purchase
        total: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
