const { Pinecone } = require('@pinecone-database/pinecone');
const { embedText } = require('./ai.service');

const pineconeApiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX_NAME;

let pineconeClient;
let pineconeIndex;

function ensureConfigured() {
  if (!pineconeApiKey) {
    throw new Error('Missing PINECONE_API_KEY environment variable.');
  }

  if (!indexName) {
    throw new Error('Missing PINECONE_INDEX_NAME environment variable.');
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: pineconeApiKey,
    });
  }

  if (!pineconeIndex) {
    pineconeIndex = pineconeClient.index(indexName);
  }

  return pineconeIndex;
}

function buildTransactionText(transaction) {
  const amount = Number(transaction.amount || 0).toFixed(2);
  const date = new Date(
    transaction.date || transaction.createdAt || Date.now()
  )
    .toISOString()
    .split('T')[0];

  return `Transaction summary:
- Type: ${transaction.type}
- Amount: Rs. ${amount}
- Date: ${date}
- Description: ${transaction.description || 'No description provided'}
- Favorite: ${transaction.favorite ? 'Yes' : 'No'}`;
}

function formatMetadata(transaction) {
  return {
    transactionId: transaction._id.toString(),
    userId: transaction.user.toString(),
    amount: Number(transaction.amount || 0),
    type: transaction.type,
    description: transaction.description || '',
    date: new Date(
      transaction.date || transaction.createdAt || Date.now()
    ).toISOString(),
    favorite: Boolean(transaction.favorite),
    createdAt: transaction.createdAt
      ? new Date(transaction.createdAt).toISOString()
      : undefined,
    updatedAt: transaction.updatedAt
      ? new Date(transaction.updatedAt).toISOString()
      : undefined,
  };
}

async function upsertTransactionVector(transaction) {
  const index = ensureConfigured();
  const text = buildTransactionText(transaction);
  const embedding = await embedText(text);

  await index.namespace(transaction.user.toString()).upsert([
    {
      id: transaction._id.toString(),
      values: embedding,
      metadata: formatMetadata(transaction),
    },
  ]);
}

async function deleteTransactionVector(userId, transactionId) {
  const index = ensureConfigured();
  await index
    .namespace(userId.toString())
    .deleteMany([transactionId.toString()]);
}

async function querySimilarTransactions(userId, question, topK = 5) {
  const index = ensureConfigured();
  const embedding = await embedText(question);

  const response = await index.namespace(userId.toString()).query({
    topK,
    vector: embedding,
    includeMetadata: true,
  });

  return response.matches || [];
}

module.exports = {
  upsertTransactionVector,
  deleteTransactionVector,
  querySimilarTransactions,
};
