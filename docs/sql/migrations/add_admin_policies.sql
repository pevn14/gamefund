-- =====================================================
-- POLITIQUES RLS ADMIN - CORRECTION COMPLÈTE
-- =====================================================
-- Ce script corrige les politiques admin sur TOUTES les tables
-- pour utiliser la fonction is_admin() et éviter les récursions

-- =====================================================
-- ÉTAPE 1: SUPPRIMER LES ANCIENNES POLITIQUES
-- =====================================================

-- Profiles
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;

-- Projects
DROP POLICY IF EXISTS "Admin can view all projects" ON projects;
DROP POLICY IF EXISTS "Admin can update all projects" ON projects;
DROP POLICY IF EXISTS "Admin can delete all projects" ON projects;

-- Donations
DROP POLICY IF EXISTS "Admin can manage all donations" ON donations;

-- =====================================================
-- ÉTAPE 2: FONCTION HELPER SÉCURISÉE
-- =====================================================
-- Cette fonction utilise SECURITY DEFINER pour contourner RLS
-- et éviter la récursion infinie

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- =====================================================
-- ÉTAPE 3: POLITIQUES PROFILES
-- =====================================================

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin can update all profiles"
  ON profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- Note: Pas de DELETE - utiliser is_active = false pour soft delete

-- =====================================================
-- ÉTAPE 4: POLITIQUES PROJECTS
-- =====================================================

CREATE POLICY "Admin can view all projects"
  ON projects FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can update all projects"
  ON projects FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete all projects"
  ON projects FOR DELETE
  USING (public.is_admin());

-- =====================================================
-- ÉTAPE 5: POLITIQUES DONATIONS
-- =====================================================

CREATE POLICY "Admin can manage all donations"
  ON donations FOR ALL
  USING (public.is_admin());

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Afficher toutes les politiques admin
SELECT
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE policyname LIKE 'Admin%'
ORDER BY tablename, policyname;
