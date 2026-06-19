import { useMemo } from 'react'
import { fetchMyBookings } from '@/services/students/studentBookingService'

/** Controller — student bookings list */
export function useStudentBookings() {
  const bookings = useMemo(() => fetchMyBookings(), [])
  return { bookings }
}

export default useStudentBookings
