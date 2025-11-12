const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const EMBEDDING_MODEL =
  process.env.GEMINI_EMBED_MODEL || 'text-embedding-004';
const CHAT_MODEL =
  process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';

if (!GEMINI_API_KEY) {
  console.warn(
    '[ai.service] Missing GEMINI_API_KEY. AI features will fail until it is configured.'
  );
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

function buildContent(text) {
  return [
    {
      role: 'user',
      parts: [{ text }],
    },
  ];
}

async function embedText(text) {
  if (!text || !text.trim()) {
    throw new Error('Text is required to generate embeddings.');
  }

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: [text],
  });

  const embedding = response.embeddings?.[0]?.values;
  if (!embedding || embedding.length === 0) {
    throw new Error('Failed to generate embedding from Gemini.');
  }

  return embedding;
}

async function generateChatResponse({ question, context, history = [] }) {
  if (!question || !question.trim()) {
    throw new Error('Question is required for chat response.');
  }

  const instruction = `You are KhataBook AI, a financial assistant that answers questions strictly using the provided transaction context.
Rules:
- Refer only to the data inside the context
- If the context does not contain an answer, say you do not have enough information
- Keep responses concise, factual, and focused on the user's finances`;

  const contextualPrompt = `${instruction}

Context:
${context || 'No transaction data was retrieved.'}

User question: ${question.trim()}`;

  const contents = [];

  if (Array.isArray(history) && history.length > 0) {
    history.forEach((message) => {
      if (!message?.text || !message?.role) return;
      contents.push({
        role: message.role,
        parts: [{ text: message.text }],
      });
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: contextualPrompt }],
  });

  let response;
  try {
    response = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents,
      config: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });
  } catch (error) {
    console.error('[ai.service] Gemini generateContent failed:', {
      message: error.message,
      status: error.status,
      cause: error.cause,
    });

    return `I ran into an issue talking to the AI service. Please try again in a moment.`;
  }

  const answer = extractTextFromResponse(response);
  if (answer) {
    return answer;
  }

  console.warn('[ai.service] Gemini returned an empty response payload.', {
    responseId: response?.responseId,
    promptFeedback: response?.promptFeedback,
  });

  return `I’m sorry, I couldn’t find enough information in your transactions to answer that. Try asking in a different way or add more transaction details.`;
}

function extractTextFromResponse(response) {
  if (!response) return '';

  if (typeof response.text === 'string' && response.text.trim()) {
    return response.text.trim();
  }

  const candidate = response.candidates?.find(
    (item) => item?.content?.parts && item.content.parts.length > 0
  );

  if (!candidate) return '';

  const textParts = candidate.content.parts
    .map((part) => {
      if (typeof part?.text === 'string') {
        return part.text.trim();
      }
      return '';
    })
    .filter(Boolean);

  return textParts.join('\n').trim();
}

module.exports = {
  embedText,
  generateChatResponse,
};