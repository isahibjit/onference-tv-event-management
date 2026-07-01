import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { EventResponse, EventInput } from '../features/events/eventSchemas';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' }),
  tagTypes: ['Event', 'Settings', 'AiHistory', 'PdfExport'],
  endpoints: (builder) => ({
    getEvents: builder.query<{ data: EventResponse[] }, void>({
      query: () => '/events',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Event' as const, id })),
              { type: 'Event', id: 'LIST' },
            ]
          : [{ type: 'Event', id: 'LIST' }],
    }),
    getEventById: builder.query<{ data: EventResponse }, string>({
      query: (id) => `/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation<{ data: EventResponse }, EventInput>({
      query: (newEvent) => ({
        url: '/events',
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    updateEvent: builder.mutation<{ data: EventResponse }, { id: string; data: EventInput }>({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),
    deleteEvent: builder.mutation<{ data: null }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),
    generateContent: builder.mutation<{ data: EventResponse }, string>({
      query: (id) => ({
        url: `/events/${id}/generate-content`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGenerateContentMutation,
} = apiSlice;
