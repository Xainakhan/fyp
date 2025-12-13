import { apiRequest } from "./api";

export const RAG_ENDPOINT = "/nlp/rag-answer";

export interface RagAnswerResponse {
  success: boolean;
  answer: string;
  question: string;
}

export const askRag = async (question: string): Promise<RagAnswerResponse> => {
  return apiRequest<RagAnswerResponse>(RAG_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
};
