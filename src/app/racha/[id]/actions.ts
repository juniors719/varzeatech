"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function confirmarPresenca(rachaId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Usuário não autenticado" };
  }

  // Verificar se já confirmou
  const { data: existente } = await supabase
    .from("match_players")
    .select("id")
    .eq("match_id", rachaId)
    .eq("user_id", user.id)
    .single();

  if (existente) {
    return { error: "Você já confirmou presença neste racha" };
  }

  // Inserir confirmação de presença
  const { error } = await supabase.from("match_players").insert([
    {
      match_id: rachaId,
      user_id: user.id,
      confirmed: true,
      has_paid: false,
      role: "player",
    },
  ]);

  if (error) {
    console.error("Erro ao confirmar presença:", error);
    return { error: error.message };
  }

  revalidatePath(`/racha/${rachaId}`);
  return { success: true };
}

export async function deletarRacha(rachaId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Usuário não autenticado" };
  }

  console.log("Deletando racha:", rachaId, "por usuário:", user.id);

  // Buscar racha para verificar se é o criador
  const { data: racha, error: rachaError } = await supabase
    .from("matches")
    .select("created_by")
    .eq("id", rachaId)
    .single();

  if (rachaError) {
    console.error("Erro ao buscar racha:", rachaError);
    return { error: "Racha não encontrado" };
  }

  if (!racha) {
    return { error: "Racha não encontrado" };
  }

  // Verificar se o usuário é o criador
  if (racha.created_by !== user.id) {
    console.warn("Usuário não é o criador do racha");
    return { error: "Apenas o criador pode deletar o racha" };
  }

  // Deletar match_players relacionados primeiro
  console.log("Deletando match_players do racha:", rachaId);
  const { data: deletedPlayers, error: deletePlayersError } = await supabase
    .from("match_players")
    .delete()
    .eq("match_id", rachaId)
    .select("*");

  if (deletePlayersError) {
    console.error("Erro ao deletar participantes:", deletePlayersError);
    return {
      error: `Erro ao deletar participantes: ${deletePlayersError.message}`,
    };
  }

  console.log("Match players deletados:", deletedPlayers?.length || 0);

  // Deletar o racha
  console.log("Deletando match:", rachaId);
  const { data: deletedMatch, error: deleteError } = await supabase
    .from("matches")
    .delete()
    .eq("id", rachaId)
    .select("*");

  if (deleteError) {
    console.error("Erro ao deletar racha:", deleteError);
    return { error: `Erro ao deletar racha: ${deleteError.message}` };
  }

  console.log("Racha deletado com sucesso:", deletedMatch);

  // Revalidar todo o cache
  revalidatePath("/", "layout");

  // Redirecionar após revalidação (FORA do try-catch)
  redirect("/meus-rachas?deleted=true");
}
