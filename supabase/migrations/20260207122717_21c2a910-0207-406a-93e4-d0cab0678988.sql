-- Add background_photos column to valentine_sites
ALTER TABLE public.valentine_sites
ADD COLUMN background_photos text[] DEFAULT NULL;

-- Create bucket for valentine photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('valentine-photos', 'valentine-photos', true);

-- RLS policies for the bucket
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'valentine-photos');

CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'valentine-photos');

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'valentine-photos' AND auth.uid()::text = (storage.foldername(name))[1]);