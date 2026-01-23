-- Create table for purchase interest submissions
CREATE TABLE public.purchase_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan_id TEXT NOT NULL REFERENCES public.plans(id),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchase_interests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit interest (public form)
CREATE POLICY "Anyone can submit purchase interest"
ON public.purchase_interests
FOR INSERT
WITH CHECK (true);

-- Only admins can view (we'll handle this server-side for now)
CREATE POLICY "Users can view their own submissions"
ON public.purchase_interests
FOR SELECT
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Add trigger for updated_at
CREATE TRIGGER update_purchase_interests_updated_at
BEFORE UPDATE ON public.purchase_interests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();