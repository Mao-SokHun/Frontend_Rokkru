import { PageAmbient, MentorOwnProfileView } from '@/components'
import { useTranslation } from '@/i18n'
import { useAuth, useMentorMyProfile } from '@/hooks'

const MentorMyProfile = () => {
  const { t, lang } = useTranslation()
  const { user } = useAuth()
  const { profile, experience, portfolio, publishedSlots, loading } = useMentorMyProfile(user, lang)

  if (loading) {
    return (
      <PageAmbient variant="mentor">
        <div className="py-16 text-center text-slate-500">{t('student.loadingMentors')}</div>
      </PageAmbient>
    )
  }

  return (
    <PageAmbient variant="mentor">
      <MentorOwnProfileView
        profile={profile}
        experience={experience}
        publishedSlots={publishedSlots}
        portfolio={portfolio}
      />
    </PageAmbient>
  )
}

export default MentorMyProfile
