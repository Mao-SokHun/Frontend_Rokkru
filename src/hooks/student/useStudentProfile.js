import { useEffect, useState } from 'react'
import { isApiEnabled } from '@/constants'
import { fetchProvinces } from '@/services/mentors/mentorService'

/** Controller — student profile view (province labels) */
export function useStudentProfile() {
  const [provinces, setProvinces] = useState([])

  useEffect(() => {
    if (!isApiEnabled()) return
    let cancelled = false
    fetchProvinces()
      .then((rows) => {
        if (!cancelled) setProvinces(Array.isArray(rows) ? rows : [])
      })
      .catch(() => {
        if (!cancelled) setProvinces([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { provinces }
}

export default useStudentProfile
