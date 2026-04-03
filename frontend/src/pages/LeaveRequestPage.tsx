import { useState } from 'react';
import type { Path } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { submitLeaveRequest } from '../api/requests';
import { getApiErrorMessage } from '../api/client';
import { FormField } from '../components/FormField';
import { leaveRequestSchema, type LeaveRequestFormValues } from '../types/forms';

function applyValidationErrors(
  error: z.ZodError<LeaveRequestFormValues>,
  setError: ReturnType<typeof useForm<LeaveRequestFormValues>>['setError'],
) {
  for (const issue of error.issues) {
    const fieldName = issue.path.join('.') as Path<LeaveRequestFormValues>;

    if (fieldName) {
      setError(fieldName, {
        type: 'manual',
        message: issue.message,
      });
    }
  }
}

export function LeaveRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<LeaveRequestFormValues>({
    defaultValues: {
      fromDate: '',
      reason: '',
      toDate: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearErrors();

    const parsedValues = leaveRequestSchema.safeParse(values);

    if (!parsedValues.success) {
      applyValidationErrors(parsedValues.error, setError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitLeaveRequest(parsedValues.data);
      toast.success(response.message ?? 'Leave request submitted.');
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
          Leave Request
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Submit a planned leave
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          This form sends a REST request to <code>/api/leave-request</code>. Validation
          happens in the browser before the request is sent.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField error={errors.fromDate?.message} htmlFor="fromDate" label="From date">
              <input
                id="fromDate"
                type="date"
                {...register('fromDate')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
              />
            </FormField>

            <FormField error={errors.toDate?.message} htmlFor="toDate" label="To date">
              <input
                id="toDate"
                type="date"
                {...register('toDate')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
              />
            </FormField>
          </div>

          <FormField
            error={errors.reason?.message}
            htmlFor="reason"
            hint="Tell the hostel office why you need to be away."
            label="Reason"
          >
            <textarea
              id="reason"
              rows={5}
              {...register('reason')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200"
              placeholder="Exam break, family function, medical visit..."
            />
          </FormField>

          <button
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Submitting...' : 'Submit leave request'}
          </button>
        </form>
      </div>

      <aside className="rounded-[2rem] border border-sky-100 bg-sky-50/80 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Before you submit</h3>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <li>Choose clear start and end dates.</li>
          <li>Explain the reason so the hostel office can review it faster.</li>
          <li>
            If the backend has not implemented <code>/api/leave-request</code> yet, the
            page will show the API error instead of pretending the request worked.
          </li>
        </ul>
      </aside>
    </section>
  );
}
