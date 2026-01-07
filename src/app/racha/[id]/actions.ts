'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function confirmarPresenca(rachaId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Usuário não autenticado' }
  }

  // Verificar se já confirmou
  const { data: existente } = await supabase
    .from('match_players')
    .select('id')
    .eq('match_id', rachaId)
    .eq('user_id', user.id)
    .single()

  if (existente) {
    return { error: 'Você já confirmou presença neste racha' }
  }

  // Inserir confirmação de presença
  const { error } = await supabase
    .from('match_players')
    .insert([
      {
        match_id: rachaId,
        user_id: user.id,
        confirmed: true,
        has_paid: false,
        role: 'player',
      },
    ])

  if (error) {
    console.error('Erro ao confirmar presença:', error)
    return { error: error.message }
  }

  revalidatePath(`/racha/${rachaId}`)
  return { success: true }
}
