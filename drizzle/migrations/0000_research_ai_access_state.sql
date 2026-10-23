CREATE TABLE public.research_ai_access_state (id text PRIMARY KEY, status integer NOT NULL, message text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.research_ai_access_state TO service_role;
ALTER TABLE public.research_ai_access_state ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.research_ai_access_state IS 'Internal terminal AI access blocks. No browser grants or policies; cleared only after access restored by owner.';