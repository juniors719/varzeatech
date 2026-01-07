import { render, screen, waitFor } from '@testing-library/react'
import { LoginRedirect } from '@/app/login/login-redirect'

const pushMock = jest.fn()
const getSessionMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    pathname: '/login',
  }),
}))

jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: getSessionMock,
    },
  }),
}))

describe('LoginRedirect', () => {
  beforeEach(() => {
    getSessionMock.mockResolvedValue({ data: { session: null } })
    pushMock.mockClear()
  })

  it('renderiza children após verificar que não há sessão', async () => {
    render(
      <LoginRedirect>
        <div>Login Content</div>
      </LoginRedirect>
    )

    await waitFor(() => {
      expect(screen.getByText('Login Content')).toBeInTheDocument()
    })
  })

  it('redireciona para dashboard quando há sessão', async () => {
    getSessionMock.mockResolvedValueOnce({ data: { session: { user: { id: '1' } } } })

    render(
      <LoginRedirect>
        <div>Login Content</div>
      </LoginRedirect>
    )

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/dashboard')
    })

    expect(screen.queryByText('Login Content')).not.toBeInTheDocument()
  })
})
