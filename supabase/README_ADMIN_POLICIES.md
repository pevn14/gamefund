# Fix - Politiques RLS Admin pour gestion des utilisateurs

## Problèmes rencontrés

### Problème 1 : Permissions insuffisantes (406)
```
PATCH .../profiles?id=eq.xxx&select=* 406 (Not Acceptable)
Error: { code: 'PGRST116', message: 'Cannot coerce the result to a single JSON object' }
```

### Problème 2 : Récursion infinie (500)
```
infinite recursion detected in policy for relation "profiles"
```

## Cause

Les politiques RLS qui vérifient le rôle admin avec une sous-requête sur `profiles` créent une boucle infinie :
1. Pour lire `profiles`, vérifie si admin
2. Pour vérifier si admin, lit `profiles`
3. Pour lire `profiles`, vérifie si admin... (récursion)

## Solution

Utiliser une fonction `SECURITY DEFINER` qui contourne RLS pour vérifier le rôle admin.

### Étapes:

1. Aller dans **SQL Editor** sur Supabase
2. Copier-coller le contenu du fichier [add_admin_policies.sql](./add_admin_policies.sql)
3. Cliquer sur **Run** (ou Ctrl+Enter)

### Ce que fait le script :

**1. Supprime les anciennes politiques problématiques**
```sql
-- Profiles
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;

-- Projects
DROP POLICY IF EXISTS "Admin can view all projects" ON projects;
DROP POLICY IF EXISTS "Admin can update all projects" ON projects;
DROP POLICY IF EXISTS "Admin can delete all projects" ON projects;

-- Donations
DROP POLICY IF EXISTS "Admin can manage all donations" ON donations;
```

**2. Crée une fonction helper sécurisée**
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER  -- Contourne RLS
SET search_path = public  -- Protection contre injection
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
```

**3. Recrée les politiques sur `profiles`**
```sql
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin can update all profiles"
  ON profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());
```

**4. Recrée les politiques sur `projects`**
```sql
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
```

**5. Recrée les politiques sur `donations`**
```sql
CREATE POLICY "Admin can manage all donations"
  ON donations FOR ALL
  USING (public.is_admin());
```

## Vérification

```sql
SELECT tablename, policyname, cmd as operation
FROM pg_policies
WHERE policyname LIKE 'Admin%'
ORDER BY tablename, policyname;
```

## Sécurité

| Aspect | Évaluation |
|--------|------------|
| `SECURITY DEFINER` | Nécessaire pour contourner RLS |
| `SET search_path = public` | Protège contre l'injection de search_path |
| `auth.uid()` | ID authentifié, non falsifiable côté client |
| Pas de DELETE | Soft delete uniquement (`is_active = false`) |

## Documentation complète

Voir [docs/RLS_POLICIES.md](../docs/RLS_POLICIES.md) pour la documentation complète de toutes les politiques RLS.
