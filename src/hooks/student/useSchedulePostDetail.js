import { useEffect, useState } from 'react'
import { isApiEnabled } from '@/constants'
import { fetchSchedulePostDetail } from '@/services/mentors/mentorService'
import { mapPostToScheduleDetail } from '@/utils/schedulePostDetailUtils'

/** Controller — schedule post detail page */
export function useSchedulePostDetail(postId, { t, lang }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!postId) {
      setLoading(false)
      setError(true)
      return
    }

    if (!isApiEnabled()) {
      setLoading(false)
      setError(true)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)

    fetchSchedulePostDetail(postId)
      .then((result) => {
        if (cancelled) return
        if (!result?.post) {
          setError(true)
          setDetail(null)
          return
        }
        const mapped = mapPostToScheduleDetail(result.post, {
          t,
          mentor: result.mentor,
          lang,
        })
        if (!mapped?.mentor) {
          setError(true)
          setDetail(null)
        } else {
          setDetail(mapped)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setDetail(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [postId, t, lang])

  return { detail, loading, error }
}

export default useSchedulePostDetail
