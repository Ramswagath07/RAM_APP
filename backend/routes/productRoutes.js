const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProducts).post(protect, createProduct); // Allow staff to add products? Requirement says staff can add bills, update stock. Let's allow staff to create products too for now, or restrict to admin. Requirement says "Staff (limited access: add bills, update stock, but cannot change settings)". Usually adding products is an admin/manager task. I'll keep it open for now or restrict. Let's restrict create/update/delete to admin for better control, or maybe allow staff. Let's stick to Admin for Create/Delete.
// Actually, requirement says "Staff ... cannot change settings". It doesn't explicitly forbid adding products. But usually it's safer to restrict. I'll use 'protect' for all, and maybe 'admin' for delete.
// Let's use 'protect' for create/update, 'admin' for delete.

router
    .route('/:id')
    .get(protect, getProductById)
    .put(protect, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
