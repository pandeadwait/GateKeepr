import { useEffect, useState } from 'react'

import { createBooking, deleteBooking, getRooms, updateRoomStatus } from '../services/api.js'

const STATUS_VARIANTS = {
  available: 'available',
  occupied: 'occupied',
  maintenance: 'maintenance',
  partially_booked: 'occupied',
  partially_occupied: 'occupied',
}

function normalizeStatus(status) {
  if (!status) {
    return 'available'
  }

  return STATUS_VARIANTS[status.toLowerCase()] ?? 'available'
}

function buildBookingPayload(roomId, userId) {
  if (!userId || !userId.trim()) {
    throw new Error('User ID is required to book a room.')
  }

  // TODO: tighten client-side numeric validation once the booking dialog is upgraded.
  return {
    user_id: Number(userId),
    room_id: roomId,
    status: 'active',
    check_in_date: new Date().toISOString(),
  }
}

function RoomCard({ room, onBook, onRelease, onMaintenance, busy }) {
  const tone = normalizeStatus(room.status)
  const isAvailable = tone === 'available'
  const hasActiveBooking = typeof room.active_booking_id === 'number'

  return (
    <article className={`room-card room-card--${tone}`}>
      <div className="room-card__head">
        <div>
          <p className="room-card__eyebrow">Block {room.block}</p>
          <h3>{room.room_number}</h3>
        </div>
        <span className="room-card__status">{room.status}</span>
      </div>

      <dl className="room-card__meta">
        <div>
          <dt>Floor</dt>
          <dd>{room.floor_number}</dd>
        </div>
        <div>
          <dt>Capacity</dt>
          <dd>{room.capacity}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{room.room_type}</dd>
        </div>
        <div>
          <dt>Active</dt>
          <dd>{room.active_booking_count ?? 0}</dd>
        </div>
      </dl>

      <div className="room-card__actions">
        <button type="button" onClick={() => onBook(room)} disabled={busy || !isAvailable}>
          Book Room
        </button>
        <button type="button" onClick={() => onRelease(room)} disabled={busy || !hasActiveBooking}>
          Release Room
        </button>
        <button type="button" onClick={() => onMaintenance(room)} disabled={busy}>
          Mark Maintenance
        </button>
      </div>
    </article>
  )
}

function RoomGrid() {
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadRooms() {
    setIsLoading(true)
    setError('')

    try {
      const data = await getRooms()
      setRooms(data)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadRooms()
    }, 15000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  async function handleBook(room) {
    setActionId(room.id)
    setError('')
    setNotice('')

    try {
      const userId = window.prompt(`Enter the user ID to book room ${room.room_number}:`)
      const payload = buildBookingPayload(room.id, userId)
      await createBooking(payload)
      setNotice(`Room ${room.room_number} booked successfully.`)
      await loadRooms()
    } catch (actionError) {
      setError(actionError.message)
    } finally {
      setActionId(null)
    }
  }

  async function handleRelease(room) {
    setActionId(room.id)
    setError('')
    setNotice('')

    try {
      if (typeof room.active_booking_id !== 'number') {
        throw new Error(`Room ${room.room_number} does not have an active booking to release.`)
      }

      await deleteBooking(room.active_booking_id)
      setNotice(`Room ${room.room_number} released successfully.`)
      await loadRooms()
    } catch (actionError) {
      setError(actionError.message)
    } finally {
      setActionId(null)
    }
  }

  async function handleMaintenance(room) {
    setActionId(room.id)
    setError('')
    setNotice('')

    try {
      await updateRoomStatus(room.id, 'maintenance')
      setNotice(`Room ${room.room_number} marked for maintenance.`)
      await loadRooms()
    } catch (actionError) {
      setError(actionError.message)
    } finally {
      setActionId(null)
    }
  }

  return (
    <section className="room-grid-shell">
      <header className="room-grid-shell__header">
        <div>
          <p className="room-grid-shell__eyebrow">Centralized Room Allocation</p>
          <h1>PVR Room Grid</h1>
          <p className="room-grid-shell__copy">
            Live room states are loaded from the backend API. Use the room cards to
            book, release, or mark maintenance. The grid refreshes automatically.
          </p>
        </div>

        <div className="room-grid-shell__legend">
          <span className="legend-chip legend-chip--available">Available</span>
          <span className="legend-chip legend-chip--occupied">Occupied</span>
          <span className="legend-chip legend-chip--maintenance">Maintenance</span>
        </div>
      </header>

      <div className="toolbar">
        <button type="button" onClick={loadRooms} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh Grid'}
        </button>
      </div>

      {error ? <p className="feedback feedback--error">{error}</p> : null}
      {notice ? <p className="feedback feedback--notice">{notice}</p> : null}

      {isLoading ? (
        <div className="empty-state">Loading rooms from backend...</div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">No rooms were returned by the backend.</div>
      ) : (
        <div className="room-grid">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBook={handleBook}
              onRelease={handleRelease}
              onMaintenance={handleMaintenance}
              busy={actionId === room.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default RoomGrid
