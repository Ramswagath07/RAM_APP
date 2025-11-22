const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    customerName: { type: String },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Selling price at time of sale
        total: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
