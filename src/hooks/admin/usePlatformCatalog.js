import { useEffect, useState, useMemo } from 'react'
import { fetchAdminCatalog } from '@/services/admin/adminApi'
import { skillRowLabel } from '@/services/mentors/mentorService'
import { provinceRowLabel } from '@/utils/provinceOptions'

/** Controller — admin platform catalog (skills + provinces) */
export function usePlatformCatalog(lang) {
  const [activeTab, setActiveTab] = useState('skills')
  const [catalog, setCatalog] = useState({ skills: [], provinces: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAdminCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const skillRows = useMemo(
    () =>
      catalog.skills.flatMap((skill) => {
        const subs = skill.SubSkills ?? skill.subSkills ?? skill.sub_skills ?? []
        if (!subs.length) {
          return [{
            id: skill.skill_id ?? skill.id,
            major: skillRowLabel(skill, lang),
            subject: '—',
            subCount: 0,
          }]
        }
        return subs.map((sub) => ({
          id: `${skill.skill_id ?? skill.id}-${sub.sub_skill_id ?? sub.id}`,
          major: skillRowLabel(skill, lang),
          subject: skillRowLabel(sub, lang),
          subCount: subs.length,
        }))
      }),
    [catalog.skills, lang]
  )

  const provinceRows = useMemo(
    () =>
      catalog.provinces.map((p) => ({
        id: p.province_id ?? p.id,
        name: provinceRowLabel(p, lang),
        code: p.province_code ?? p.code ?? '—',
      })),
    [catalog.provinces, lang]
  )

  const subSkillTotal = useMemo(
    () =>
      catalog.skills.reduce(
        (sum, s) => sum + (s.SubSkills ?? s.subSkills ?? s.sub_skills ?? []).length,
        0
      ),
    [catalog.skills]
  )

  return {
    activeTab,
    setActiveTab,
    catalog,
    loading,
    skillRows,
    provinceRows,
    subSkillTotal,
  }
}

export default usePlatformCatalog
