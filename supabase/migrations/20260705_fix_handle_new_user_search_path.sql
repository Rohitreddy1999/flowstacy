-- Fix: handle_new_user trigger function failed on signup with
-- "relation profiles does not exist" because the function's
-- search_path did not include public schema.
-- Added explicit schema prefix and set search_path = public.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;
