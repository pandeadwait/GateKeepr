import { apiClient } from './client';
import type {
  ApiMessageResponse,
  LeaveRequestInput,
  LeaveRequestPayload,
  MaintenanceRequestPayload,
} from '../types/api';

export async function submitMaintenanceRequest(
  payload: MaintenanceRequestPayload,
): Promise<ApiMessageResponse> {
  const response = await apiClient.post<ApiMessageResponse>('/api/maintenance', payload);
  return response.data;
}

export async function submitLeaveRequest(
  input: LeaveRequestInput,
): Promise<ApiMessageResponse> {
  const payload: LeaveRequestPayload = {
    from_date: input.fromDate,
    to_date: input.toDate,
    reason: input.reason,
  };

  const response = await apiClient.post<ApiMessageResponse>('/api/leave-request', payload);
  return response.data;
}
