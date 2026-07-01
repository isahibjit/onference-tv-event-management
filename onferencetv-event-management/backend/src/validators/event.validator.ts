import { z } from 'zod';

export const eventSchema = z.object({
  eventName: z.string().trim().min(1, 'Event Name is required'),
  eventDate: z.string().or(z.date()).refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, { message: 'Invalid event date' }),
  speakerName: z.string().trim().min(1, 'Speaker Name is required'),
  speakerDesignation: z.string().trim().min(1, 'Speaker Designation is required'),
});

export type EventInput = z.infer<typeof eventSchema>;
