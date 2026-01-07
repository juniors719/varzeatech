'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function LoginRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Usuário já está logado, redireciona para dashboard
        router.push('/dashboard')
      } else {
        // Usuário não está logado, mostra página de login
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [supabase, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return <>{children}</>
}
