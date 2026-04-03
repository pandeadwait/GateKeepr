import type { Room } from '../types/api';

type RoomCardProps = {
  room: Room;
};

const statusStyles = {
  available: {
    badge: 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
  },
  occupied: {
    badge: 'bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200',
    border: 'border-rose-200',
    accent: 'bg-rose-500',
  },
} as const;

export function RoomCard({ room }: RoomCardProps) {
  const styles = statusStyles[room.status];

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${styles.border}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 ${styles.accent}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
            Room
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{room.roomNumber}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles.badge}`}>
          {room.status}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Capacity</dt>
          <dd className="mt-2 text-lg font-semibold text-slate-900">{room.capacity}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Occupied</dt>
          <dd className="mt-2 text-lg font-semibold text-slate-900">{room.occupied}</dd>
        </div>
      </dl>
    </article>
  );
}
