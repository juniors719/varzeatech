import { render, screen } from '@testing-library/react'
import { RachaCard } from '@/app/meus-rachas/racha-card'
import type { Match } from '@/types/match'

// Mock do Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
  MockLink.displayName = 'Link'
  return MockLink
})

describe('RachaCard', () => {
  const mockMatch: Match = {
    id: '123',
    location: 'Campo da Vila',
    match_date: new Date(Date.now() + 86400000).toISOString(), // amanhã
    status: 'scheduled',
    created_by: 'user-1',
    rental_cost: 200,
    rental_hour_value: 100,
    rental_hours: 2,
    pix_key: 'test@email.com',
    match_players: [{ count: 3 }],
  }

  it('deve renderizar o card com informações do racha', () => {
    render(
      <RachaCard match={mockMatch} userId="user-1" isCreator={true} />
    )

    expect(screen.getByText('Campo da Vila')).toBeInTheDocument()
    expect(screen.getAllByText(/3/).length).toBeGreaterThan(0)
    expect(screen.getByText(/200.00/)).toBeInTheDocument()
  })

  it('deve exibir badge de organizador quando for o criador', () => {
    render(
      <RachaCard match={mockMatch} userId="user-1" isCreator={true} />
    )

    expect(screen.getByText(/você é o organizador/i)).toBeInTheDocument()
  })

  it('não deve exibir badge de organizador quando não for o criador', () => {
    render(
      <RachaCard match={mockMatch} userId="user-2" isCreator={false} />
    )

    expect(screen.queryByText(/você é o organizador/i)).not.toBeInTheDocument()
  })

  it('exibe alerta de "Em breve" para partidas em menos de 24h', () => {
    const soonMatch = {
      ...mockMatch,
      match_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }

    render(<RachaCard match={soonMatch} userId="user-1" isCreator={false} />)

    expect(screen.getByText(/em breve/i)).toBeInTheDocument()
  })

  it('usa status padrão quando status é desconhecido', () => {
    const unknownStatus = {
      ...mockMatch,
      status: 'invalid',
    }

    render(<RachaCard match={unknownStatus} userId="user-1" isCreator={false} />)

    expect(screen.getByText(/desconhecido/i)).toBeInTheDocument()
  })
})
