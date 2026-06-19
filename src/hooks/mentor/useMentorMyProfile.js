import { useEffect, useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { isApiEnabled } from '@/constants'
import { resolveMentorProfile } from '@/lib/mentorProfile'
import { mapPublishedPostsToProfileSlots } from '@/utils/mentorProfileScheduleUtils'
import { resolveProvinceCanonicalName } from '@/utils/provinceOptions'
import {
  fetchMyMentorProfileForUi,
  fetchMentorExperience,
  fetchMyMentorPosts,
  fetchMentorPortfolio,
  fetchProvinces,
} from '@/services/mentors/mentorService'

/** Controller — mentor own profile view */
export function useMentorMyProfile(user, lang = 'en') {
  const location = useLocation()
  const [profile, setProfile] = useState(() => resolveMentorProfile(user))
  const [experience, setExperience] = useState([])
  const [publishedPosts, setPublishedPosts] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(isApiEnabled())

  useEffect(() => {
    if (!isApiEnabled() || !user?.id) {
      setProfile(resolveMentorProfile(user))
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.allSettled([
      fetchMyMentorProfileForUi(user),
      fetchMentorExperience(user.id),
      fetchMyMentorPosts({ status: 'published' }),
      fetchMentorPortfolio(user.id),
      fetchProvinces(),
    ])
      .then(([mentorResult, experienceResult, postsResult, portfolioResult, provincesResult]) => {
        if (cancelled) return
        const provinces =
          provincesResult.status === 'fulfilled' ? provincesResult.value : []
        const baseProfile =
          mentorResult.status === 'fulfilled' ? mentorResult.value : resolveMentorProfile(user)
        const canonicalProvince = resolveProvinceCanonicalName(baseProfile.province, provinces)
        setProfile({
          ...baseProfile,
          province: canonicalProvince || baseProfile.province,
        })
        setExperience(experienceResult.status === 'fulfilled' ? experienceResult.value : [])
        setPublishedPosts(postsResult.status === 'fulfilled' ? postsResult.value : [])
        setPortfolio(portfolioResult.status === 'fulfilled' ? portfolioResult.value : [])
      })
      .catch(() => {
        if (!cancelled) {
          setProfile(resolveMentorProfile(user))
          setExperience([])
          setPublishedPosts([])
          setPortfolio([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.id, location.key])

  const publishedSlots = useMemo(
    () => mapPublishedPostsToProfileSlots(publishedPosts, lang),
    [publishedPosts, lang]
  )

  return { profile, experience, publishedPosts, portfolio, publishedSlots, loading }
}

export default useMentorMyProfile
