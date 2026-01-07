import { createClient } from "@/utils/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("createClient (server)", () => {
  const getAll = jest.fn(() => [{ name: "sb", value: "token", options: {} }]);
  const set = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:9999";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    (cookies as jest.Mock).mockResolvedValue({
      getAll,
      set,
    });
    (createServerClient as jest.Mock).mockReturnValue("client-stub");
  });

  it("cria o client com cookies e credenciais", async () => {
    const client = await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      "http://localhost:9999",
      "anon-key",
      expect.objectContaining({ cookies: expect.any(Object) })
    );
    expect(client).toBe("client-stub");
  });

  it("usa setAll para definir cookies retornados", async () => {
    await createClient();

    const config = (createServerClient as jest.Mock).mock.calls[0][2];
    config.cookies.setAll([{ name: "sb", value: "token", options: {} }]);

    expect(set).toHaveBeenCalled();
  });
});
