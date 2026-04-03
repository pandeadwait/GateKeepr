import { useEffect, useState } from 'react';
import type { Path } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { getApiErrorMessage } from '../api/client';
import { submitMaintenanceRequest } from '../api/requests';
import { FormField } from '../components/FormField';
import { useRoomStore } from '../store/roomStore';
import {
  maintenanceRequestSchema,
  type MaintenanceRequestFormValues,
} from '../types/forms';

function applyValidationErrors(
  error: z.ZodError<MaintenanceRequestFormValues>,
  setError: ReturnType<typeof useForm<MaintenanceRequestFormValues>>['setError'],
) {
  for (const issue of error.issues) {
    const fieldName = issue.path.join('.') as Path<MaintenanceRequestFormValues>;

    if (fieldName) {
      setError(fieldName, {
        type: 'manual',
        message: issue.message,
      });
    }
  }
}

export function MaintenanceRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);
  const hasLoaded = useRoomStore((state) => state.hasLoaded);
  const isLoadingRooms = useRoomStore((state) => state.isLoading);
  const rooms = useRoomStore((state) => state.rooms);

  useEffect(() => {
    if (!hasLoaded) {
      void fetchRooms();
    }
  }, [fetchRooms, hasLoaded]);

  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<MaintenanceRequestFormValues>({
    defaultValues: {
      description: '',
      issue: '',
      room: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearErrors();

    const parsedValues = maintenanceRequestSchema.safeParse(values);

    if (!parsedValues.success) {
      applyValidationErrors(parsedValues.error, setError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitMaintenanceRequest(parsedValues.data);
      toast.success(response.message ?? 'Maintenance request submitted.');
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Maintenance
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Report a room issue
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          This request is posted to <code>/api/maintenance</code>. Rooms are suggested
          from the live <code>/api/rooms/</code> response instead of hardcoded values.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <FormField
            error={errors.room?.message}
            hint={isLoadingRooms ? 'Loading room suggestions...' : 'You can type or pick a room.'}
            htmlFor="room"
            label="Room"
          >
            <>
              <input
                id="room"
                list="room-suggestions"
                {...register('room')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                placeholder="A-101"
              />
              <datalist id="room-suggestions">
                {rooms.map((room) => (
                  <option key={room.id} value={room.roomNumber} />
                ))}
              </datalist>
            </>
          </FormField>

          <FormField error={errors.issue?.message} htmlFor="issue" label="Issue">
            <input
              id="issue"
              type="text"
              {...register('issue')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
              placeholder="Water leakage"
            />
          </FormField>

          <FormField
            error={errors.description?.message}
            htmlFor="description"
            hint="Add enough detail so maintenance can triage the issue."
            label="Description"
          >
            <textarea
              id="description"
              rows={5}
              {...register('description')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
              placeholder="Leak starts near the window during rainfall and the floor gets slippery."
            />
          </FormField>

          <button
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Submitting...' : 'Submit maintenance request'}
          </button>
        </form>
      </div>

      <aside className="rounded-[2rem] border border-amber-100 bg-amber-50/80 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">What this page is doing</h3>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <li>Loads rooms from the backend so the frontend never talks to data storage directly.</li>
          <li>Validates the form with React Hook Form and Zod before sending the request.</li>
          <li>Shows toast feedback for both success and backend/API errors.</li>
        </ul>
      </aside>
    </section>
  );
}
