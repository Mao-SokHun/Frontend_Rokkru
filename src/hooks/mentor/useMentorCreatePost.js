import { useCallback, useState, useMemo } from 'react'
import { isApiEnabled } from '@/constants'
import { publishTeacherSessionSlot } from '@/services/mentors/mentorScheduleService'
import {
  createMentorPost,
  fetchMentorCatalog,
  fetchMentorSkills,
  buildSkillOptions,
  buildSubSkillOptions,
  resolveProvinceId,
  resolveSkillSubSkillFromMentorSkills,
} from '@/services/mentors/mentorService'
import { resolveMentorProfile } from '@/lib/mentorProfile'
import {
  buildPostScheduleDescription,
  formatTimeRange,
  isValidTimeRange,
} from '@/utils/timeRangeUtils'

/** Controller — mentor create post (catalog + publish) */
export function useMentorCreatePost(user) {
  const [metaLoading, setMetaLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [provinceOptions, setProvinceOptions] = useState([])
  const [skillsCatalog, setSkillsCatalog] = useState([])

  const loadMeta = useCallback(
    (view, onMetaLoaded) => {
      if (view !== 'schedule' || !isApiEnabled()) return () => {}

      let cancelled = false
      setMetaLoading(true)

      Promise.all([
        fetchMentorCatalog(),
        user?.id ? fetchMentorSkills(user.id).catch(() => []) : Promise.resolve([]),
      ])
        .then(([{ skills, provinces }, mentorSkills]) => {
          if (cancelled) return
          const catalog = skills ?? []
          setProvinceOptions(provinces ?? [])
          setSkillsCatalog(catalog)
          const profile = resolveMentorProfile(user)
          const defaultProvinceId = resolveProvinceId(profile.province, provinces)
          const resolved = resolveSkillSubSkillFromMentorSkills(mentorSkills, catalog)
          onMetaLoaded?.({
            defaultProvinceId: defaultProvinceId != null ? String(defaultProvinceId) : '',
            skillId: resolved.skillId ?? '',
            subSkillId: resolved.subSkillId ?? '',
          })
        })
        .catch(() => {
          if (!cancelled) {
            setProvinceOptions([])
            setSkillsCatalog([])
          }
        })
        .finally(() => {
          if (!cancelled) setMetaLoading(false)
        })

      return () => {
        cancelled = true
      }
    },
    [user]
  )

  const publishSchedule = useCallback(
    async ({ subject, provinceId, subSkillId, date, startTime, endTime, notes, t }) => {
      setPublishing(true)
      try {
        if (isApiEnabled()) {
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

          await createMentorPost(user?.id, {
            title: subject.trim(),
            description: description || undefined,
            province_id: pid,
            sub_skill_id: sid,
            status: 'published',
          })
        } else {
          await publishTeacherSessionSlot({
            userId: user?.id,
            subject,
            date,
            time: formatTimeRange(startTime, endTime),
            notes,
          })
        }
        return { ok: true }
      } catch (err) {
        return { ok: false, error: err?.message || t('mentorSchedule.publishFailed') }
      } finally {
        setPublishing(false)
      }
    },
    [user?.id]
  )

  return {
    metaLoading,
    publishing,
    provinceOptions,
    skillsCatalog,
    loadMeta,
    publishSchedule,
    provinceSelectOptions: (lang) =>
      provinceOptions.map((p) => ({
        value: String(p.province_id ?? p.id),
        label: p.province_name ?? p.name ?? '',
      })),
    majorSelectOptions: (lang, selectedSkillId) =>
      buildSkillOptions(skillsCatalog, lang).map((o) => ({
        value: String(o.value),
        label: o.label,
      })),
    subjectSelectOptions: (lang, selectedSkillId) =>
      buildSubSkillOptions(skillsCatalog, selectedSkillId, lang).map((o) => ({
        value: String(o.value),
        label: o.label,
      })),
  }
}

export default useMentorCreatePost
