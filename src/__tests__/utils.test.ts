/**
 * Testes para utilitários e cálculos
 */

describe("Utilitários de Cálculo", () => {
  describe("Cálculo de Valor por Jogador", () => {
    it("deve calcular valor por jogador com arredondamento para cima", () => {
      const rentalCost = 200; // R$ 200
      const numParticipants = 3; // 3 jogadores

      // Fórmula: Math.ceil((rental_cost / numParticipants) * 100) / 100
      const pricePerPerson =
        Math.ceil((rentalCost / numParticipants) * 100) / 100;

      // 200 / 3 = 66.66... → arredonda para 66.67
      expect(pricePerPerson).toBe(66.67);
    });

    it("deve arredondar para evitar prejuízo", () => {
      const rentalCost = 100;
      const numParticipants = 3;

      const pricePerPerson =
        Math.ceil((rentalCost / numParticipants) * 100) / 100;

      // 100 / 3 = 33.33... → arredonda para 33.34
      expect(pricePerPerson).toBe(33.34);
    });

    it("deve retornar valor exato quando divisível", () => {
      const rentalCost = 200;
      const numParticipants = 4;

      const pricePerPerson =
        Math.ceil((rentalCost / numParticipants) * 100) / 100;

      // 200 / 4 = 50.00 (exato)
      expect(pricePerPerson).toBe(50.0);
    });

    it("deve retornar o custo total se não houver participantes", () => {
      const rentalCost = 200;
      const numParticipants = 0;

      const pricePerPerson =
        numParticipants > 0
          ? Math.ceil((rentalCost / numParticipants) * 100) / 100
          : rentalCost;

      expect(pricePerPerson).toBe(200);
    });

    it("deve calcular corretamente com valores grandes", () => {
      const rentalCost = 1000;
      const numParticipants = 7;

      const pricePerPerson =
        Math.ceil((rentalCost / numParticipants) * 100) / 100;

      // 1000 / 7 = 142.857... → arredonda para 142.86
      expect(pricePerPerson).toBe(142.86);
    });
  });

  describe("Cálculo de Custo Total de Aluguel", () => {
    it("deve calcular custo total: valor_hora × quantidade_horas", () => {
      const valorHora = 100;
      const quantidadeHoras = 2;

      const custoTotal = valorHora * quantidadeHoras;

      expect(custoTotal).toBe(200);
    });

    it("deve funcionar com horas fracionadas", () => {
      const valorHora = 100;
      const quantidadeHoras = 1.5;

      const custoTotal = valorHora * quantidadeHoras;

      expect(custoTotal).toBe(150);
    });

    it("deve funcionar com valores decimais", () => {
      const valorHora = 50.5;
      const quantidadeHoras = 3;

      const custoTotal = valorHora * quantidadeHoras;

      expect(custoTotal).toBe(151.5);
    });
  });

  describe("Validações", () => {
    it("deve validar se email é válido", () => {
      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(isValidEmail("test@email.com")).toBe(true);
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
    });

    it("deve validar se CPF é válido (básico)", () => {
      const isValidCPF = (cpf: string) => {
        return /^\d{11}$/.test(cpf.replace(/\D/g, ""));
      };

      expect(isValidCPF("88997433201")).toBe(true);
      expect(isValidCPF("123")).toBe(false);
      expect(isValidCPF("123.456.789-00")).toBe(true);
    });

    it("deve validar se valor é positivo", () => {
      const isValidValue = (value: number) => value > 0;

      expect(isValidValue(100)).toBe(true);
      expect(isValidValue(0)).toBe(false);
      expect(isValidValue(-50)).toBe(false);
    });
  });
});
