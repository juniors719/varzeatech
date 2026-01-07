"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function criarRacha(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Usuário não autenticado" };
  }

  const local = formData.get("local") as string;
  const data = formData.get("data") as string;
  const hora = formData.get("hora") as string;
  const valorPessoa = parseFloat(formData.get("valor_pessoa") as string);
  const pixKey = formData.get("pix_key") as string;

  // Combinar data e hora
  const dataHora = new Date(`${data}T${hora}`);

  const dadosRacha = {
    created_by: user.id,
    location: local,
    match_date: dataHora.toISOString(),
    price_per_person: valorPessoa,
    pix_key: pixKey || null,
    status: "scheduled",
  };

  const { data: racha, error } = await supabase
    .from("matches")
    .insert([dadosRacha])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar racha:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect(`/racha/${racha.id}`);
}
