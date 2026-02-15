'use client'

import { SignOutIcon } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'

import { Spinner } from '../ui/spinner'

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/auth/sign-in')
          }
        }
      })
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant='destructive' className='w-full' onClick={handleSignOut} disabled={loading}>
      {loading ? <Spinner data-icon='inline-start' /> : <SignOutIcon data-icon='inline-start' />}
      Sign Out
    </Button>
  )
}
