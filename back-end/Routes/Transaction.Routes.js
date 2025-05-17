const express = require('express');
const router = express.Router();
const TransactionController = require('../Controller/Transaction.Controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all transaction routes
router.use(authMiddleware);

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', TransactionController.createTransaction);

// @route   GET /api/transactions
// @desc    Get all transactions for a user (with optional filtering)
// @access  Private
router.get('/', TransactionController.getTransactions);

// @route   GET /api/transactions/summary
// @desc    Get transaction summary (total income, expense, balance)
// @access  Private
router.get('/summary', TransactionController.getTransactionSummary);

// @route   GET /api/transactions/:id
// @desc    Get a single transaction
// @access  Private
router.get('/:id', TransactionController.getTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', TransactionController.updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;