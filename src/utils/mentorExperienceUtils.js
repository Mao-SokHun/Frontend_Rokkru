/** Experience row transforms (Model layer — no HTTP). */

export function mentorYearToPeriod(mentorYear) {
  if (!mentorYear) return ''
  const date = new Date(mentorYear)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const yearsAgo = new Date().getFullYear() - year

  if (yearsAgo >= 1 && yearsAgo <= 10) {
    return `${yearsAgo} years`
  }

  return String(year)
}

export function experienceRowToUi(row) {
  const dbId = row?.mentor_experience_id ?? row?.id ?? null
  const typeRaw = String(row?.experience_type ?? 'education').trim().toLowerCase()
  return {
    id: dbId ?? `tmp-${Date.now()}`,
    dbId,
    type: typeRaw === 'work' ? 'work' : 'education',
    role: String(row?.mentor_position ?? '').trim(),
    org: String(row?.mentor_organization ?? '').trim(),
    period: mentorYearToPeriod(row?.mentor_year),
  }
}

/** Split API rows into education (degree/school) vs work (job history). */
export function splitExperienceByType(rows = []) {
  const education = []
  const work = []
  for (const row of rows ?? []) {
    const uiRow = row?.dbId != null || row?.type != null ? row : experienceRowToUi(row)
    if (uiRow.type === 'work') work.push(uiRow)
    else education.push(uiRow)
  }
  return { education, work }
}
