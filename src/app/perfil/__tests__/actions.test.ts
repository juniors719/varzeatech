import { salvarPerfil } from "@/app/perfil/actions";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("salvarPerfil", () => {
  const rpcMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      rpc: rpcMock,
    });
  });

  it("chama RPC com os dados corretos e revalida caches", async () => {
    rpcMock.mockResolvedValue({ error: null });

    const formData = new FormData();
    formData.set("userId", "user-123");
    formData.set("nome", "João Silva");
    formData.set("apelido", "João");
    formData.set("posicao", "meia");
    formData.set("foto_url", "https://example.com/avatar.jpg");

    const result = await salvarPerfil(formData);

    expect(createClient).toHaveBeenCalled();
    expect(rpcMock).toHaveBeenCalledWith("save_profile", {
      p_id: "user-123",
      p_full_name: "João Silva",
      p_nickname: "João",
      p_avatar_url: "https://example.com/avatar.jpg",
      p_position: "meia",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/perfil");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual({ success: true });
  });

  it("retorna erro quando RPC falha", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    rpcMock.mockResolvedValue({ error: { message: "Falhou" } });

    const formData = new FormData();
    formData.set("userId", "user-123");
    formData.set("nome", "João Silva");
    formData.set("apelido", "");
    formData.set("posicao", "meia");
    formData.set("foto_url", "");

    const result = await salvarPerfil(formData);

    expect(result).toEqual({ error: "Falhou" });
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
