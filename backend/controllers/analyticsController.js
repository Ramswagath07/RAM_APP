const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Expense = require('../models/Expense');
const Product = require('../models/Product');

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Stock Value
        const products = await Product.find({});
        const totalStockValue = products.reduce((acc, item) => acc + (item.stock * item.costPrice), 0);
        const lowStockProducts = products.filter(p => p.stock < p.minStock);

        // 2. Today's Sales & Profit
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todaySales = await Sale.find({
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        const todaySalesTotal = todaySales.reduce((acc, sale) => acc + sale.finalAmount, 0);

        // Calculate approximate profit for today (Sales - Cost of Goods Sold)
        // Note: This is an approximation. For exact FIFO/LIFO, we need more complex logic.
        // We'll use the current cost price of the product for simplicity as requested.
        let todayCostOfGoods = 0;
        for (const sale of todaySales) {
            for (const item of sale.items) {
                const product = products.find(p => p._id.toString() === item.product.toString());
                if (product) {
                    todayCostOfGoods += (item.quantity * product.costPrice); // Using current cost price
                }
            }
        }
        const todayProfit = todaySalesTotal - todayCostOfGoods;

        // 3. This Month's Expenses
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyExpenses = await Expense.find({
            date: { $gte: startOfMonth }
        });
        const monthlyExpenseTotal = monthlyExpenses.reduce((acc, exp) => acc + exp.amount, 0);

        res.json({
            totalStockValue,
            lowStockCount: lowStockProducts.length,
            lowStockProducts,
            todaySalesTotal,
            todayProfit,
            monthlyExpenseTotal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get charts data
// @route   GET /api/analytics/charts
// @access  Private
const getChartsData = async (req, res) => {
    try {
        // Monthly Sales vs Expenses (Last 6 months)
        // This is a simplified implementation. For production, use aggregation pipeline.
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const sales = await Sale.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$finalAmount" }
                }
            }
        ]);

        const expenses = await Expense.aggregate([
            { $match: { date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$date" },
                    totalExpenses: { $sum: "$amount" }
                }
            }
        ]);

        // Merge data
        const chartData = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const month = d.getMonth() + 1;
            const monthName = d.toLocaleString('default', { month: 'short' });

            const saleData = sales.find(s => s._id === month);
            const expenseData = expenses.find(e => e._id === month);

            chartData.unshift({
                name: monthName,
                Sales: saleData ? saleData.totalSales : 0,
                Expenses: expenseData ? expenseData.totalExpenses : 0,
            });
        }

        // Category Share (Pie Chart)
        // We need to aggregate sales by product category
        // Since Sale items store product ID, we need to lookup product category.
        // This is complex in aggregation if category isn't in Sale item.
        // Let's do it in JS for simplicity or use $lookup.
        const salesForCategory = await Sale.find({}).populate('items.product');
        const categoryMap = {};

        salesForCategory.forEach(sale => {
            sale.items.forEach(item => {
                if (item.product && item.product.category) {
                    if (!categoryMap[item.product.category]) {
                        categoryMap[item.product.category] = 0;
                    }
                    categoryMap[item.product.category] += item.total;
                }
            });
        });

        const pieChartData = Object.keys(categoryMap).map(key => ({
            name: key,
            value: categoryMap[key]
        }));

        res.json({
            barChartData: chartData,
            pieChartData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDashboardStats, getChartsData };
