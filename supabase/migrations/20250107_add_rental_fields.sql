-- Add rental fields to matches table
ALTER TABLE public.matches
ADD COLUMN IF NOT EXISTS rental_hour_value numeric,
ADD COLUMN IF NOT EXISTS rental_hours numeric,
ADD COLUMN IF NOT EXISTS rental_cost numeric;

-- Update price_per_person column comment to clarify it's now calculated dynamically
COMMENT ON COLUMN public.matches.price_per_person IS 'DEPRECATED: Price is now calculated dynamically from rental_cost / number of participants';
