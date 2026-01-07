-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.draft_options (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid,
  option_name text NOT NULL,
  teams_json jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT draft_options_pkey PRIMARY KEY (id),
  CONSTRAINT draft_options_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id)
);
CREATE TABLE public.draft_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid,
  user_id uuid,
  draft_option_id uuid,
  CONSTRAINT draft_votes_pkey PRIMARY KEY (id),
  CONSTRAINT draft_votes_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id),
  CONSTRAINT draft_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT draft_votes_draft_option_id_fkey FOREIGN KEY (draft_option_id) REFERENCES public.draft_options(id)
);
CREATE TABLE public.match_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid,
  type USER-DEFINED NOT NULL,
  game_minute text,
  player_id uuid,
  team_color USER-DEFINED,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT match_events_pkey PRIMARY KEY (id),
  CONSTRAINT match_events_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id),
  CONSTRAINT match_events_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.match_players (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid,
  user_id uuid,
  role USER-DEFINED DEFAULT 'player'::player_role,
  team_color USER-DEFINED,
  confirmed boolean DEFAULT true,
  has_paid boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT match_players_pkey PRIMARY KEY (id),
  CONSTRAINT match_players_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id),
  CONSTRAINT match_players_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  location text NOT NULL,
  match_date timestamp with time zone NOT NULL,
  pix_key text,
  price_per_person numeric,
  status USER-DEFINED DEFAULT 'scheduled'::match_status,
  share_code text DEFAULT SUBSTRING(md5((random())::text) FROM 1 FOR 7) UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  nickname text,
  avatar_url text,
  position text,
  rating integer DEFAULT 1000,
  total_matches integer DEFAULT 0,
  total_wins integer DEFAULT 0,
  total_goals integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);