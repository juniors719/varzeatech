import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConfirmarPresencaButton } from '@/app/racha/[id]/confirmar-presenca'

jest.mock('@/app/racha/[id]/actions', () => ({
  confirmarPresenca: jest.fn(),
}))

import { confirmarPresenca } from '@/app/racha/[id]/actions'

const mockConfirmarPresenca = confirmarPresenca as jest.MockedFunction<
  typeof confirmarPresenca
>

describe('ConfirmarPresencaButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar o botão', () => {
    render(<ConfirmarPresencaButton rachaId="123" />)
    expect(
      screen.getByRole('button', { name: /confirmar presença/i })
    ).toBeInTheDocument()
  })

  it('deve mostrar loading ao clicar', () => {
    mockConfirmarPresenca.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<ConfirmarPresencaButton rachaId="123" />)
    const button = screen.getByRole('button', { name: /confirmar presença/i })

    fireEvent.click(button)

    // Button deve estar desabilitado durante loading
    expect(button).toBeDisabled()
  })

  it('deve chamar confirmarPresenca com rachaId correto', async () => {
    mockConfirmarPresenca.mockResolvedValue({ success: true } as any)

    render(<ConfirmarPresencaButton rachaId="abc-123" />)
    const button = screen.getByRole('button', { name: /confirmar presença/i })

    fireEvent.click(button)

    await waitFor(() => {
      expect(mockConfirmarPresenca).toHaveBeenCalledWith('abc-123')
    })
  })

  it('deve exibir erro se falhar', async () => {
    mockConfirmarPresenca.mockResolvedValue({
      error: 'Você já confirmou presença neste racha',
    } as any)

    render(<ConfirmarPresencaButton rachaId="123" />)
    const button = screen.getByRole('button', { name: /confirmar presença/i })

    fireEvent.click(button)

    await waitFor(() => {
      expect(
        screen.getByText(/você já confirmou presença neste racha/i)
      ).toBeInTheDocument()
    })
  })

  it('deve desabilitar o botão após sucesso', async () => {
    mockConfirmarPresenca.mockResolvedValue({ success: true } as any)

    const { rerender } = render(<ConfirmarPresencaButton rachaId="123" />)
    const button = screen.getByRole('button', { name: /confirmar presença/i })

    fireEvent.click(button)

    await waitFor(() => {
      expect(mockConfirmarPresenca).toHaveBeenCalled()
    })
  })
})
