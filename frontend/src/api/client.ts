import axios from 'axios';

type ErrorResponse = {
  detail?: string;
  message?: string;
};

function isErrorResponse(value: unknown): value is ErrorResponse {
  return typeof value === 'object' && value !== null;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as unknown;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (
      isErrorResponse(responseData) &&
      typeof responseData.detail === 'string' &&
      responseData.detail.trim()
    ) {
      return responseData.detail;
    }

    if (
      isErrorResponse(responseData) &&
      typeof responseData.message === 'string' &&
      responseData.message.trim()
    ) {
      return responseData.message;
    }

    if (error.response) {
      return `Request failed with status ${error.response.status}.`;
    }

    if (error.request) {
      return 'Backend did not respond. Make sure the API server is running.';
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'Something went wrong while contacting the backend.';
}
