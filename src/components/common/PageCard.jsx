import clsx from 'clsx'

/** Standard glass card used across ambient pages */
const PageCard = ({ children, className, padding = true, hover, variant }) => (
  <div
    className={clsx(
      variant === 'brand' && 'glass-panel-brand',
      variant === 'alert' && 'glass-panel-alert',
      !variant && (hover ? 'glass-panel-hover' : 'glass-panel'),
      padding && 'p-5 sm:p-6',
      'transition-shadow duration-200',
      className
    )}
  >
    {children}
  </div>
)

export default PageCard
