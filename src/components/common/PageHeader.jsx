import clsx from 'clsx'
import { TEXT } from '@/constants'

const PageHeader = ({ title, subtitle, action, className }) => (
  <div className={clsx('flex items-start justify-between gap-4 flex-wrap mb-1', className)}>
    <div className="min-w-0">
      {title && <h1 className={clsx('admin-page-title', TEXT.pageTitle)}>{title}</h1>}
      {subtitle && <p className={clsx('mt-1.5 max-w-2xl', TEXT.bodyMuted)}>{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)

export default PageHeader
