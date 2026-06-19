import { useCallback, useEffect, useMemo, useState } from 'react'
import { isApiEnabled } from '@/constants'
import { getStoredUser } from '@/lib/authStorage'
import {
  fetchMyMentorAnalytics,
  fetchMyMentorPosts,
  fetchMyMentorProfile,
} from '@/services/mentors/mentorService'
import { getLocalDetailViewCount } from '@/utils/mentorViewTracking'
import {
  DEFAULT_ANALYTICS_FILTERS,
  buildStatusFilterOptions,
  buildSubjectFilterOptions,
  computeFilteredPostStats,
  postMatchesStatus,
  postMatchesSubject,
} from '@/utils/analyticsFilterUtils'
import {
  REPORT_PERIOD_MONTH,
  REPORT_PERIOD_WEEK,
  REPORT_PERIOD_YEAR,
  filterPostsByReportPeriod,
  formatReportPeriodLabel,
} from '@/utils/analyticsReportUtils'
import { mapPostsToSessionRows } from '@/utils/mentorDetailUtils'
import { buildProfileViewsTrend, buildWeeklyPostsTrend } from '@/utils/mentorDashboardInsights'

/** Controller — mentor analytics / reports page */
export function useMentorAnalytics({ t, lang }) {
  const [mentorStats, setMentorStats] = useState(null)
  const [mentorPosts, setMentorPosts] = useState([])
  const [mentorRow, setMentorRow] = useState(null)
  const [statsLoading, setStatsLoading] = useState(isApiEnabled())
  const [loadError, setLoadError] = useState('')
  const [sessionPage, setSessionPage] = useState(1)

  const [filters, setFilters] = useState(DEFAULT_ANALYTICS_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_ANALYTICS_FILTERS)
  const [reportPeriod, setReportPeriod] = useState(REPORT_PERIOD_WEEK)
  const [reportAnchor, setReportAnchor] = useState(() => new Date())

  const loadData = useCallback(() => {
    if (!isApiEnabled()) {
      setStatsLoading(false)
      return
    }
    setStatsLoading(true)
    setLoadError('')

    return Promise.all([
      fetchMyMentorAnalytics(),
      fetchMyMentorPosts(),
      fetchMyMentorProfile().catch(() => null),
    ])
      .then(([analytics, posts, profile]) => {
        setMentorStats(analytics)
        setMentorPosts(posts ?? [])
        setMentorRow(profile ?? null)
      })
      .catch((err) => {
        setMentorStats(null)
        setMentorPosts([])
        setMentorRow(null)
        setLoadError(err?.message || t('analytics.loadFailed'))
      })
      .finally(() => {
        setStatsLoading(false)
      })
  }, [t])

  useEffect(() => {
    let cancelled = false
    if (!isApiEnabled()) {
      setStatsLoading(false)
      return
    }
    setLoadError('')
    Promise.all([
      fetchMyMentorAnalytics(),
      fetchMyMentorPosts(),
      fetchMyMentorProfile().catch(() => null),
    ])
      .then(([analytics, posts, profile]) => {
        if (cancelled) return
        setMentorStats(analytics)
        setMentorPosts(posts ?? [])
        setMentorRow(profile ?? null)
      })
      .catch((err) => {
        if (!cancelled) {
          setMentorStats(null)
          setMentorPosts([])
          setMentorRow(null)
          setLoadError(err?.message || t('analytics.loadFailed'))
        }
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [t])

  const subjectOptions = useMemo(
    () => buildSubjectFilterOptions(mentorPosts, t('analytics.allSubjects'), lang),
    [mentorPosts, t, lang]
  )

  const statusOptions = useMemo(
    () =>
      buildStatusFilterOptions(mentorPosts, {
        allLabel: t('analytics.allStatus'),
        activeLabel: t('analytics.statusActive'),
        pendingLabel: t('analytics.statusPending'),
        cancelledLabel: t('analytics.statusCancelled'),
      }),
    [mentorPosts, t]
  )

  const calendarPosts = useMemo(
    () =>
      mentorPosts.filter(
        (post) =>
          postMatchesSubject(post, appliedFilters.subject, lang) &&
          postMatchesStatus(post, appliedFilters.status)
      ),
    [mentorPosts, appliedFilters.subject, appliedFilters.status, lang]
  )

  const periodPosts = useMemo(
    () => filterPostsByReportPeriod(calendarPosts, reportPeriod, reportAnchor),
    [calendarPosts, reportPeriod, reportAnchor]
  )

  const periodLabel = useMemo(
    () => formatReportPeriodLabel(reportPeriod, reportAnchor, lang),
    [reportPeriod, reportAnchor, lang]
  )

  const reportTitle = useMemo(() => {
    if (reportPeriod === REPORT_PERIOD_MONTH) return t('analytics.monthlyReport')
    if (reportPeriod === REPORT_PERIOD_YEAR) return t('analytics.yearlyReport')
    return t('analytics.weeklyReport')
  }, [reportPeriod, t])

  const filteredStats = useMemo(() => computeFilteredPostStats(periodPosts), [periodPosts])

  const detailViewCount = useMemo(() => {
    if (isApiEnabled()) {
      return mentorStats?.profile_views ?? 0
    }
    const userId = getStoredUser()?.id
    return userId ? getLocalDetailViewCount(userId) : 0
  }, [mentorStats?.profile_views])

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...filters })
    setSessionPage(1)
  }, [filters])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_ANALYTICS_FILTERS)
    setAppliedFilters(DEFAULT_ANALYTICS_FILTERS)
    setSessionPage(1)
  }, [])

  const filteredSessionRows = useMemo(
    () =>
      mapPostsToSessionRows(periodPosts, {
        lang,
        onlineLabel: t('mentorCard.onlineClass'),
      }),
    [periodPosts, lang, t]
  )

  const postsTrend = useMemo(() => buildWeeklyPostsTrend(periodPosts, lang), [periodPosts, lang])
  const viewsTrend = useMemo(() => buildProfileViewsTrend(mentorStats, lang), [mentorStats, lang])

  return {
    mentorStats,
    mentorPosts,
    mentorRow,
    statsLoading,
    loadError,
    sessionPage,
    setSessionPage,
    filters,
    setFilters,
    appliedFilters,
    reportPeriod,
    setReportPeriod,
    reportAnchor,
    setReportAnchor,
    retryLoad: loadData,
    subjectOptions,
    statusOptions,
    calendarPosts,
    periodPosts,
    periodLabel,
    reportTitle,
    filteredStats,
    detailViewCount,
    applyFilters,
    resetFilters,
    filteredSessionRows,
    postsTrend,
    viewsTrend,
    REPORT_PERIOD_MONTH,
    REPORT_PERIOD_WEEK,
    REPORT_PERIOD_YEAR,
  }
}

export default useMentorAnalytics
