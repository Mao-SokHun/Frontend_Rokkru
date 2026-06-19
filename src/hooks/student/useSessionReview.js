import { useMemo, useState, useCallback } from 'react'
import { getBookingById } from '@/services/students/studentBookingService'
import { submitSessionReview } from '@/services/students/studentReviewService'

/** Controller — session review form */
export function useSessionReview(sessionId) {
  const booking = useMemo(() => getBookingById(sessionId), [sessionId])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const submitReview = useCallback(
    async (payload) => {
      if (!sessionId) return { ok: false }
      setSubmitting(true)
      setSubmitError(null)
      try {
        await submitSessionReview(sessionId, payload)
        setSubmitted(true)
        return { ok: true }
      } catch (err) {
        const message = err?.message || 'Could not submit review.'
        setSubmitError(message)
        return { ok: false, error: message }
      } finally {
        setSubmitting(false)
      }
    },
    [sessionId]
  )

  return {
    booking,
    mentor: {
      name: booking?.mentorName ?? '',
      title: '',
      subject: booking?.topicLabel ?? booking?.topic ?? '',
      date: booking?.sessionDate ?? '',
      duration: booking?.durationMinutes ? `${booking.durationMinutes} min` : '',
    },
    submitting,
    submitError,
    submitted,
    submitReview,
  }
}

export default useSessionReview
