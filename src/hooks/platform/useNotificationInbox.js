import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Bell,
  Calendar,
  BookOpen,
  FileText,
  BarChart2,
  Star,
  Gift,
} from 'lucide-react'
import {
  fetchNotifications,
  markAllNotificationsRead,
} from '@/services/platform/notificationService'

const ICON_BY_TYPE = {
  calendar: Calendar,
  session: BookOpen,
  material: FileText,
  quiz: BarChart2,
  review: Star,
  offer: Gift,
}

const ICON_BG_BY_TYPE = {
  calendar: 'bg-primary-100 text-primary-600',
  session: 'bg-sky-100 text-sky-600',
  material: 'bg-emerald-100 text-emerald-600',
  quiz: 'bg-amber-100 text-amber-600',
  review: 'bg-violet-100 text-violet-600',
  offer: 'bg-primary-50 text-primary-600',
}

function normalizeNotification(raw) {
  const type = raw.type || 'calendar'
  const Icon = ICON_BY_TYPE[type] || Bell
  return {
    id: String(raw.id ?? raw._id ?? ''),
    icon: Icon,
    iconBg: ICON_BG_BY_TYPE[type] || 'bg-slate-100 text-slate-600',
    title: raw.title ?? '',
    body: raw.body ?? raw.message ?? '',
    time: raw.time ?? raw.createdAt ?? '',
    read: Boolean(raw.read),
    important: Boolean(raw.important),
    primary: raw.primary ?? raw.primaryAction ?? null,
  }
}

/** Controller — notifications inbox */
export function useNotificationInbox() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchNotifications()
      .then((rows) => {
        if (!cancelled) {
          setItems((Array.isArray(rows) ? rows : []).map(normalizeNotification))
        }
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const unread = items.filter((n) => !n.read).length

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead().catch(() => {})
    setItems((p) => p.map((n) => ({ ...n, read: true })))
  }, [])

  const dismiss = useCallback((id) => {
    setItems((p) => p.filter((n) => n.id !== id))
  }, [])

  const markRead = useCallback((id) => {
    setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const displayed = useMemo(
    () =>
      items.filter((n) => {
        if (filter === 'unread') return !n.read
        if (filter === 'important') return n.important
        return true
      }),
    [items, filter]
  )

  return {
    items,
    displayed,
    loading,
    filter,
    setFilter,
    unread,
    markAllRead,
    dismiss,
    markRead,
  }
}

export default useNotificationInbox
