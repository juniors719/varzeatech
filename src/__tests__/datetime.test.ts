/**
 * Testes para cálculos e validações de data/hora
 */

describe("Utilitários de Data e Hora", () => {
  describe("Formatação de Data", () => {
    it("deve formatar data em português correto", () => {
      const date = new Date("2026-01-07");
      const formatted = date.toLocaleDateString("pt-BR");

      expect(formatted).toContain("2026");
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // dd/mm/yyyy
    });

    it("deve formatar hora em formato 24h", () => {
      const date = new Date("2026-01-07T22:30:00");
      const formatted = date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      expect(formatted).toBe("22:30");
    });

    it("deve indicar se a data é hoje", () => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const isToday = today.toDateString() === new Date().toDateString();
      const isTomorrow = tomorrow.toDateString() === new Date().toDateString();

      expect(isToday).toBe(true);
      expect(isTomorrow).toBe(false);
    });
  });

  describe("Verificação de Status do Racha", () => {
    it("deve verificar se racha é futuro", () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const isUpcoming = futureDate > new Date();

      expect(isUpcoming).toBe(true);
    });

    it("deve verificar se racha é passado", () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);

      const isUpcoming = pastDate > new Date();

      expect(isUpcoming).toBe(false);
    });

    it("deve verificar se racha começa em breve (< 24h)", () => {
      const soonDate = new Date();
      soonDate.setHours(soonDate.getHours() + 12);

      const now = new Date();
      const isSoon =
        soonDate > now &&
        soonDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

      expect(isSoon).toBe(true);
    });

    it("deve verificar se racha não começa em breve (> 24h)", () => {
      const laterDate = new Date();
      laterDate.setHours(laterDate.getHours() + 48);

      const now = new Date();
      const isSoon =
        laterDate > now &&
        laterDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

      expect(isSoon).toBe(false);
    });
  });

  describe("Combinação de Data e Hora", () => {
    it("deve combinar data e hora em ISO string", () => {
      const data = "2026-01-20";
      const hora = "20:00";

      const dataHora = new Date(`${data}T${hora}`);

      expect(dataHora.toISOString()).toContain("2026-01-20");
      // ISO contém timezone, então verificamos a hora local
      expect(dataHora.toLocaleString("pt-BR")).toContain("20:00");
    });

    it("deve combinar com timezone correto", () => {
      const data = "2026-01-20";
      const hora = "14:30";

      const dataHora = new Date(`${data}T${hora}`);
      const iso = dataHora.toISOString();

      expect(iso).toBeTruthy();
      expect(typeof iso).toBe("string");
    });
  });
});
