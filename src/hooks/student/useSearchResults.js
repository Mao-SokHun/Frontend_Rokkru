import { useEffect, useState } from 'react'
import { isApiEnabled } from '@/constants'
import { fetchPublishedSchedules } from '@/services/mentors/mentorService'
import { mapPostsToSearchResults } from '@/utils/mentorDetailUtils'

/** Controller — global search published posts */
export function useSearchResults(query, lang) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(isApiEnabled())

  useEffect(() => {
    if (!isApiEnabled()) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchPublishedSchedules({ status: 'published', limit: 100 })
      .then((rows) => {
        if (!cancelled) setPosts(mapPostsToSearchResults(rows, lang))
      })
      .catch(() => {
        if (!cancelled) setPosts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [query, lang])

  return { posts, loading }
}

export default useSearchResults
