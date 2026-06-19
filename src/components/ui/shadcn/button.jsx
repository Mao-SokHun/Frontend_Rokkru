import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'btn-solid-primary bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-300 shadow-sm hover:shadow-md',
        primary:
          'btn-solid-primary bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-300 shadow-sm hover:shadow-md',
        destructive:
          'btn-solid-danger bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-md',
        danger:
          'btn-solid-danger bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-md',
        outline:
          'border border-primary-300 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-200',
        secondary:
          'glass-subtle border border-white/60 text-slate-700 hover:bg-white/70 focus-visible:ring-slate-300 shadow-sm',
        ghost:
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-5 py-2.5 text-base',
        sm: 'px-3.5 py-2 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
