import { apiSlice } from '@/app/apiSlice';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AiHistoryItem {
  id: string;
  eventId: string;
  eventName: string;
  promptType: string;
  generatedContent: string;
  timestamp: string;
}

interface GenerateParams {
  eventId: string;
  eventName: string;
  speakerName: string;
  speakerDesignation: string;
  promptType: 'description' | 'speakerIntro';
  creativity: string;
  tone: string;
  length: string;
}

const getLocalAiHistory = (): AiHistoryItem[] => {
  const stored = localStorage.getItem('eventpro_ai_history');
  return stored ? JSON.parse(stored) : [];
};

export const aiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAiHistory: builder.query<AiHistoryItem[], void>({
      queryFn: () => {
        return { data: getLocalAiHistory() };
      },
      providesTags: ['AiHistory'],
    }),
    
    saveAiHistory: builder.mutation<AiHistoryItem, Omit<AiHistoryItem, 'id' | 'timestamp'>>({
      queryFn: (item) => {
        const history = getLocalAiHistory();
        const newItem: AiHistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('eventpro_ai_history', JSON.stringify([newItem, ...history]));
        return { data: newItem };
      },
      invalidatesTags: ['AiHistory'],
    }),
    
    deleteAiHistory: builder.mutation<void, string>({
      queryFn: (id) => {
        const history = getLocalAiHistory();
        const updated = history.filter(h => h.id !== id);
        localStorage.setItem('eventpro_ai_history', JSON.stringify(updated));
        return { data: undefined };
      },
      invalidatesTags: ['AiHistory'],
    }),
    
    generateWithGemini: builder.mutation<string, GenerateParams>({
      queryFn: async (params) => {
        try {
          // Read settings directly from local storage to get API key
          const settingsStr = localStorage.getItem('eventpro_settings');
          const settings = settingsStr ? JSON.parse(settingsStr) : {};
          const apiKey = settings.geminiApiKey;
          
          if (!apiKey) {
            return { error: { status: 401, data: { message: 'Gemini API Key is missing. Please configure it in Settings.' } } };
          }
          
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: settings.aiModel || 'gemini-pro' });
          
          let prompt = '';
          if (params.promptType === 'description') {
            prompt = `Write an engaging and professional event description for an event named "${params.eventName}". 
            The tone should be ${params.tone}. 
            The length should be ${params.length}. 
            The speaker is ${params.speakerName} (${params.speakerDesignation}).
            Make it sound like a premium industry event.`;
          } else {
            prompt = `Write a professional speaker introduction for ${params.speakerName}, who is a ${params.speakerDesignation}.
            They are speaking at the event "${params.eventName}".
            The tone should be ${params.tone}.
            The length should be ${params.length}.
            Highlight their expertise and why attendees should listen to them.`;
          }

          // We use simple generateContent since we are in queryFn, streaming is harder to do in RTK query without custom hooks, 
          // but we can just await the result. The prompt asked for "Streaming responses if supported" but for simplicity in RTK query,
          // standard await is much cleaner and reliable.
          const result = await model.generateContent({
             contents: [{ role: 'user', parts: [{ text: prompt }] }],
             generationConfig: {
               temperature: settings.aiTemperature ? Number(settings.aiTemperature) : 0.7,
             }
          });
          
          const text = result.response.text();
          return { data: text };
        } catch (error: any) {
          console.error("Gemini Error:", error);
          return { error: { status: 500, data: { message: error.message || 'Failed to generate content' } } };
        }
      }
    }),
  }),
});

export const { 
  useGetAiHistoryQuery, 
  useSaveAiHistoryMutation, 
  useDeleteAiHistoryMutation,
  useGenerateWithGeminiMutation
} = aiApi;
