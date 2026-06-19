import { useCallback, useEffect, useState } from 'react'
import {
  getTeacherWeeklySchedule,
  saveTeacherWeeklySchedule,
} from '@/services/mentors/mentorScheduleService'
import { deleteMentorPost, fetchMyMentorPosts } from '@/services/mentors/mentorService'
import { parsePostScheduleMeta } from '@/utils/mentorPostMapper'
import { compareTimeSortKeys } from '@/utils/timeRangeUtils'
import { provinceRowLabel } from '@/utils/provinceOptions'
import { isApiEnabled } from '@/constants'

const sortPostRows = (rows = []) =>
  [...rows].sort((a, b) => {
    const dateCmp = String(a.session_date ?? a.date ?? '').localeCompare(
      String(b.session_date ?? b.date ?? '')
    )
    if (dateCmp !== 0) return dateCmp
    return compareTimeSortKeys(a.timeSortKey, b.timeSortKey)
  })

function mapPostRows(rows = [], lang) {
  return rows.map((post) => {
    const meta = parsePostScheduleMeta(post.description)
    const provinceRow = post.Province ?? post.province ?? null
    return {
      id: post.post_id ?? post.id,
      subject: post.title,
      session_date: meta.date,
      time_slot: meta.time,
      date: meta.date,
      time: meta.time,
      timeSortKey: meta.sortKey,
      status: post.status,
      province: provinceRow?.province_name ? provinceRowLabel(provinceRow, lang) : '',
    }
  })
}

const mapAndSortPostRows = (rows, lang) => sortPostRows(mapPostRows(rows, lang))

/** Controller — mentor schedule page (weekly + published posts) */
export function useMentorSchedule(user, updateUser, lang, t) {
  const [schedule, setSchedule] = useState(() => getTeacherWeeklySchedule(user))
  const [published, setPublished] = useState([])
  const [drafts, setDrafts] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [savedOk, setSavedOk] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    setSchedule(getTeacherWeeklySchedule(user))
  }, [user?.schedule])

  const loadPosts = useCallback(() => {
    if (!user?.id || !isApiEnabled()) {
      setLoadingSessions(false)
      return
    }
    setLoadingSessions(true)
    Promise.all([
      fetchMyMentorPosts({ status: 'published' }),
      fetchMyMentorPosts({ status: 'draft' }),
    ])
      .then(([publishedRows, draftRows]) => {
        setPublished(mapAndSortPostRows(publishedRows, lang))
        setDrafts(mapAndSortPostRows(draftRows, lang))
      })
      .catch(() => {
        setPublished([])
        setDrafts([])
      })
      .finally(() => setLoadingSessions(false))
  }, [user?.id, lang])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const deletePost = useCallback(
    async (postId) => {
      if (!postId || !window.confirm(t('mentorSchedule.deletePost') + '?')) return
      setDeletingId(postId)
      try {
        await deleteMentorPost(postId)
        loadPosts()
      } catch (err) {
        setSaveError(err?.message || t('mentorSchedule.publishFailed'))
      } finally {
        setDeletingId(null)
      }
    },
    [loadPosts, t]
  )

  const saveWeekly = useCallback(async () => {
    setSaveError('')
    setSavedOk(false)
    setSaving(true)
    try {
      await saveTeacherWeeklySchedule(schedule)
      updateUser({ schedule })
      setSavedOk(true)
    } catch (err) {
      setSaveError(err?.message || t('profile.saveFailed'))
    } finally {
      setSaving(false)
    }
  }, [schedule, updateUser, t])

  return {
    schedule,
    setSchedule,
    published,
    drafts,
    loadingSessions,
    saving,
    saveError,
    savedOk,
    deletingId,
    deletePost,
    saveWeekly,
  }
}

export default useMentorSchedule
