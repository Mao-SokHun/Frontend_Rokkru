import { Bell, Settings, Check } from 'lucide-react'
import { useAuth, useNotificationInbox } from '@/hooks'
import { PageScaffold, PageCard, TabBar, NotificationItem, PageAmbient } from '@/components'
import { useTranslation } from '@/i18n'

const Notifications = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const FILTER_TABS = [
    { id: 'all', label: t('notifications.all') },
    { id: 'unread', label: t('notifications.unread') },
    { id: 'important', label: t('notifications.important') },
  ]

  const {
    displayed,
    loading,
    filter,
    setFilter,
    unread,
    markAllRead,
    dismiss,
    markRead,
  } = useNotificationInbox()

  return (
    <PageAmbient variant="notifications">
      <PageScaffold
        title={t('notifications.title')}
        subtitle={
          loading
            ? t('student.loadingMentors')
            : unread > 0
              ? t('notifications.unreadSubtitle').replace('{{count}}', unread)
              : t('notifications.caughtUp').replace('{{name}}', firstName)
        }
        action={
          unread > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              {t('notifications.markAllRead')}
            </button>
          ) : null
        }
      >
        <PageCard padding={false} className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary-500" />
              <span className="font-semibold text-slate-800 text-sm">{t('notifications.inbox')}</span>
              {unread > 0 && (
                <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 bg-primary-500 text-white text-xs font-bold rounded-full">
                  {unread}
                </span>
              )}
            </div>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50">
            <TabBar tabs={FILTER_TABS} active={filter} onChange={setFilter} />
          </div>

          {loading ? (
            <div className="text-center py-16 px-5 text-sm text-slate-500">{t('student.loadingMentors')}</div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-16 px-5">
              <Bell className="w-10 h-10 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">{t('notifications.empty')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('notifications.emptyHint')}</p>
            </div>
          ) : (
            <div>
              {displayed.map((n) => (
                <NotificationItem
                  key={n.id}
                  icon={n.icon}
                  iconBg={n.iconBg}
                  title={n.title}
                  body={n.body}
                  time={n.time}
                  read={n.read}
                  primaryAction={n.primary}
                  onPrimary={() => markRead(n.id)}
                  onDismiss={() => dismiss(n.id)}
                />
              ))}
            </div>
          )}
        </PageCard>
      </PageScaffold>
    </PageAmbient>
  )
}

export default Notifications
