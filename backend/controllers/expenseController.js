const Expense = require('../models/Expense');

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
    const { title, category, amount, date, note } = req.body;

    const expense = new Expense({
        title,
        category,
        amount,
        date: date || Date.now(),
        note,
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({}).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
const deleteExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
        await expense.deleteOne();
        res.json({ message: 'Expense removed' });
    } else {
        res.status(404).json({ message: 'Expense not found' });
    }
};

module.exports = { addExpense, getExpenses, deleteExpense };
