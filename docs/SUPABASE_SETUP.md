# Guide de Configuration Supabase - GameFund

Ce document contient toutes les étapes nécessaires pour configurer Supabase pour le projet GameFund.

---

## 1. Créer un projet Supabase

### 1.1 Créer un compte
1. Aller sur [https://supabase.com](https://supabase.com)
2. Cliquer sur "Start your project"
3. S'inscrire avec email/GitHub

### 1.2 Créer un nouveau projet
1. Dans le dashboard, cliquer sur "New project"
2. Remplir les informations :
   - **Name** : `gamefund` (ou le nom de ton choix)
   - **Database Password** : Générer un mot de passe fort et le **sauvegarder**
   - **Region** : Choisir la région la plus proche (ex: Europe West pour la France)
   - **Pricing Plan** : Free (suffisant pour le MVP)
3. Cliquer sur "Create new project"
4. Attendre 2-3 minutes que le projet soit créé

### 1.3 Récupérer les credentials
Une fois le projet créé :
1. Aller dans **Settings** > **API**
2. Copier et sauvegarder :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** key : `eyJhbGc...` (commence par eyJ)
   
**⚠️ Important** : Ne JAMAIS partager la `service_role` key publiquement !

---

## 2. Créer le schéma de base de données

### 2.1 Accéder au SQL Editor
1. Dans le menu de gauche, cliquer sur **SQL Editor**
2. Cliquer sur **New query**

### 2.2 Exécuter le script SQL
Copier-coller le script suivant et cliquer sur **Run** (ou Ctrl+Enter) :

```sql
-- =====================================================
-- EXTENSIONS & TYPES
-- =====================================================

-- Extension pour générer des UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Type énuméré pour les rôles utilisateurs
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Type énuméré pour les statuts de projet
CREATE TYPE project_status AS ENUM ('draft', 'active', 'completed', 'failed', 'cancelled', 'suspended');

-- =====================================================
-- TABLES
-- =====================================================

-- Table: profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Profils utilisateurs - tous peuvent créer ET donner';
COMMENT ON COLUMN profiles.role IS 'user (peut tout faire) ou admin (privilèges supplémentaires)';

-- Table: projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  description TEXT NOT NULL CHECK (char_length(description) >= 10),
  image_url TEXT NOT NULL,
  goal_amount NUMERIC(10, 2) NOT NULL CHECK (goal_amount > 0),
  deadline TIMESTAMPTZ NOT NULL,
  status project_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_deadline_future CHECK (
    (status = 'draft' AND deadline > created_at) OR 
    status != 'draft'
  )
);

COMMENT ON TABLE projects IS 'Projets de jeux vidéo avec campagnes de financement';
COMMENT ON COLUMN projects.status IS 'draft, active, completed, failed, cancelled, suspended';

-- Table: donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  message TEXT CHECK (char_length(message) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE donations IS 'Dons des utilisateurs vers les projets';

-- =====================================================
-- INDEX
-- =====================================================

CREATE INDEX idx_projects_creator ON projects(creator_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deadline ON projects(deadline);
CREATE INDEX idx_projects_status_deadline ON projects(status, deadline);

CREATE INDEX idx_donations_project ON donations(project_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_project_amount ON donations(project_id, amount);

-- =====================================================
-- FONCTIONS
-- =====================================================

-- Calcul du montant total collecté
CREATE OR REPLACE FUNCTION get_project_total_collected(project_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM donations
  WHERE project_id = project_uuid;
$$ LANGUAGE SQL STABLE;

-- Nombre de donateurs uniques
CREATE OR REPLACE FUNCTION get_project_donors_count(project_uuid UUID)
RETURNS BIGINT AS $$
  SELECT COUNT(DISTINCT donor_id)
  FROM donations
  WHERE project_id = project_uuid;
$$ LANGUAGE SQL STABLE;

-- Pourcentage de complétion
CREATE OR REPLACE FUNCTION get_project_completion_percentage(project_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_collected NUMERIC;
  goal NUMERIC;
BEGIN
  SELECT goal_amount INTO goal FROM projects WHERE id = project_uuid;
  IF goal IS NULL OR goal = 0 THEN RETURN 0; END IF;
  
  SELECT get_project_total_collected(project_uuid) INTO total_collected;
  RETURN ROUND((total_collected / goal) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE;

-- Auto-complétion des projets
CREATE OR REPLACE FUNCTION auto_complete_projects()
RETURNS TABLE(updated_count BIGINT) AS $$
DECLARE
  count_updated BIGINT;
BEGIN
  WITH updated AS (
    UPDATE projects
    SET status = CASE
      WHEN get_project_total_collected(id) >= goal_amount THEN 'completed'
      ELSE 'failed'
    END
    WHERE status = 'active'
    AND deadline < NOW()
    RETURNING id
  )
  SELECT COUNT(*) INTO count_updated FROM updated;
  
  RETURN QUERY SELECT count_updated;
END;
$$ LANGUAGE plpgsql;

-- Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER donations_updated_at 
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-création du profil à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- === POLICIES: PROFILES ===

CREATE POLICY "Profiles viewable by everyone"
  ON profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update all"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- === POLICIES: PROJECTS ===

CREATE POLICY "Active projects viewable by everyone"
  ON projects FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own draft projects without donations"
  ON projects FOR DELETE
  USING (
    auth.uid() = creator_id
    AND status = 'draft'
    AND NOT EXISTS (SELECT 1 FROM donations WHERE project_id = projects.id)
  );

CREATE POLICY "Admin can view all projects"
  ON projects FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update all projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete all projects"
  ON projects FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- === POLICIES: DONATIONS ===

CREATE POLICY "Donations viewable by everyone"
  ON donations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can donate"
  ON donations FOR INSERT
  WITH CHECK (
    auth.uid() = donor_id
    AND EXISTS (SELECT 1 FROM projects WHERE id = project_id AND status = 'active')
  );

CREATE POLICY "Donors can update own donations"
  ON donations FOR UPDATE
  USING (
    auth.uid() = donor_id
    AND EXISTS (SELECT 1 FROM projects WHERE id = project_id AND status = 'active')
  )
  WITH CHECK (
    auth.uid() = donor_id
    AND EXISTS (SELECT 1 FROM projects WHERE id = project_id AND status = 'active')
  );

CREATE POLICY "Donors can delete own donations"
  ON donations FOR DELETE
  USING (
    auth.uid() = donor_id
    AND EXISTS (SELECT 1 FROM projects WHERE id = project_id AND status = 'active')
  );

CREATE POLICY "Admin can manage all donations"
  ON donations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 2.3 Vérifier la création
1. Aller dans **Table Editor** (menu de gauche)
2. Vérifier que 3 tables sont créées : `profiles`, `projects`, `donations`
3. Vérifier qu'un petit cadenas fermé apparaît à côté de chaque table (RLS activé)

---

## 3. Configurer le Storage (images)

### 3.1 Créer un bucket public
1. Aller dans **Storage** (menu de gauche)
2. Cliquer sur **Create a new bucket**
3. Remplir :
   - **Name** : `project-images`
   - **Public bucket** : ✅ Cocher (les images seront publiques)
4. Cliquer sur **Create bucket**

### 3.2 Configurer les policies du bucket
1. Cliquer sur le bucket `project-images`
2. Aller dans l'onglet **Policies**
3. Cliquer sur **New policy** (ou créer via SQL Editor)

**Policy 1 : Tout le monde peut lire les images**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');
```

**Policy 2 : Utilisateurs authentifiés peuvent uploader**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images'
  AND auth.role() = 'authenticated'
);
```

**Policy 3 : Utilisateurs peuvent supprimer leurs propres images**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4 : Admin peut tout supprimer**
```sql
CREATE POLICY "Admin can delete all images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 4. Créer un utilisateur admin

### 4.1 Méthode 1 : Via l'interface (recommandé)
1. Aller dans **Authentication** > **Users**
2. Cliquer sur **Add user** > **Create new user**
3. Remplir :
   - **Email** : `admin@gamefund.local` (ou ton email)
   - **Password** : Générer un mot de passe fort
   - **Auto Confirm User** : ✅ Cocher
4. Cliquer sur **Create user**
5. Copier l'UUID de l'utilisateur créé

### 4.2 Promouvoir l'utilisateur en admin
1. Aller dans **SQL Editor**
2. Exécuter la requête suivante (remplacer `UUID_DE_TON_USER`) :

```sql
-- Remplacer 'xxx-xxx-xxx' par l'UUID copié à l'étape précédente
UPDATE profiles
SET role = 'admin'
WHERE id = 'xxx-xxx-xxx-xxx-xxx';
```

### 4.3 Vérifier
```sql
SELECT id, email, role FROM profiles WHERE role = 'admin';
```

Tu devrais voir ton utilisateur admin.

---

## 5. Tester les RLS policies

### 5.1 Test en tant que visiteur non connecté
Dans le **SQL Editor**, exécuter :

```sql
-- Simuler un visiteur non authentifié
SET request.jwt.claims = '{}';

-- Doit retourner uniquement les projets actifs
SELECT * FROM projects;

-- Doit retourner uniquement les profils actifs
SELECT * FROM profiles WHERE is_active = true;
```

### 5.2 Test en tant qu'utilisateur authentifié
```sql
-- Simuler un utilisateur avec UUID spécifique
SET request.jwt.claim.sub = 'UUID-DU-USER';

-- Doit retourner ses propres projets (tous statuts)
SELECT * FROM projects WHERE creator_id = 'UUID-DU-USER';
```

### 5.3 Test en tant qu'admin
```sql
-- Simuler un admin
SET request.jwt.claim.sub = 'UUID-DE-L-ADMIN';

-- Doit retourner TOUS les projets
SELECT * FROM projects;
```

---

## 6. Ajouter des données de test (optionnel)

### 6.1 Créer quelques utilisateurs de test
Via **Authentication** > **Users** > **Add user**, créer :
- `creator1@test.com`
- `creator2@test.com`
- `donor1@test.com`
- `donor2@test.com`

### 6.2 Insérer des projets de test
Dans **SQL Editor** :

```sql
-- Remplacer 'UUID-CREATOR-1' par l'UUID d'un créateur
INSERT INTO projects (creator_id, title, description, image_url, goal_amount, deadline, status)
VALUES 
  (
    'UUID-CREATOR-1',
    'Mystic Quest: The Awakening',
    'Un RPG épique mêlant magie et technologie dans un monde post-apocalyptique.',
    'https://picsum.photos/seed/game1/800/400',
    50000,
    NOW() + INTERVAL '30 days',
    'active'
  ),
  (
    'UUID-CREATOR-1',
    'Cyber Ninja Chronicles',
    'Un jeu d''action-platformer cyberpunk.',
    'https://picsum.photos/seed/game2/800/400',
    30000,
    NOW() + INTERVAL '45 days',
    'active'
  );
```

### 6.3 Insérer des donations de test
```sql
-- Remplacer les UUIDs
INSERT INTO donations (project_id, donor_id, amount, message)
VALUES 
  (
    'UUID-DU-PROJET',
    'UUID-DU-DONATEUR',
    500,
    'Hâte de jouer à ce jeu !'
  );
```

---

## 7. Configuration de l'authentification

### 7.1 Configurer les URLs de redirection
1. Aller dans **Authentication** > **URL Configuration**
2. Ajouter les URLs autorisées :
   - **Site URL** : `http://localhost:5173` (dev)
   - **Redirect URLs** : 
     - `http://localhost:5173/**`
     - `https://ton-domaine.vercel.app/**` (prod, à ajouter plus tard)

### 7.2 Configurer les emails (optionnel pour MVP)
1. Aller dans **Authentication** > **Email Templates**
2. Personnaliser les templates si souhaité (confirmation, reset password, etc.)

---

## 8. Variables d'environnement pour le projet React

Créer un fichier `.env` à la racine du projet React :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_ENV=development
VITE_APP_NAME=GameFund
```

**⚠️ Important** :
- Remplacer les valeurs par tes vraies credentials Supabase
- Ne JAMAIS commit le `.env` dans Git (ajouter à `.gitignore`)

---

## 9. Requêtes SQL utiles pour la maintenance

### 9.1 Voir toutes les tables
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### 9.2 Voir tous les types ENUM
```sql
SELECT * FROM pg_type WHERE typtype = 'e';
```

### 9.3 Voir toutes les fonctions
```sql
SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace;
```

### 9.4 Voir les statistiques globales
```sql
-- Nombre d'utilisateurs
SELECT COUNT(*) as total_users FROM profiles;

-- Nombre de projets par statut
SELECT status, COUNT(*) as count
FROM projects
GROUP BY status;

-- Montant total collecté
SELECT SUM(amount) as total_collected FROM donations;
```

### 9.5 Compléter manuellement les projets échus
```sql
SELECT auto_complete_projects();
```

### 9.6 Voir les projets avec leurs stats
```sql
SELECT 
  p.id,
  p.title,
  p.status,
  p.goal_amount,
  get_project_total_collected(p.id) as total_collected,
  get_project_donors_count(p.id) as donors_count,
  get_project_completion_percentage(p.id) as completion_pct,
  p.deadline
FROM projects p
ORDER BY p.created_at DESC;
```

---

## 10. Checklist finale

Avant de commencer le développement, vérifier que :

**Base de données :**
- [ ] Les 3 tables sont créées (`profiles`, `projects`, `donations`)
- [ ] Les types ENUM existent (`user_role`, `project_status`)
- [ ] Les index sont créés
- [ ] Les fonctions sont disponibles
- [ ] Les triggers sont actifs
- [ ] RLS est activé sur les 3 tables (cadenas fermé)

**Storage :**
- [ ] Bucket `project-images` créé
- [ ] Bucket configuré en public
- [ ] Policies du bucket configurées

**Auth :**
- [ ] URLs de redirection configurées
- [ ] Un utilisateur admin existe
- [ ] Profil admin créé avec `role = 'admin'`

**Credentials :**
- [ ] `VITE_SUPABASE_URL` récupéré
- [ ] `VITE_SUPABASE_ANON_KEY` récupéré
- [ ] Fichier `.env` créé dans le projet React

**Tests (optionnel) :**
- [ ] Données de test insérées
- [ ] RLS policies testées manuellement

---

## 11. Troubleshooting

### Problème : "relation does not exist"
**Solution** : Vérifier que le schéma SQL a bien été exécuté. Aller dans **Table Editor** pour voir si les tables existent.

### Problème : "permission denied for table"
**Solution** : Vérifier que RLS est activé et que les policies sont créées. Exécuter :
```sql
SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'projects', 'donations');
```

### Problème : "insert or update on table violates foreign key constraint"
**Solution** : Vérifier que l'utilisateur existe dans `auth.users` avant d'insérer dans `profiles`.

### Problème : Le trigger de création de profil ne fonctionne pas
**Solution** : Vérifier que le trigger existe :
```sql
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

Si absent, recréer le trigger (voir section 2.2).

### Problème : Images ne s'uploadent pas
**Solution** : Vérifier les policies du bucket Storage. S'assurer que l'utilisateur est authentifié.

---

## 12. Ressources supplémentaires

**Documentation Supabase :**
- [Quickstart Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

**Outils utiles :**
- [Supabase CLI](https://supabase.com/docs/guides/cli) : Pour gérer migrations
- [Database.design](https://database.design/) : Visualiser le schéma
- [SQL Formatter](https://sqlformat.org/) : Formater les requêtes

---

**Configuration Supabase terminée ! 🎉**

Tu peux maintenant passer au développement frontend avec Claude Code.
