import { forwardRef } from 'react'
import FieldLabel from './FieldLabel'
import { FORM_FINE_PRINT_CLASS } from '../common/RequiredFieldsHint'
import { Input as ShadcnInput } from '@/components/ui/shadcn/input'
import { cn } from '@/lib/utils'

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className,
      variant = 'default',
      required,
      optional,
      optionalLabel,
      id,
      ...props
    },
    ref
  ) => {
    const isGlass = variant === 'glass'

    return (
      <div className="w-full">
        <FieldLabel
          htmlFor={id}
          label={label}
          required={required}
          optional={optional}
          optionalText={optionalLabel}
        />
        <div className="relative">
          {leftIcon ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              {leftIcon}
            </div>
          ) : null}
          <ShadcnInput
            ref={ref}
            id={id}
            required={required}
            className={cn(
              isGlass ? 'py-2.5 text-base' : 'py-2.5 text-sm',
              isGlass
                ? cn(
                    'auth-field-input bg-white/90',
                    error
                      ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200/50'
                      : 'border-slate-200 hover:border-slate-300 focus-visible:border-primary-300 focus-visible:ring-primary-200/40'
                  )
                : cn(
                    'bg-white',
                    error
                      ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200/50'
                      : 'border-slate-200 hover:border-slate-300 focus-visible:border-primary-300 focus-visible:ring-primary-200/40'
                  ),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        {hint && !error ? (
          <p className={cn('mt-1', FORM_FINE_PRINT_CLASS)}>{hint}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
