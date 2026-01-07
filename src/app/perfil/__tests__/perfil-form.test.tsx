import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PerfilForm } from '@/app/perfil/perfil-form'
import * as PerfilActions from '@/app/perfil/actions'

jest.mock('@/app/perfil/actions')

const mockSalvarPerfil = jest.mocked(PerfilActions.salvarPerfil)

describe('PerfilForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza campos obrigatórios', () => {
    render(
      <PerfilForm
        userId="user-123"
        email="user@example.com"
        perfilExistente={null}
      />
    )

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/posição/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /criar perfil/i })).toBeInTheDocument()
  })

  it('chama salvarPerfil ao enviar dados válidos', async () => {
    mockSalvarPerfil.mockResolvedValueOnce({ success: true } as any)

    render(
      <PerfilForm
        userId="user-123"
        email="user@example.com"
        perfilExistente={null}
      />
    )

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByLabelText(/posição/i), {
      target: { value: 'meia' },
    })

    fireEvent.click(screen.getByRole('button', { name: /criar perfil/i }))

    await waitFor(() => {
      expect(mockSalvarPerfil).toHaveBeenCalled()
    })
  })

  it('exibe erro quando salvarPerfil falha', async () => {
    mockSalvarPerfil.mockResolvedValueOnce({ error: 'Erro ao salvar perfil' } as any)

    render(
      <PerfilForm
        userId="user-123"
        email="user@example.com"
        perfilExistente={null}
      />
    )

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: 'Maria Silva' },
    })
    fireEvent.change(screen.getByLabelText(/posição/i), {
      target: { value: 'atacante' },
    })

    fireEvent.click(screen.getByRole('button', { name: /criar perfil/i }))

    await waitFor(() => {
      expect(screen.getByText(/erro ao salvar perfil/i)).toBeInTheDocument()
    })
  })

  it('mostra estado de carregamento e sucesso', async () => {
    mockSalvarPerfil.mockImplementation(async () => {
      return new Promise((resolve) => setTimeout(() => resolve({ success: true } as any), 10))
    })

    render(
      <PerfilForm
        userId="user-123"
        email="user@example.com"
        perfilExistente={null}
      />
    )

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: 'Ana Silva' },
    })
    fireEvent.change(screen.getByLabelText(/posição/i), {
      target: { value: 'zagueiro' },
    })

    const button = screen.getByRole('button', { name: /criar perfil/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/perfil salvo com sucesso/i)).toBeInTheDocument()
    })
  })

  it('altera texto do botão para "Atualizar Perfil" quando já existe perfil', () => {
    render(
      <PerfilForm
        userId="user-123"
        email="user@example.com"
        perfilExistente={{
          full_name: 'João Silva',
          nickname: 'João',
          position: 'meia',
          avatar_url: '',
        }}
      />
    )

    expect(screen.getByRole('button', { name: /atualizar perfil/i })).toBeInTheDocument()
  })
})
