import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DeleteRachaButton } from '@/app/racha/[id]/delete-racha-button'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock da server action
jest.mock('@/app/racha/[id]/actions', () => ({
  deletarRacha: jest.fn(),
}))

import { deletarRacha } from '@/app/racha/[id]/actions'

const mockDeletarRacha = deletarRacha as jest.MockedFunction<typeof deletarRacha>

describe('DeleteRachaButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('não deve renderizar se não for criador', () => {
    const { container } = render(
      <DeleteRachaButton rachaId="123" isCreator={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('deve renderizar botão se for criador', () => {
    render(<DeleteRachaButton rachaId="123" isCreator={true} />)
    expect(screen.getByRole('button', { name: /deletar racha/i })).toBeInTheDocument()
  })

  it('deve abrir modal ao clicar no botão', () => {
    render(<DeleteRachaButton rachaId="123" isCreator={true} />)
    
    const deleteButton = screen.getByRole('button', { name: /deletar racha/i })
    fireEvent.click(deleteButton)

    expect(screen.getByText(/esta ação é irreversível/i)).toBeInTheDocument()
  })

  it('deve fechar modal ao clicar em cancelar', () => {
    render(<DeleteRachaButton rachaId="123" isCreator={true} />)
    
    // Abrir modal
    fireEvent.click(screen.getByRole('button', { name: /deletar racha/i }))
    expect(screen.getByText(/esta ação é irreversível/i)).toBeInTheDocument()

    // Clicar cancelar
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    
    waitFor(() => {
      expect(screen.queryByText(/esta ação é irreversível/i)).not.toBeInTheDocument()
    })
  })

  it('deve chamar deletarRacha ao confirmar', async () => {
    mockDeletarRacha.mockResolvedValue({ success: true } as any)

    render(<DeleteRachaButton rachaId="123" isCreator={true} />)
    
    // Abrir modal
    fireEvent.click(screen.getByRole('button', { name: /deletar racha/i }))

    // Confirmar delete
    const confirmButton = screen.getAllByRole('button', { name: /deletar/i })[1]
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockDeletarRacha).toHaveBeenCalledWith('123')
    })
  })

  it('deve exibir erro se deletarRacha retornar erro', async () => {
    mockDeletarRacha.mockResolvedValue({
      error: 'Erro ao deletar racha',
    } as any)

    render(<DeleteRachaButton rachaId="123" isCreator={true} />)
    
    fireEvent.click(screen.getByRole('button', { name: /deletar racha/i }))
    const confirmButton = screen.getAllByRole('button', { name: /deletar/i })[1]
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText(/erro ao deletar racha/i)).toBeInTheDocument()
    })
  })
})
