import { useCallback, useEffect, useMemo, useState } from 'react'
import { isApiEnabled } from '@/constants'
import {
  fetchAllSkills,
  fetchMentorPostById,
  fetchProvinces,
  flattenSubSkillOptions,
  updateMentorPost,
} from '@/services/mentors/mentorService'
import { provinceRowLabel } from '@/utils/provinceOptions'
import { postToScheduleFormValues } from '@/utils/mentorPostMapper'
import {
  buildPostScheduleDescription,
  isValidTimeRange,
} from '@/utils/timeRangeUtils'

/** Controller — edit mentor schedule post */
export function useMentorEditPost(postId, { t, lang }) {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [subject, setSubject] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('10:00')
  const [notes, setNotes] = useState('')
  const [provinceId, setProvinceId] = useState('')
  const [subSkillId, setSubSkillId] = useState('')
  const [provinceOptions, setProvinceOptions] = useState([])
  const [subSkillOptions, setSubSkillOptions] = useState([])

  const timeRangeError =
    startTime && endTime && !isValidTimeRange(startTime, endTime)
      ? t('mentorCreate.timeRangeInvalid')
      : ''

  const provinceSelectOptions = useMemo(
    () =>
      provinceOptions.map((p) => ({
        value: String(p.province_id ?? p.id),
        label: provinceRowLabel(p, lang),
      })),
    [provinceOptions, lang]
  )

  useEffect(() => {
    if (!postId || !isApiEnabled()) {
      setLoading(false)
      setLoadError(t('student.schedulePost.notFound'))
      return
    }

    let cancelled = false
    setLoading(true)
    setLoadError('')

    Promise.all([fetchMentorPostById(postId), fetchProvinces(), fetchAllSkills()])
      .then(([post, provinces, skills]) => {
        if (cancelled) return
        if (!post) {
          setLoadError(t('student.schedulePost.notFound'))
          return
        }

        const form = postToScheduleFormValues(post)
        if (!form) {
          setLoadError(t('student.schedulePost.notFound'))
          return
        }

        setSubject(form.subject)
        setDate(form.date)
        setStartTime(form.startTime)
        setEndTime(form.endTime)
        setNotes(form.notes)
        setProvinceId(form.provinceId)
        setSubSkillId(form.subSkillId)
        setProvinceOptions(provinces ?? [])
        setSubSkillOptions(flattenSubSkillOptions(skills ?? []))
      })
      .catch(() => {
        if (!cancelled) setLoadError(t('student.schedulePost.notFound'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [postId, t])

  const savePost = useCallback(
    async (e) => {
      e?.preventDefault?.()
      setError('')
      setSaving(true)

      try {
        const pid = parseInt(provinceId, 10)
        const sid = parseInt(subSkillId, 10)
        if (!subject.trim()) throw new Error(t('mentorCreate.subject'))
        if (Number.isNaN(pid)) throw new Error(t('filters.location'))
        if (Number.isNaN(sid)) throw new Error(t('filters.subject'))
        if (!startTime.trim()) throw new Error(t('mentorCreate.timeStartRequired'))
        if (!endTime.trim()) throw new Error(t('mentorCreate.timeEndRequired'))
        if (!isValidTimeRange(startTime, endTime)) {
          throw new Error(t('mentorCreate.timeRangeInvalid'))
        }

        const description = buildPostScheduleDescription({
          date,
          startTime,
          endTime,
          notes,
        })

        await updateMentorPost(postId, {
          title: subject.trim(),
          description: description || undefined,
          province_id: pid,
          sub_skill_id: sid,
        })

        setSaved(true)
        return { ok: true }
      } catch (err) {
        const message = err?.message || t('mentorSchedule.publishFailed')
        setError(message)
        return { ok: false, error: message }
      } finally {
        setSaving(false)
      }
    },
    [postId, subject, date, startTime, endTime, notes, provinceId, subSkillId, t]
  )

  return {
    loading,
    loadError,
    saved,
    setSaved,
    saving,
    error,
    subject,
    setSubject,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    notes,
    setNotes,
    provinceId,
    setProvinceId,
    subSkillId,
    setSubSkillId,
    provinceOptions,
    subSkillOptions,
    provinceSelectOptions,
    timeRangeError,
    savePost,
  }
}

export default useMentorEditPost
