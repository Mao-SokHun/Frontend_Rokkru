import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium rounded-full border',
  {
    variants: {
      variant: {
        default: 'bg-primary-50 text-primary-700 border-primary-100',
        primary: 'bg-primary-50 text-primary-700 border-primary-100',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        destructive: 'bg-red-50 text-red-700 border-red-100',
        danger: 'bg-red-50 text-red-700 border-red-100',
        info: 'bg-sky-50 text-sky-700 border-sky-100',
        secondary: 'bg-slate-50 text-slate-600 border-slate-100',
        neutral: 'bg-slate-50 text-slate-600 border-slate-100',
        outline: 'text-foreground',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

const dotVariants = {
  primary: 'bg-primary-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  destructive: 'bg-red-400',
  info: 'bg-sky-400',
  neutral: 'bg-slate-400',
  secondary: 'bg-slate-400',
  default: 'bg-primary-400',
}

function Badge({ className, variant, size, dot, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot ? (
        <span
          className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotVariants[variant] ?? dotVariants.default)}
        />
      ) : null}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
