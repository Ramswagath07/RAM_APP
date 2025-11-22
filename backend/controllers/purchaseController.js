const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

// @desc    Add new purchase
// @route   POST /api/purchases
// @access  Private/Admin
const addPurchase = async (req, res) => {
    const { supplierName, items, totalAmount, date } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: 'No items in purchase' });
    }

    const processedItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ message: `Product not found: ${item.name}` });
        }

        // Update stock
        product.stock += item.quantity;
        // Optional: Update cost price if needed, but let's keep it simple or maybe weighted average?
        // For now, just update stock.
        await product.save();

        processedItems.push({
            product: product._id,
            quantity: item.quantity,
            costPrice: item.costPrice,
            total: item.quantity * item.costPrice,
        });
    }

    const purchase = new Purchase({
        supplierName,
        items: processedItems,
        totalAmount,
        date: date || Date.now(),
    });

    const createdPurchase = await purchase.save();
    res.status(201).json(createdPurchase);
};

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private/Admin
const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({}).populate('items.product', 'name').sort({ date: -1 });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addPurchase, getPurchases };
