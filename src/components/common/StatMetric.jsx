import clsx from 'clsx'
import { TEXT } from '@/constants'

const StatMetric = ({ label, value, change, icon: Icon, tone = 'default' }) => {  const tones = {
    default: 'bg-slate-50 text-slate-600',
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-sky-50 text-sky-600',
  }

  return (
    <div className="glass-panel admin-stat-card p-4 sm:p-5 h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={clsx(TEXT.label, 'text-slate-500')}>{label}</p>
          <p className="text-2xl sm:text-[1.65rem] font-bold text-slate-900 mt-1.5 tabular-nums leading-none tracking-tight">{value}</p>
          {change && (
            <p className={clsx('text-xs font-medium mt-1.5', change.startsWith('+') ? 'text-emerald-600' : 'text-slate-400')}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={clsx('w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-white/60', tones[tone])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatMetric
