const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const Purchase = require('./models/Purchase');
const Expense = require('./models/Expense');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Sale.deleteMany();
        await Purchase.deleteMany();
        await Expense.deleteMany();

        // Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const users = await User.insertMany([
            { name: 'Balaji Owner', email: 'admin@balaji.com', password: hashedPassword, role: 'admin' }, // Hashed manually or via pre-save if creating instances. insertMany skips pre-save validation/middleware in some versions, but let's assume we need to hash. Actually, insertMany DOES NOT trigger pre('save'). So I hashed it above. Wait, I need to hash it properly.
            { name: 'Staff Member', email: 'staff@balaji.com', password: hashedPassword, role: 'staff' }
        ]);

        console.log('Users Seeded');

        // Products
        const products = await Product.insertMany([
            { name: 'PVC Pipe 4 inch', category: 'Pipe', brand: 'Supreme', unit: 'meter', costPrice: 150, sellingPrice: 200, stock: 100, minStock: 20 },
            { name: 'Water Motor 1HP', category: 'Motor', brand: 'Crompton', unit: 'piece', costPrice: 3500, sellingPrice: 4500, stock: 10, minStock: 2 },
            { name: 'Submersible Pump 1.5HP', category: 'Submersible Pump', brand: 'Texmo', unit: 'piece', costPrice: 8000, sellingPrice: 10500, stock: 5, minStock: 1 },
            { name: 'LED Bulb 9W', category: 'Electrical Item', brand: 'Philips', unit: 'piece', costPrice: 60, sellingPrice: 100, stock: 200, minStock: 50 },
            { name: 'Copper Wire 1mm', category: 'Electrical Item', brand: 'Finolex', unit: 'bundle', costPrice: 800, sellingPrice: 1200, stock: 30, minStock: 5 },
            { name: 'Ball Bearing 6204', category: 'Spare Part', brand: 'SKF', unit: 'piece', costPrice: 120, sellingPrice: 250, stock: 50, minStock: 10 },
        ]);

        console.log('Products Seeded');

        // Expenses
        await Expense.insertMany([
            { title: 'Shop Rent', category: 'Rent', amount: 5000, date: new Date(), note: 'Monthly rent' },
            { title: 'Tea & Snacks', category: 'Miscellaneous', amount: 150, date: new Date(), note: 'Daily tea' },
        ]);

        console.log('Expenses Seeded');

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error Seeding Data:', error);
        process.exit(1);
    }
};

seedData();
