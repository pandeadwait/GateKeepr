import { useEffect } from 'react';
import { RoomCard } from '../components/RoomCard';
import { useRoomStore } from '../store/roomStore';

export function RoomGridPage() {
  const error = useRoomStore((state) => state.error);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);
  const hasLoaded = useRoomStore((state) => state.hasLoaded);
  const isLoading = useRoomStore((state) => state.isLoading);
  const rooms = useRoomStore((state) => state.rooms);

  useEffect(() => {
    if (!hasLoaded) {
      void fetchRooms();
    }
  }, [fetchRooms, hasLoaded]);

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Room Grid
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Live room availability
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Data is fetched from <code>GET /api/rooms/</code>. Room status is derived from
              capacity versus occupied beds, then displayed with clear availability colors.
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
            disabled={isLoading}
            onClick={() => {
              void fetchRooms();
            }}
            type="button"
          >
            {isLoading ? 'Refreshing...' : 'Refresh rooms'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading && rooms.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white/70"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && rooms.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center text-slate-600">
          No rooms were returned by the backend.
        </div>
      ) : null}

      {rooms.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
