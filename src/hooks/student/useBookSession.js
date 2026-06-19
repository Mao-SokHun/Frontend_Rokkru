import { useState, useCallback } from 'react'
import { bookSession } from '@/services/students/studentBookingService'

/** Controller — book session confirmation */
export function useBookSession() {
  const [booking, setBooking] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  const confirmBooking = useCallback(async (payload, { onError } = {}) => {
    setBooking(true)
    setBookingError(null)
    try {
      const result = await bookSession(payload)
      setConfirmedBooking(result)
      return { ok: true, booking: result }
    } catch (err) {
      const message = err?.message || onError?.()
      setBookingError(message)
      return { ok: false, error: message }
    } finally {
      setBooking(false)
    }
  }, [])

  return {
    booking,
    bookingError,
    confirmedBooking,
    confirmBooking,
    setBookingError,
  }
}

export default useBookSession
