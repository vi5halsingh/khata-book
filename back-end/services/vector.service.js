import { Pinecone } from '@pinecone-database/pinecone';
import { text } from 'express';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});
const indexName ="khatabot";
const index = pc.index(indexName);

async function generateTextToEmbeddings(vectors){


    const results = await index.searchRecords({
      query:{
        topK:5,
        inputs:{text:vectors}
      }
    })
    return results;

}

module.exports = {generateTextToEmbeddings}