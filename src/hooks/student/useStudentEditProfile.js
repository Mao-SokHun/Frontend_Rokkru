import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { isApiEnabled } from '@/constants'
import { deleteAccountWithPassword } from '@/services/auth/authService'
import { fetchProvinces } from '@/services/mentors/mentorService'
import { buildProvinceOptionObjects, resolveProvinceCanonicalName } from '@/utils/provinceOptions'
import { resolveStudentProfile } from '@/lib/studentProfile'
import {
  saveStudentProfile,
  fetchMyStudentProfile,
} from '@/services/students/studentProfileService'
import { getPhoneDigits } from '@/utils/phoneInput'

/** Controller — student edit profile (load / save / delete) */
export function useStudentEditProfile(user, { t, lang, logout, updateUser }) {
  const navigate = useNavigate()
  const defaults = resolveStudentProfile(user)

  const [profileLoading, setProfileLoading] = useState(isApiEnabled())
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [provinceRows, setProvinceRows] = useState([])
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!isApiEnabled()) return
    let cancelled = false
    fetchProvinces()
      .then((rows) => {
        if (!cancelled) setProvinceRows(Array.isArray(rows) ? rows : [])
      })
      .catch(() => {
        if (!cancelled) setProvinceRows([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const [profileSeed, setProfileSeed] = useState(null)

  useEffect(() => {
    if (!isApiEnabled() || !user?.id) {
      setProfileLoading(false)
      return
    }

    let cancelled = false
    setProfileLoading(true)

    fetchMyStudentProfile()
      .then((row) => {
        if (!cancelled && row) setProfileSeed(row)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setProfileLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.id])

  const provinceOptions =
    provinceRows.length > 0 ? buildProvinceOptionObjects(provinceRows, lang) : []

  const saveProfile = useCallback(
    async (patch) => {
      setSaveError('')
      const trimmedFirst = patch.firstName?.trim()
      const trimmedLast = patch.lastName?.trim()
      if (!trimmedFirst) {
        setSaveError(t('auth.firstNameRequired'))
        return { ok: false }
      }
      if (!trimmedLast) {
        setSaveError(t('auth.lastNameRequired'))
        return { ok: false }
      }
      setSaving(true)
      try {
        const provinceToSave =
          resolveProvinceCanonicalName(patch.province, provinceRows) || patch.province
        const body = {
          firstName: trimmedFirst,
          lastName: trimmedLast,
          name: `${trimmedFirst} ${trimmedLast}`.trim(),
          email: patch.email,
          phone: getPhoneDigits(patch.phone),
          bio: patch.bio?.trim(),
          location: provinceToSave,
          province: provinceToSave,
          learningFocus: patch.learningFocus,
          interests: patch.interests,
          goals: user?.goals ?? [],
        }
        const saved = await saveStudentProfile(body)
        updateUser(saved)
        navigate('/profile')
        return { ok: true }
      } catch (err) {
        const message = err?.message || t('profile.saveFailed')
        setSaveError(message)
        return { ok: false, error: message }
      } finally {
        setSaving(false)
      }
    },
    [provinceRows, t, updateUser, navigate, user?.goals]
  )

  const deleteAccount = useCallback(
    async (password) => {
      setDeleteError('')
      if (!password?.trim()) {
        setDeleteError(t('mentorProfile.deletePasswordRequired'))
        return { ok: false }
      }
      setDeletingAccount(true)
      try {
        await deleteAccountWithPassword({
          userId: user?.id,
          password,
        })
        await logout()
        navigate('/login', { replace: true })
        return { ok: true }
      } catch (err) {
        const code = err?.message
        const messages = {
          DELETE_ACCOUNT_ENDPOINT_UNAVAILABLE: t('mentorProfile.deleteAccountEndpointUnavailable'),
          DELETE_ACCOUNT_PASSWORD_INCORRECT: t('mentorProfile.deletePasswordIncorrect'),
          DELETE_ACCOUNT_USER_NOT_FOUND: t('mentorProfile.deleteAccountUserNotFound'),
          DELETE_ACCOUNT_PASSWORD_REQUIRED: t('mentorProfile.deletePasswordRequired'),
        }
        setDeleteError(messages[code] || t('mentorProfile.deleteAccountFailed'))
        return { ok: false }
      } finally {
        setDeletingAccount(false)
      }
    },
    [user?.id, logout, navigate, t]
  )

  return {
    defaults,
    profileLoading,
    profileSeed,
    saving,
    saveError,
    provinceRows,
    provinceOptions,
    saveProfile,
    deleteAccount,
    deletingAccount,
    deleteError,
    setDeleteError,
    setSaveError,
  }
}

export default useStudentEditProfile
