import { forwardRef } from 'react'
import FieldLabel from './FieldLabel'
import { Textarea as ShadcnTextarea } from '@/components/ui/shadcn/textarea'
import { cn } from '@/lib/utils'

const Textarea = forwardRef(
  (
    {
      label,
      error,
      hint,
      rows = 3,
      resize = false,
      className,
      id,
      required,
      optional,
      optionalLabel,
      ...props
    },
    ref
  ) => {
    const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full">
        <FieldLabel
          htmlFor={fieldId}
          label={label}
          required={required}
          optional={optional}
          optionalText={optionalLabel}
        />
        <ShadcnTextarea
          ref={ref}
          id={fieldId}
          rows={rows}
          className={cn(
            'outline-none transition-colors',
            error
              ? 'border-red-300 focus-visible:border-red-400 bg-red-50/30'
              : 'border-slate-200 focus-visible:border-primary-300 bg-white',
            !resize && 'resize-none',
            className
          )}
          {...props}
        />
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
        {!error && hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
