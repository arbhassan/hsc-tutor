-- Fix themes table color column name to match service expectations
-- Run this after the table alignment script

-- Rename color_code to color in themes table
ALTER TABLE public.themes RENAME COLUMN color_code TO color;

-- Success message
SELECT 'Themes color column fixed successfully!' as message; 