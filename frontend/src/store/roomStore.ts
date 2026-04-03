import { create } from 'zustand';
import { getApiErrorMessage } from '../api/client';
import { fetchRooms } from '../api/rooms';
import type { Room } from '../types/api';

type RoomStore = {
  error: string | null;
  fetchRooms: () => Promise<void>;
  hasLoaded: boolean;
  isLoading: boolean;
  rooms: Room[];
};

export const useRoomStore = create<RoomStore>((set) => ({
  error: null,
  fetchRooms: async () => {
    set({ error: null, isLoading: true });

    try {
      const rooms = await fetchRooms();
      set({ error: null, hasLoaded: true, isLoading: false, rooms });
    } catch (error) {
      set({
        error: getApiErrorMessage(error),
        hasLoaded: true,
        isLoading: false,
        rooms: [],
      });
    }
  },
  hasLoaded: false,
  isLoading: false,
  rooms: [],
}));
