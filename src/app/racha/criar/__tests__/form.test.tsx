import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CriarRachaForm } from '@/app/racha/criar/form'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/app/racha/criar/actions', () => ({
  criarRacha: jest.fn(),
}))

import { criarRacha } from '@/app/racha/criar/actions'

const mockCriarRacha = criarRacha as jest.MockedFunction<typeof criarRacha>

describe('CriarRachaForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar todos os campos do formulário', () => {
    render(<CriarRachaForm />)

    expect(screen.getByLabelText(/local do racha/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/horário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/valor da hora/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/quantidade de horas/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/chave pix/i)).toBeInTheDocument()
  })

  it('deve ter campo de local como required', () => {
    render(<CriarRachaForm />)
    const localInput = screen.getByLabelText(/local do racha/i) as HTMLInputElement
    expect(localInput.required).toBe(true)
  })

  it('deve ter campo de data como required', () => {
    render(<CriarRachaForm />)
    const dataInput = screen.getByLabelText(/data/i) as HTMLInputElement
    expect(dataInput.required).toBe(true)
  })

  it('deve ter campo de horário como required', () => {
    render(<CriarRachaForm />)
    const horaInput = screen.getByLabelText(/horário/i) as HTMLInputElement
    expect(horaInput.required).toBe(true)
  })

  it('deve chamar criarRacha ao submeter com dados válidos', async () => {
    mockCriarRacha.mockResolvedValue({ success: true } as any)

    render(<CriarRachaForm />)

    fireEvent.change(screen.getByLabelText(/local do racha/i), {
      target: { value: 'Campo da Vila' },
    })
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2026-01-20' },
    })
    fireEvent.change(screen.getByLabelText(/horário/i), {
      target: { value: '20:00' },
    })
    fireEvent.change(screen.getByLabelText(/valor da hora/i), {
      target: { value: '100' },
    })
    fireEvent.change(screen.getByLabelText(/quantidade de horas/i), {
      target: { value: '2' },
    })

    const submitButton = screen.getByRole('button', { name: /criar racha/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockCriarRacha).toHaveBeenCalled()
    })
  })

  it('deve exibir erro se criarRacha retornar erro', async () => {
    mockCriarRacha.mockResolvedValue({
      error: 'Erro ao criar racha',
    } as any)

    render(<CriarRachaForm />)

    fireEvent.change(screen.getByLabelText(/local do racha/i), {
      target: { value: 'Campo' },
    })
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2026-01-20' },
    })
    fireEvent.change(screen.getByLabelText(/horário/i), {
      target: { value: '20:00' },
    })
    fireEvent.change(screen.getByLabelText(/valor da hora/i), {
      target: { value: '100' },
    })
    fireEvent.change(screen.getByLabelText(/quantidade de horas/i), {
      target: { value: '2' },
    })

    const submitButton = screen.getByRole('button', { name: /criar racha/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/erro ao criar racha/i)).toBeInTheDocument()
    })
  })

  it('deve ter campo pix como opcional', () => {
    render(<CriarRachaForm />)
    const pixInput = screen.getByLabelText(/chave pix/i) as HTMLInputElement
    expect(pixInput.required).toBe(false)
  })
})
