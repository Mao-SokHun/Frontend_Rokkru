import { useState, useCallback } from 'react'
import { createCheckoutSession } from '@/services/platform/subscriptionService'

/** Controller — mentor Stripe checkout */
export function useMentorCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const startCheckout = useCallback(async (subscriptionPlanId) => {
    if (!subscriptionPlanId) {
      setError('No subscription plan selected. Go back and choose a plan.')
      return { ok: false }
    }

    setLoading(true)
    setError(null)
    try {
      const { url } = await createCheckoutSession({ subscriptionPlanId })
      if (!url) throw new Error('Stripe did not return a checkout URL')
      window.location.href = url
      return { ok: true }
    } catch (err) {
      const message = err?.message || 'Could not start Stripe checkout'
      setError(message)
      setLoading(false)
      return { ok: false, error: message }
    }
  }, [])

  return { loading, error, startCheckout, setError }
}

export default useMentorCheckout
