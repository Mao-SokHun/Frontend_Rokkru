import { useEffect, useState } from 'react'
import { getCheckoutSession } from '@/services/platform/subscriptionService'

/** Controller — Stripe payment success verification */
export function usePaymentVerification(sessionId, refreshSubscription) {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setError('Missing payment session.')
      return
    }

    getCheckoutSession(sessionId)
      .then(async (data) => {
        if (data.status === 'paid') {
          await refreshSubscription?.()
          setStatus('success')
        } else {
          setStatus('pending')
        }
      })
      .catch((err) => {
        setStatus('error')
        setError(err?.message || 'Could not verify payment')
      })
  }, [sessionId, refreshSubscription])

  return { status, error }
}

export default usePaymentVerification
