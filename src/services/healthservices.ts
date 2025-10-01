import { apiRequest } from './api';
import type {
  APIResponse,
  EmergencyInfo,
//   InterviewQuestion,
  InterviewQuestionsRequest,
} from './types';

export const healthService = {
  /**
   * Get emergency contact information
   */
  getEmergencyInfo: async (): Promise<APIResponse<EmergencyInfo>> => {
    return apiRequest<APIResponse<EmergencyInfo>>('/health/emergency-info', {
      method: 'GET',
    });
  },

  /**
   * Get health interview questions
   */
  getInterviewQuestions: async (
    condition: string = 'general'
  ): Promise<APIResponse<{ questions: string[] }>> => {
    return apiRequest<APIResponse<{ questions: string[] }>>(
      '/health/interview-questions',
      {
        method: 'POST',
        body: JSON.stringify({ condition } as InterviewQuestionsRequest),
      }
    );
  },
};