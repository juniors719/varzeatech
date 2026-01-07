# 🧪 Testes - VárzeaTech

Este documento descreve como executar e escrever testes para o projeto.

## 📦 Ferramentas Instaladas

- **Jest**: Framework de testes
- **React Testing Library**: Biblioteca para testes de componentes React
- **TypeScript**: Suporte completo a tipos

## 🚀 Executar Testes

```bash
# Executar todos os testes uma vez
npm run test

# Executar testes em modo watch (atualiza ao salvar)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## 📁 Estrutura de Testes

Os testes são organizados em pastas `__tests__` próximas aos arquivos:

```
src/
├── app/
│   ├── racha/
│   │   └── [id]/
│   │       ├── __tests__/
│   │       │   └── copy-pix-button.test.tsx
│   │       └── copy-pix-button.tsx
│   └── meus-rachas/
│       ├── __tests__/
│       │   └── racha-card.test.tsx
│       └── racha-card.tsx
```

## ✍️ Exemplos de Testes

### Teste de Componente Client

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { MyComponent } from '@/app/my-component'

describe('MyComponent', () => {
  it('deve renderizar o texto', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('deve chamar callback ao clicar', () => {
    const handleClick = jest.fn()
    render(<MyComponent onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Teste de Server Action

```typescript
import { minhaAction } from '@/app/actions'

jest.mock('@/utils/supabase/server')

describe('minhaAction', () => {
  it('deve retornar sucesso', async () => {
    const result = await minhaAction('test-data')
    expect(result.success).toBe(true)
  })

  it('deve retornar erro se dados inválidos', async () => {
    const result = await minhaAction('')
    expect(result.error).toBeDefined()
  })
})
```

## 📊 Cobertura de Testes

Para ver quais partes do código estão cobertas por testes:

```bash
npm run test:coverage
```

Isso gera um relatório em `coverage/` mostrando a percentagem de cobertura.

## 🔧 Configuração

- **jest.config.ts**: Configuração principal do Jest
- **jest.setup.ts**: Setup executado antes dos testes (ex: imports globais)

## 💡 Dicas

1. **Mockar Supabase**: Sempre mocke o cliente Supabase em testes
2. **Mockar Next.js**: Mocke `next/link`, `next/navigation`, etc
3. **User Interaction**: Use `fireEvent` ou `userEvent` para simular clicks
4. **Async**: Use `async/await` para testes assíncronos
5. **Cleanup**: Jest limpa automaticamente entre testes

## 🎯 Próximos Passos

Para melhorar a cobertura de testes:

- [ ] Adicionar testes para server actions (login, criar racha, etc)
- [ ] Adicionar testes e2e com Playwright
- [ ] Testar integração com Supabase
- [ ] Testar fluxos de autenticação
- [ ] Testar cálculos de valor por jogador

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)
