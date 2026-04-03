import { apiClient } from './client';
import type { Room, RoomApiResponse, RoomStatus } from '../types/api';

function getRoomStatus(room: RoomApiResponse): RoomStatus {
  return room.occupied >= room.capacity ? 'occupied' : 'available';
}

function mapRoom(room: RoomApiResponse): Room {
  return {
    id: room.id,
    roomNumber: room.name,
    capacity: room.capacity,
    occupied: room.occupied,
    priority: room.priority,
    status: getRoomStatus(room),
  };
}

export async function fetchRooms(): Promise<Room[]> {
  const response = await apiClient.get<RoomApiResponse[]>('/api/rooms/');
  return response.data.map(mapRoom);
}
