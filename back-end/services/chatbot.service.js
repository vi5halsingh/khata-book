const mongoose = require('mongoose');
const Transaction = require('../Models/Transaction.Model');
const {
  querySimilarTransactions,
} = require('./vector.service');
const { generateChatResponse } = require('./ai.service');

const MAX_CONTEXT_TRANSACTIONS = 10;

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `Rs. ${amount.toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return 'Unknown date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return date.toISOString().split('T')[0];
}

function formatTransactionLine(transaction) {
  return `• ${transaction.type?.toUpperCase() || 'TRANSACTION'} | ${formatCurrency(
    transaction.amount
  )} | ${formatDate(transaction.date)} | ${
    transaction.description || 'No description provided'
  } | Favorite: ${transaction.favorite ? 'Yes' : 'No'}`;
}

async function getUserSummary(userId) {
  const matchUserId =
    typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

  const totals = await Transaction.aggregate([
    { $match: { user: matchUserId } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);

  const summary = { income: 0, expense: 0, balance: 0 };
  totals.forEach((record) => {
    if (record._id === 'income') {
      summary.income = Number(record.total || 0);
    }
    if (record._id === 'expense') {
      summary.expense = Number(record.total || 0);
    }
  });
  summary.balance = summary.income - summary.expense;
  return summary;
}

async function buildContext(userId, matches) {
  const lines = [];
  const references = [];

  const seen = new Set();

  matches.forEach((match) => {
    if (!match || !match.id || seen.has(match.id)) return;
    seen.add(match.id);
    if (!match?.metadata) return;
    const metadata = match.metadata;
    references.push({
      id: match.id,
      score: match.score,
      metadata,
    });
    lines.push(formatTransactionLine(metadata));
  });

  if (lines.length < 3) {
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(MAX_CONTEXT_TRANSACTIONS);

    recentTransactions.forEach((txn) => {
      lines.push(
        formatTransactionLine({
          ...txn.toObject(),
          user: undefined,
        })
      );
    });
  }

  const summary = await getUserSummary(userId);
  lines.push(
    `Summary totals -> Income: ${formatCurrency(
      summary.income
    )}, Expense: ${formatCurrency(summary.expense)}, Balance: ${formatCurrency(
      summary.balance
    )}`
  );

  return { context: lines.join('\n'), references };
}

async function handleUserMessage({ userId, message, history }) {
  const matches = await querySimilarTransactions(userId, message);
  const { context, references } = await buildContext(userId, matches);

  const answer = await generateChatResponse({
    question: message,
    context,
    history,
  });

  return {
    answer,
    references,
  };
}

module.exports = {
  handleUserMessage,
};

