export type RoomStatus = 'available' | 'occupied';

export type RoomApiResponse = {
  capacity: number;
  id: number;
  name: string;
  occupied: number;
  priority: number;
};

export type Room = {
  capacity: number;
  id: number;
  occupied: number;
  priority: number;
  roomNumber: string;
  status: RoomStatus;
};

export type MaintenanceRequestPayload = {
  description: string;
  issue: string;
  room: string;
};

export type LeaveRequestInput = {
  fromDate: string;
  reason: string;
  toDate: string;
};

export type LeaveRequestPayload = {
  from_date: string;
  reason: string;
  to_date: string;
};

export type ApiMessageResponse = {
  detail?: string;
  message?: string;
  [key: string]: unknown;
};
