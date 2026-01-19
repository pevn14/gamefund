# Plan Phase 11b : Profils Créateurs (Avatar & Bio)

**Objectif :** Permettre aux créateurs de personnaliser leur profil avec un avatar et une bio, et afficher la liste des créateurs aux utilisateurs connectés.

---

## Vue d'ensemble

| Section | Tâches | Priorité |
|---------|--------|----------|
| 11b.1 | Mise à jour Supabase (table profiles) | P0 |
| 11b.2 | Service et hooks profil | P0 |
| 11b.3 | Composant édition profil (avatar + bio) | P0 |
| 11b.4 | Intégration dans Dashboard Créateur | P0 |
| 11b.5 | Page Créateurs (/creators) | P0 |
| 11b.6 | Tests et commit | P0 |

---

## 11b.1 Mise à jour Supabase

### Vérification table `profiles`

La table `profiles` existe déjà avec les colonnes :
- `id` (UUID)
- `email` (TEXT)
- `display_name` (TEXT)
- `avatar_url` (TEXT) - Déjà présent
- `bio` (TEXT) - À vérifier si existe
- `role` (user_role)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Script SQL (si nécessaire)

```sql
-- Vérifier et ajouter la colonne bio si elle n'existe pas
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Créer un bucket pour les avatars si pas déjà fait
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques Storage pour avatars
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Fichier à créer

- `supabase/add_avatar_storage.sql` - Script SQL pour le bucket avatars

---

## 11b.2 Service et hooks profil

### profileService.js

Créer `src/services/profileService.js` :

```javascript
// Fonctions à implémenter :
- getProfile(userId) - Récupérer un profil
- updateProfile(userId, { display_name, bio }) - Mettre à jour le profil
- uploadAvatar(userId, file) - Upload avatar vers Storage
- deleteAvatar(userId) - Supprimer l'avatar
- getCreators() - Récupérer tous les créateurs (users avec projets)
```

### Hook useProfile

Créer `src/hooks/useProfile.js` :

```javascript
// Hook pour gérer le profil de l'utilisateur courant
- profile (données du profil)
- loading
- error
- updateProfile(data)
- uploadAvatar(file)
```

---

## 11b.3 Composant édition profil

### ProfileEditor.jsx

Créer `src/components/profile/ProfileEditor.jsx` :

**Fonctionnalités :**
- Upload/modification d'avatar avec prévisualisation
- Champ display_name (input)
- Champ bio (textarea avec limite 500 caractères)
- Bouton "Enregistrer"
- États loading/success/error

**UI :**
```
+─────────────────────────────────────────+
│  +───────+                              │
│  │       │  [Changer l'avatar]          │
│  │ Avatar│  [Supprimer]                 │
│  │       │                              │
│  +───────+                              │
│                                         │
│  Nom d'affichage                        │
│  +─────────────────────────────────+    │
│  │ John Doe                        │    │
│  +─────────────────────────────────+    │
│                                         │
│  Bio                                    │
│  +─────────────────────────────────+    │
│  │ Développeur passionné de jeux   │    │
│  │ indépendants...                 │    │
│  │                                 │    │
│  +─────────────────────────────────+    │
│  245 / 500 caractères                   │
│                                         │
│              [Enregistrer]              │
+─────────────────────────────────────────+
```

### AvatarUpload.jsx

Créer `src/components/profile/AvatarUpload.jsx` :

- Affichage avatar actuel ou placeholder
- Bouton upload (click ou drag & drop)
- Prévisualisation avant upload
- Validation taille (max 2MB) et format (jpg, png, webp)
- Bouton supprimer

---

## 11b.4 Intégration Dashboard Créateur

### Modifier CreatorDashboardPage.jsx

Ajouter une section "Mon Profil" :

```
+─────────────────────────────────────────+
│  Dashboard Créateur                     │
+─────────────────────────────────────────+
│  [Stats existantes...]                  │
+─────────────────────────────────────────+
│  Mon Profil                             │
│  +───────────────────────────────────+  │
│  │  [ProfileEditor component]        │  │
│  +───────────────────────────────────+  │
+─────────────────────────────────────────+
│  [Projets récents...]                   │
+─────────────────────────────────────────+
```

**Alternative :** Créer une page `/profile/edit` dédiée avec un lien depuis le dashboard.

---

## 11b.5 Page Créateurs (/creators)

### Modifier CreatorsPage.jsx

**Logique :**
1. Si non connecté : Message + bouton connexion
2. Si connecté : Afficher la liste des créateurs

**Récupération des créateurs :**
- Requête : profiles qui ont au moins 1 projet (jointure avec projects)
- Ou : profiles avec `role = 'creator'` (si on utilise ce rôle)
- Afficher : avatar, display_name, bio, nombre de projets

### Composant CreatorCard.jsx

Créer `src/components/creators/CreatorCard.jsx` :

```
+─────────────────────────────────────────+
│  +───────+                              │
│  │       │  John Doe                    │
│  │ Avatar│  @john                       │
│  │       │                              │
│  +───────+  3 projets                   │
│                                         │
│  Développeur passionné de jeux          │
│  indépendants depuis 10 ans...          │
│                                         │
│              [Voir les projets]         │
+─────────────────────────────────────────+
```

### CreatorsGrid.jsx

Créer `src/components/creators/CreatorsGrid.jsx` :

- Grille responsive de CreatorCard
- Loading state avec skeletons
- Empty state si aucun créateur

### Page non connecté

```
+─────────────────────────────────────────+
│           Nos Créateurs                 │
│                                         │
│  Connectez-vous pour découvrir les      │
│  créateurs de jeux vidéo qui utilisent  │
│  GameFund pour financer leurs projets.  │
│                                         │
│           [Se connecter]                │
│                                         │
│  Pas encore de compte ?                 │
│           [S'inscrire]                  │
+─────────────────────────────────────────+
```

---

## 11b.6 Fichiers à créer/modifier

### Nouveaux fichiers

| Fichier | Description |
|---------|-------------|
| `supabase/add_avatar_storage.sql` | Script SQL bucket avatars |
| `src/services/profileService.js` | Service CRUD profils |
| `src/hooks/useProfile.js` | Hook gestion profil |
| `src/components/profile/ProfileEditor.jsx` | Formulaire édition profil |
| `src/components/profile/AvatarUpload.jsx` | Composant upload avatar |
| `src/components/creators/CreatorCard.jsx` | Carte créateur |
| `src/components/creators/CreatorsGrid.jsx` | Grille créateurs |

### Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| `src/pages/public/CreatorsPage.jsx` | Logique connecté/non connecté + liste |
| `src/pages/creator/CreatorDashboardPage.jsx` | Ajouter section profil |
| `src/App.jsx` | Route `/profile/edit` si page dédiée |

---

## 11b.7 data-testid à ajouter

```
// ProfileEditor
profile-editor
profile-editor-avatar
profile-editor-name-input
profile-editor-bio-textarea
profile-editor-bio-counter
profile-editor-save-button
profile-editor-success-message
profile-editor-error-message

// AvatarUpload
avatar-upload
avatar-upload-preview
avatar-upload-input
avatar-upload-button
avatar-delete-button

// CreatorCard
creator-card
creator-card-avatar
creator-card-name
creator-card-bio
creator-card-projects-count
creator-card-view-button

// CreatorsPage
creators-page
creators-page-title
creators-page-grid
creators-page-login-message
creators-page-login-button
creators-page-signup-link
```

---

## 11b.8 Étapes d'implémentation

1. **SQL** : Exécuter le script pour bucket avatars
2. **profileService.js** : Créer le service
3. **useProfile.js** : Créer le hook
4. **AvatarUpload.jsx** : Composant upload
5. **ProfileEditor.jsx** : Formulaire complet
6. **CreatorDashboardPage** : Intégrer le ProfileEditor
7. **CreatorCard.jsx** : Carte créateur
8. **CreatorsGrid.jsx** : Grille
9. **CreatorsPage.jsx** : Logique complète
10. **Tests manuels**
11. **Git commit**

---

## 11b.9 Git commit

```bash
git add .
git commit -m "feat: profils créateurs avec avatar et bio (Phase 11b)

- Upload avatar vers Supabase Storage (bucket avatars)
- Édition profil (display_name, bio) dans Dashboard Créateur
- Page /creators avec liste des créateurs (connectés uniquement)
- CreatorCard et CreatorsGrid components
- data-testid pour tests E2E

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Durée estimée : 1h30 - 2h
