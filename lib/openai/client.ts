/**
 * OpenAI Client Configuration
 *
 * Singleton instance of the OpenAI client for making API requests.
 */

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

// Create singleton OpenAI client instance
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Vector Store IDs from environment
export const VECTOR_STORES = {
  GLOBAL: process.env.OPENAI_GLOBAL_VECTOR_STORE_ID!,
  BIG: process.env.OPENAI_BIG_VECTOR_STORE_ID!,
} as const;

// Validate vector store IDs
if (!VECTOR_STORES.GLOBAL) {
  console.warn("Warning: OPENAI_GLOBAL_VECTOR_STORE_ID is not set");
}

if (!VECTOR_STORES.BIG) {
  console.warn("Warning: OPENAI_BIG_VECTOR_STORE_ID is not set");
}
