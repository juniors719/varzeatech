import { render, screen, fireEvent } from '@testing-library/react'
import { CopyPixButton } from '@/app/racha/[id]/copy-pix-button'

describe('CopyPixButton', () => {
  it('deve renderizar o botão', () => {
    render(<CopyPixButton pixKey="test@email.com" />)
    const button = screen.getByRole('button', { name: /copiar/i })
    expect(button).toBeInTheDocument()
  })

  it('deve copiar a chave pix ao clicar', async () => {
    // Mock do clipboard
    const mockWriteText = jest.fn()
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })

    render(<CopyPixButton pixKey="88997433201" />)
    const button = screen.getByRole('button', { name: /copiar/i })

    fireEvent.click(button)

    expect(mockWriteText).toHaveBeenCalledWith('88997433201')
    // Alert também é chamado, mas temos que ignorar o erro do jsdom
  })
})
