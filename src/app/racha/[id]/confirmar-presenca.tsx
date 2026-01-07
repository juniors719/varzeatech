'use client'

import { useState } from 'react'
import { confirmarPresenca } from './actions'

interface ConfirmarPresencaButtonProps {
  rachaId: string
}

export function ConfirmarPresencaButton({ rachaId }: ConfirmarPresencaButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setLoading(true)
    setError(null)

    const result = await confirmarPresenca(rachaId)

    if (result?.error) {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <>
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Confirmando...' : '✅ Confirmar Presença'}
      </button>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </>
  )
}
