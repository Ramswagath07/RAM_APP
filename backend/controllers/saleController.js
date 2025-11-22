const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Create new sale (Bill)
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
    const { customerName, items, discount, paymentMethod } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: 'No items in sale' });
    }

    // Calculate totals and validate stock
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ message: `Product not found: ${item.name}` });
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
        }

        // Update stock
        product.stock -= item.quantity;
        await product.save();

        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;

        processedItems.push({
            product: product._id,
            name: product.name,
            quantity: item.quantity,
            price: item.price,
            total: itemTotal,
        });
    }

    const finalAmount = totalAmount - (discount || 0);

    const sale = new Sale({
        customerName,
        items: processedItems,
        totalAmount,
        discount,
        finalAmount,
        paymentMethod,
        createdBy: req.user._id,
    });

    const createdSale = await sale.save();
    res.status(201).json(createdSale);
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find({}).populate('createdBy', 'name').sort({ createdAt: -1 });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = async (req, res) => {
    const sale = await Sale.findById(req.params.id).populate('createdBy', 'name').populate('items.product', 'name category');

    if (sale) {
        res.json(sale);
    } else {
        res.status(404).json({ message: 'Sale not found' });
    }
};

module.exports = { createSale, getSales, getSaleById };
