import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { PageScaffold, PageCard, PageAmbient } from '@/components'
import { useTranslation } from '@/i18n'
import { useMentorEditPost } from '@/hooks'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import TimeRangeInput from '@/components/ui/TimeRangeInput'
import SearchableSelect from '@/components/ui/SearchableSelect'
import { CatalogSearchSelect } from '@/components'
import { normalizeTimeValue } from '@/utils/timeRangeUtils'

const MentorEditPost = () => {
  const { postId } = useParams()
  const { t, lang } = useTranslation()
  const navigate = useNavigate()

  const {
    loading,
    loadError,
    saved,
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
    subSkillOptions,
    provinceSelectOptions,
    timeRangeError,
    savePost,
  } = useMentorEditPost(postId, { t, lang })

  if (!postId) return <Navigate to="/mentor/home" replace />

  if (loading) {
    return (
      <PageAmbient variant="mentor">
        <p className="text-sm text-slate-500 py-12 text-center">{t('student.loadingMentors')}</p>
      </PageAmbient>
    )
  }

  if (loadError) {
    return (
      <PageAmbient variant="mentor">
        <div className="max-w-lg mx-auto py-16 text-center space-y-3">
          <p className="text-sm text-slate-600">{loadError}</p>
          <Link
            to="/mentor/home"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('mentorSchedule.viewMySchedule')}
          </Link>
        </div>
      </PageAmbient>
    )
  }

  return (
    <PageAmbient variant="mentor" className="space-y-6">
      <PageScaffold title={t('mentorSchedule.editPostTitle')} subtitle={t('mentorSchedule.editPostSubtitle')}>
        <Link
          to="/mentor/schedule"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('mentorSchedule.viewMySchedule')}
        </Link>

        {saved ? (
          <PageCard className="max-w-xl text-center py-10">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-bold text-slate-800 mb-2">{t('mentorSchedule.editSaved')}</h3>
            <p className="text-sm text-slate-500 mb-6">{t('mentorSchedule.editSavedHint')}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button type="button" variant="primary" onClick={() => navigate('/mentor/home')}>
                {t('mentorSchedule.viewMySchedule')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/schedule/post/${postId}`)}
              >
                {t('mentorSchedule.previewPost')}
              </Button>
            </div>
          </PageCard>
        ) : (
          <PageCard className="max-w-xl">
            <form onSubmit={savePost} className="space-y-4">
              <Input
                label={t('mentorCreate.subject')}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('mentorCreate.subjectPlaceholder')}
                required
              />
              <SearchableSelect
                label={t('filters.location')}
                size="sm"
                placement="bottom"
                value={provinceId}
                onChange={setProvinceId}
                options={provinceSelectOptions}
                placeholder={t('filters.location')}
                menuMinWidth={240}
                disabled={provinceSelectOptions.length === 0}
              />
              <CatalogSearchSelect
                label={t('filters.subject')}
                size="sm"
                placement="bottom"
                value={subSkillId}
                onChange={setSubSkillId}
                options={subSkillOptions.map((o) => ({
                  value: String(o.value),
                  label: o.label,
                }))}
                placeholder={t('filters.subject')}
                menuMinWidth={280}
                disabled={subSkillOptions.length === 0}
              />
              <Input
                label={t('mentorCreate.date')}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <TimeRangeInput
                label={t('mentorCreate.timeSlot')}
                startTime={startTime}
                endTime={endTime}
                onChange={({ startTime: s, endTime: e }) => {
                  setStartTime(normalizeTimeValue(s))
                  setEndTime(normalizeTimeValue(e))
                }}
                error={timeRangeError}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('mentorCreate.notes')}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('mentorCreate.notesPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="primary" size="md" disabled={saving}>
                  {saving ? t('profile.saving') : t('mentorSchedule.saveChanges')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => navigate(`/schedule/post/${postId}`)}
                >
                  {t('mentorSchedule.previewPost')}
                </Button>
              </div>
            </form>
          </PageCard>
        )}
      </PageScaffold>
    </PageAmbient>
  )
}

export default MentorEditPost
