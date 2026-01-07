-- Execute this in Supabase SQL Editor
-- Add rental fields to matches table for new rental-based pricing system

ALTER TABLE public.matches
ADD COLUMN IF NOT EXISTS rental_hour_value numeric,
ADD COLUMN IF NOT EXISTS rental_hours numeric,
ADD COLUMN IF NOT EXISTS rental_cost numeric;
