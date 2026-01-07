"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function salvarPerfil(formData: FormData) {
  const supabase = await createClient();

  const userId = formData.get("userId") as string;
  const nome = formData.get("nome") as string;
  const apelido = formData.get("apelido") as string;
  const posicao = formData.get("posicao") as string;
  const fotoUrl = formData.get("foto_url") as string;

  // Chamar função RPC ao invés de fazer upsert direto
  const { error } = await supabase.rpc("save_profile", {
    p_id: userId,
    p_full_name: nome,
    p_nickname: apelido || null,
    p_avatar_url: fotoUrl || null,
    p_position: posicao,
  });

  if (error) {
    console.error("Erro ao salvar perfil:", error);
    return { error: error.message };
  }

  revalidatePath("/perfil");
  revalidatePath("/dashboard");

  return { success: true };
}
