const {GoogleGenAI } = require("@google/genai")

const ai =new GoogleGenAI({})

async function getGeminiResponse(query){
    const  response = await ai.models.embedContent({
        model:"gemini-embedding-001",
        contents:query,
        taskType: 'SEMANTIC_SIMILARITY',
        outputDimensionality: 768,
    })
    const embededAnswer = response.embeddings?.[0];
    return embededAnswer;
}
module.exports = {getGeminiResponse}