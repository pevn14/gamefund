-- =====================================================
-- CONFIGURATION STORAGE AVATARS
-- =====================================================
-- Script pour créer le bucket avatars et ses politiques

-- Vérifier et ajouter la colonne bio si elle n'existe pas
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Créer un bucket pour les avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POLITIQUES STORAGE POUR AVATARS
-- =====================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Politique 1: Tout le monde peut voir les avatars
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Politique 2: Les utilisateurs authentifiés peuvent uploader des avatars
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    -- Le fichier doit être dans un dossier avec l'ID de l'utilisateur
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Politique 3: Les utilisateurs peuvent mettre à jour leur propre avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Politique 4: Les utilisateurs peuvent supprimer leur propre avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier le bucket
SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Vérifier les politiques
SELECT policyname, cmd as operation
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%avatar%'
ORDER BY policyname;

-- Vérifier la colonne bio
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'bio';
