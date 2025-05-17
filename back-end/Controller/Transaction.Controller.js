const Transaction = require('../Models/Transaction.Model');

const TransactionController = {
    // Create a new transaction
    createTransaction: async (req, res) => {
        try {
            const { amount, description, type } = req.body;
            
            // Validate input
            if (!amount || !description || !type) {
                return res.status(400).json({ msg: 'Please provide all required fields' });
            }
            
            // Create new transaction
            const newTransaction = new Transaction({
                user: req.user._id,
                amount,
                description,
                type,
                favorite: req.body.favorite || false
            });
            
            // Save transaction
            await newTransaction.save();
            
            res.status(201).json({
                success: true,
                data: newTransaction,
                msg: 'Transaction added successfully'
            });
        } catch (error) {
            console.error('Create transaction error:', error);
            return res.status(500).json({ msg: error.message });
        }
    },
    
    // Get all transactions for a user
    getTransactions: async (req, res) => {
        try {
            const { type, startDate, endDate, sort } = req.query;
            let query = { user: req.user._id };
            
            // Filter by type if provided
            if (type && ['income', 'expense'].includes(type)) {
                query.type = type;
            }
            
            // Filter by date range if provided
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            } else if (startDate) {
                query.date = { $gte: new Date(startDate) };
            } else if (endDate) {
                query.date = { $lte: new Date(endDate) };
            }
            
            // Set up sorting
            const sortOptions = {};
            if (sort === 'newest') {
                sortOptions.date = -1;
            } else if (sort === 'oldest') {
                sortOptions.date = 1;
            } else if (sort === 'amount-high') {
                sortOptions.amount = -1;
            } else if (sort === 'amount-low') {
                sortOptions.amount = 1;
            } else {
                // Default sort by newest
                sortOptions.date = -1;
            }
            
            const transactions = await Transaction.find(query)
                .sort(sortOptions);
            
            res.json({
                success: true,
                count: transactions.length,
                data: transactions
            });
        } catch (error) {
            console.error('Get transactions error:', error);
            return res.status(500).json({ msg: error.message });
        }
    },
    
    // Get a single transaction
    getTransaction: async (req, res) => {
        try {
            const transaction = await Transaction.findById(req.params.id);
            
            if (!transaction) {
                return res.status(404).json({ msg: 'Transaction not found' });
            }
            
            // Check if transaction belongs to user
            if (transaction.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ msg: 'Not authorized to access this transaction' });
            }
            
            res.json({
                success: true,
                data: transaction
            });
        } catch (error) {
            console.error('Get transaction error:', error);
            return res.status(500).json({ msg: error.message });
        }
    },
    
    // Update a transaction
    updateTransaction: async (req, res) => {
        try {
            const { amount, description, type, favorite } = req.body;
            
            // Find transaction
            let transaction = await Transaction.findById(req.params.id);
            
            if (!transaction) {
                return res.status(404).json({ msg: 'Transaction not found' });
            }
            
            // Check if transaction belongs to user
            if (transaction.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ msg: 'Not authorized to update this transaction' });
            }
            
            // Update fields
            if (amount !== undefined) transaction.amount = amount;
            if (description !== undefined) transaction.description = description;
            if (type !== undefined) transaction.type = type;
            if (favorite !== undefined) transaction.favorite = favorite;
            
            // Save updated transaction
            await transaction.save();
            
            res.json({
                success: true,
                data: transaction,
                msg: 'Transaction updated successfully'
            });
        } catch (error) {
            console.error('Update transaction error:', error);
            return res.status(500).json({ msg: error.message });
        }
    },
    
    // Delete a transaction
    deleteTransaction: async (req, res) => {
        try {
            const transaction = await Transaction.findById(req.params.id);
            
            if (!transaction) {
                return res.status(404).json({ msg: 'Transaction not found' });
            }
            
            // Check if transaction belongs to user
            if (transaction.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ msg: 'Not authorized to delete this transaction' });
            }
            
            await Transaction.deleteOne({ _id: req.params.id });
            
            res.json({
                success: true,
                msg: 'Transaction deleted successfully'
            });
        } catch (error) {
            console.error('Delete transaction error:', error);
            return res.status(500).json({ msg: error.message });
        }
    },
    
    // Get transaction summary (total income, expense, balance)
    getTransactionSummary: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            let dateFilter = {};
            
            // Filter by date range if provided
            if (startDate && endDate) {
                dateFilter = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            } else if (startDate) {
                dateFilter = { $gte: new Date(startDate) };
            } else if (endDate) {
                dateFilter = { $lte: new Date(endDate) };
            }
            
            // Base query with user ID
            const baseQuery = { user: req.user._id };
            
            // Add date filter if exists
            if (Object.keys(dateFilter).length > 0) {
                baseQuery.date = dateFilter;
            }
            
            // Get total income
            const incomeQuery = { ...baseQuery, type: 'income' };
            const incomeTotal = await Transaction.aggregate([
                { $match: incomeQuery },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            
            // Get total expense
            const expenseQuery = { ...baseQuery, type: 'expense' };
            const expenseTotal = await Transaction.aggregate([
                { $match: expenseQuery },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            
            // Calculate balance
            const income = incomeTotal.length > 0 ? incomeTotal[0].total : 0;
            const expense = expenseTotal.length > 0 ? expenseTotal[0].total : 0;
            const balance = income - expense;
            
            res.json({
                success: true,
                data: {
                    income,
                    expense,
                    balance
                }
            });
        } catch (error) {
            console.error('Get transaction summary error:', error);
            return res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = TransactionController;