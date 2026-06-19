import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/shadcn/avatar'
import { cn } from '@/lib/utils'

const sizeClasses = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-lg',
  '2xl': 'h-28 w-28 text-2xl',
}

const dotSizes = {
  xs: 'h-2 w-2',
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
  xl: 'h-4 w-4',
  '2xl': 'h-5 w-5',
}

const gradients = [
  'from-teal-100 to-emerald-200',
  'from-sky-100 to-sky-200',
  'from-primary-100 to-primary-200',
  'from-amber-100 to-amber-200',
  'from-slate-100 to-slate-200',
]

const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2)
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`
}

const Avatar = ({ src, name = '', size = 'md', online, className }) => {
  const resolvedSrc = src ? String(src).trim() : ''
  const gradientIndex = (name?.charCodeAt(0) ?? 0) % gradients.length
  const gradient = gradients[gradientIndex]

  return (
    <ShadcnAvatar className={cn('relative', sizeClasses[size], className)}>
      {resolvedSrc ? (
        <AvatarImage
          src={resolvedSrc}
          alt=""
          className="rounded-[inherit] object-cover ring-2 ring-white shadow-sm"
        />
      ) : null}
      <AvatarFallback
        className={cn(
          'rounded-[inherit] bg-gradient-to-br font-bold uppercase tracking-tight text-teal-800 ring-2 ring-white shadow-sm',
          gradient
        )}
      >
        <span className="select-none leading-none">{getInitials(name)}</span>
      </AvatarFallback>
      {online !== undefined ? (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            dotSizes[size],
            online ? 'bg-emerald-400' : 'bg-slate-300'
          )}
        />
      ) : null}
    </ShadcnAvatar>
  )
}

export default Avatar
