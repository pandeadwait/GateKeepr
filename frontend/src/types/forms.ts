import { z } from 'zod';

export const maintenanceRequestSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters long.'),
  issue: z.string().trim().min(3, 'Issue must be at least 3 characters long.'),
  room: z.string().trim().min(1, 'Room is required.'),
});

export type MaintenanceRequestFormValues = z.infer<typeof maintenanceRequestSchema>;

export const leaveRequestSchema = z
  .object({
    fromDate: z.string().min(1, 'From date is required.'),
    reason: z
      .string()
      .trim()
      .min(10, 'Reason must be at least 10 characters long.'),
    toDate: z.string().min(1, 'To date is required.'),
  })
  .refine((values) => values.toDate >= values.fromDate, {
    message: 'To date must be the same day or later than from date.',
    path: ['toDate'],
  });

export type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>;
