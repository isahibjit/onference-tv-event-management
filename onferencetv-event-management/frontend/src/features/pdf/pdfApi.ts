import { apiSlice } from '@/app/apiSlice';

export interface PdfExportItem {
  id: string;
  eventId: string;
  eventName: string;
  generatedBy: string;
  fileSize: string;
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: string;
}

const getLocalPdfHistory = (): PdfExportItem[] => {
  const stored = localStorage.getItem('eventpro_pdf_history');
  return stored ? JSON.parse(stored) : [];
};

export const pdfApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPdfHistory: builder.query<PdfExportItem[], void>({
      queryFn: () => {
        return { data: getLocalPdfHistory() };
      },
      providesTags: ['PdfExport'],
    }),
    
    savePdfExport: builder.mutation<PdfExportItem, Omit<PdfExportItem, 'id' | 'timestamp'>>({
      queryFn: (item) => {
        const history = getLocalPdfHistory();
        const newItem: PdfExportItem = {
          ...item,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('eventpro_pdf_history', JSON.stringify([newItem, ...history]));
        return { data: newItem };
      },
      invalidatesTags: ['PdfExport'],
    }),
    
    deletePdfExport: builder.mutation<void, string>({
      queryFn: (id) => {
        const history = getLocalPdfHistory();
        const updated = history.filter(h => h.id !== id);
        localStorage.setItem('eventpro_pdf_history', JSON.stringify(updated));
        return { data: undefined };
      },
      invalidatesTags: ['PdfExport'],
    }),
  }),
});

export const { 
  useGetPdfHistoryQuery, 
  useSavePdfExportMutation, 
  useDeletePdfExportMutation
} = pdfApi;
