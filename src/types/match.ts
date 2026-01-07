// Tipos compartilhados para entidades de Racha (Match)

export type MatchPlayerCountAgg = {
	count: number
}

export type MatchStatus = string

export type Match = {
	id: string
	location: string
	match_date: string
	status: MatchStatus
	created_by: string
	created_at?: string
	pix_key?: string | null
	rental_cost?: number | null
	rental_hour_value?: number | null
	rental_hours?: number | null
	match_players?: MatchPlayerCountAgg[]
}

