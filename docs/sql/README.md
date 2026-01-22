# Scripts SQL - GameFund

Ce dossier contient les scripts SQL de migration et configuration pour Supabase.

---

## 📁 Structure

```
docs/sql/
├── README.md                    # Ce fichier
├── README_ADMIN_POLICIES.md     # Documentation politiques RLS admin
└── migrations/
    ├── add_admin_policies.sql   # Migration : politiques admin avec is_admin()
    └── add_avatar_storage.sql   # Migration : bucket avatars + colonne bio
```

---

## 📜 Migrations Disponibles

### 1. add_admin_policies.sql
**Date** : 16 janvier 2026
**Description** : Correction des politiques RLS admin pour éviter les récursions infinies

**Problèmes corrigés** :
- ❌ Erreur 406 (Not Acceptable) lors de la mise à jour des profils
- ❌ Erreur 500 (Infinite recursion) dans les politiques RLS

**Solution** :
- Crée la fonction `is_admin()` avec `SECURITY DEFINER`
- Recrée les politiques sur `profiles`, `projects`, `donations`

**Tables affectées** :
- `profiles`
- `projects`
- `donations`

**Usage** :
```sql
-- Dans Supabase SQL Editor
-- Copier-coller le contenu du fichier et exécuter
```

---

### 2. add_avatar_storage.sql
**Date** : 18 janvier 2026
**Description** : Configuration du storage pour les avatars et profils créateurs

**Fonctionnalités ajoutées** :
- ✅ Bucket storage `avatars` (public)
- ✅ Colonne `bio` dans la table `profiles`
- ✅ Politiques RLS pour le storage

**Politiques créées** :
- Tout le monde peut voir les avatars (SELECT)
- Utilisateurs authentifiés peuvent uploader (INSERT)
- Utilisateurs peuvent modifier leur propre avatar (UPDATE)
- Utilisateurs peuvent supprimer leur propre avatar (DELETE)

**Usage** :
```sql
-- Dans Supabase SQL Editor
-- Copier-coller le contenu du fichier et exécuter
```

---

## 🚀 Comment Appliquer une Migration

### Via Supabase Dashboard
1. Se connecter à [Supabase Dashboard](https://app.supabase.com)
2. Sélectionner le projet GameFund
3. Aller dans **SQL Editor**
4. Copier-coller le contenu du fichier SQL
5. Cliquer sur **Run** (ou Ctrl+Enter)
6. Vérifier les résultats

### Via Supabase CLI (si configuré)
```bash
# Depuis le dossier du projet
supabase db push

# Ou exécuter un fichier spécifique
psql $DATABASE_URL -f docs/sql/migrations/add_admin_policies.sql
```

---

## ⚠️ Notes Importantes

### Ordre d'Exécution
Si vous recréez la base de données, exécuter dans cet ordre :
1. `add_admin_policies.sql` (fonction is_admin nécessaire)
2. `add_avatar_storage.sql` (dépend des profils existants)

### Idempotence
Les scripts sont **idempotents** : ils peuvent être exécutés plusieurs fois sans erreur grâce aux clauses :
- `CREATE OR REPLACE FUNCTION`
- `DROP POLICY IF EXISTS`
- `ON CONFLICT DO NOTHING`
- `ADD COLUMN IF NOT EXISTS`

### Sécurité
- ✅ Fonction `is_admin()` utilise `SECURITY DEFINER` (nécessaire mais sécurisé)
- ✅ Protection contre injection avec `SET search_path = public`
- ✅ Utilise `auth.uid()` (non falsifiable côté client)
- ✅ Pas de DELETE direct (soft delete avec `is_active = false`)

---

## 📚 Documentation Complète

Pour plus de détails sur les politiques RLS :
- [README_ADMIN_POLICIES.md](./README_ADMIN_POLICIES.md) - Explication détaillée des problèmes et solutions
- [../RLS_POLICIES.md](../RLS_POLICIES.md) - Documentation complète de toutes les politiques (si existe)

---

## 🔍 Vérification

### Vérifier les politiques admin
```sql
SELECT tablename, policyname, cmd as operation
FROM pg_policies
WHERE policyname LIKE 'Admin%'
ORDER BY tablename, policyname;
```

### Vérifier le bucket avatars
```sql
SELECT * FROM storage.buckets WHERE id = 'avatars';
```

### Vérifier les politiques storage
```sql
SELECT policyname, cmd as operation
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%avatar%'
ORDER BY policyname;
```

### Vérifier la colonne bio
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'bio';
```

---

**Maintenu par** : Équipe Dev GameFund
**Dernière mise à jour** : 21 janvier 2026
