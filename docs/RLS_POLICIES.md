# Documentation des Politiques RLS - GameFund

Ce document décrit toutes les règles Row Level Security (RLS) en place dans la base de données GameFund.

---

## Vue d'ensemble

RLS (Row Level Security) permet de contrôler l'accès aux données au niveau des lignes dans PostgreSQL. Chaque requête est automatiquement filtrée selon les politiques définies.

### Tables protégées

| Table | RLS activé | Nombre de politiques |
|-------|------------|---------------------|
| `profiles` | Oui | 6 |
| `projects` | Oui | 7 |
| `donations` | Oui | 5 |

---

## Fonction utilitaire : `is_admin()`

```sql
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
```

### Pourquoi cette fonction ?

- **Problème** : Vérifier si un utilisateur est admin nécessite de lire la table `profiles`
- **Sans cette fonction** : Les politiques RLS sur `profiles` qui vérifient le rôle admin créent une récursion infinie
- **Solution** : `SECURITY DEFINER` exécute la fonction avec les droits du créateur (superuser), contournant RLS

### Sécurité de la fonction

| Aspect | Description |
|--------|-------------|
| `SECURITY DEFINER` | Nécessaire pour contourner RLS et éviter la récursion |
| `SET search_path = public` | Protège contre les attaques par injection de search_path |
| `STABLE` | Indique que la fonction ne modifie pas les données |
| `auth.uid()` | Utilise l'ID de l'utilisateur authentifié (non falsifiable côté client) |

---

## Politiques par table

### Table `profiles`

| Politique | Opération | Condition | Description |
|-----------|-----------|-----------|-------------|
| Users can view own profile | SELECT | `auth.uid() = id` | Un utilisateur peut voir son propre profil |
| Users can update own profile | UPDATE | `auth.uid() = id` | Un utilisateur peut modifier son propre profil |
| Enable insert for authenticated users | INSERT | `true` | Permet la création de profil (utilisé par le trigger) |
| Active profiles viewable by authenticated users | SELECT | `is_active = true AND auth.role() = 'authenticated'` | Les utilisateurs connectés voient les profils actifs |
| Admin can view all profiles | SELECT | `id = auth.uid() OR public.is_admin()` | Admin voit tous les profils |
| Admin can update all profiles | UPDATE | `id = auth.uid() OR public.is_admin()` | Admin peut modifier tous les profils |

**Note de sécurité** : Il n'y a pas de politique DELETE sur `profiles`. La désactivation se fait via `is_active = false` (soft delete) pour préserver l'intégrité référentielle.

---

### Table `projects`

| Politique | Opération | Condition | Description |
|-----------|-----------|-----------|-------------|
| Active projects viewable by everyone | SELECT | `status = 'active'` | Tout le monde voit les projets actifs |
| Users can view own projects | SELECT | `auth.uid() = creator_id` | Un créateur voit tous ses projets (même drafts) |
| Authenticated users can create projects | INSERT | `auth.uid() = creator_id` | Utilisateurs connectés peuvent créer des projets |
| Creators can update own projects | UPDATE | `auth.uid() = creator_id` | Un créateur peut modifier ses projets |
| Creators can delete own draft projects without donations | DELETE | `auth.uid() = creator_id AND status = 'draft' AND NOT EXISTS (donations)` | Suppression limitée aux drafts sans dons |
| Admin can view all projects | SELECT | `public.is_admin()` | Admin voit tous les projets |
| Admin can update all projects | UPDATE | `public.is_admin()` | Admin peut modifier tous les projets |
| Admin can delete all projects | DELETE | `public.is_admin()` | Admin peut supprimer tous les projets |

---

### Table `donations`

| Politique | Opération | Condition | Description |
|-----------|-----------|-----------|-------------|
| Donations viewable by everyone | SELECT | `true` | Transparence : tous les dons sont publics |
| Authenticated users can donate | INSERT | `auth.uid() = donor_id AND project.status = 'active'` | Dons uniquement sur projets actifs |
| Donors can update own donations | UPDATE | `auth.uid() = donor_id AND project.status = 'active'` | Modification possible tant que projet actif |
| Donors can delete own donations | DELETE | `auth.uid() = donor_id AND project.status = 'active'` | Annulation possible tant que projet actif |
| Admin can manage all donations | ALL | `public.is_admin()` | Admin a tous les droits |

---

## Politiques Storage (bucket `project-images`)

| Politique | Opération | Condition |
|-----------|-----------|-----------|
| Public can view project images | SELECT | `bucket_id = 'project-images'` |
| Authenticated users can upload images | INSERT | `bucket_id = 'project-images' AND auth.role() = 'authenticated'` |
| Authenticated users can delete images | DELETE | `bucket_id = 'project-images' AND auth.role() = 'authenticated'` |
| Authenticated users can update images | UPDATE | `bucket_id = 'project-images' AND auth.role() = 'authenticated'` |

---

## Matrice des permissions

### Utilisateur non authentifié (visiteur)

| Action | profiles | projects | donations |
|--------|----------|----------|-----------|
| Voir | Non | Actifs seulement | Oui |
| Créer | Non | Non | Non |
| Modifier | Non | Non | Non |
| Supprimer | Non | Non | Non |

### Utilisateur authentifié (user)

| Action | profiles | projects | donations |
|--------|----------|----------|-----------|
| Voir | Sien + actifs | Actifs + siens | Oui |
| Créer | Via trigger | Oui (comme créateur) | Oui (sur projets actifs) |
| Modifier | Sien | Siens | Siens (projets actifs) |
| Supprimer | Non | Drafts sans dons | Siens (projets actifs) |

### Administrateur (admin)

| Action | profiles | projects | donations |
|--------|----------|----------|-----------|
| Voir | Tous | Tous | Tous |
| Créer | Via trigger | Oui | Oui |
| Modifier | Tous | Tous | Tous |
| Supprimer | Non (soft delete) | Tous | Tous |

---

## Vérification des politiques

Pour voir toutes les politiques actuellement en place :

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  qual as using_clause,
  with_check as check_clause
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Pour vérifier si RLS est activé sur les tables :

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

---

## Recommandations de sécurité

### Actuellement en place

- RLS activé sur toutes les tables principales
- Fonction `is_admin()` sécurisée avec `SECURITY DEFINER`
- Pas de suppression physique des profils (soft delete)
- Dons protégés (modifications uniquement sur projets actifs)

### Améliorations futures recommandées

1. **Ajouter du rate limiting** sur les créations de projets et dons

2. **Auditer les accès admin** avec une table de logs

3. **Expiration des sessions** pour les comptes admin

---

## Historique des modifications

| Date | Modification |
|------|--------------|
| 2026-01-27 | **Correctif critique** : Ajout des politiques UPDATE et DELETE manquantes sur `donations` pour les donateurs. Avant ce fix, les appels `.update()` et `.delete()` réussissaient silencieusement sans effet (0 lignes affectées) |
| 2026-01-16 | Migration de toutes les politiques admin (`profiles`, `projects`, `donations`) vers `public.is_admin()` |
| 2026-01-16 | Création de `is_admin()` pour éviter la récursion infinie sur `profiles` |
| Initial | Création des politiques de base |

---

## Références

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
