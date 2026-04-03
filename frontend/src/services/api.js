const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    })
  } catch (error) {
    throw new Error('Unable to reach the backend API. Make sure the backend server is running.')
  }

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request failed (${response.status}).`
    throw new Error(message)
  }

  return data
}

export function getRooms() {
  return request('/rooms')
}

export function createBooking(payload) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function deleteBooking(bookingId) {
  return request(`/bookings/${bookingId}`, {
    method: 'DELETE',
  })
}

export function updateRoomStatus(roomId, status) {
  return request(`/rooms/${roomId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}
