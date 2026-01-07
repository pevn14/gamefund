# Fix: display_name ne se charge pas depuis Supabase

## Problème identifié

Lors de la connexion d'un utilisateur, le `display_name` du profil n'est pas récupéré depuis la base de données Supabase. Le composant TestHome.jsx affiche systématiquement "Utilisateur" (valeur par défaut du fallback) au lieu du vrai nom d'affichage.

## Cause racine

Le trigger PostgreSQL `handle_new_user()` doit copier le `display_name` depuis les métadonnées utilisateur (`raw_user_meta_data`) vers la table `profiles` lors de l'inscription. Si le trigger est mal configuré ou absent, le `display_name` ne sera pas sauvegardé.

## Solution : Vérifier et corriger le trigger

### Étape 1 : Vérifier si le trigger existe

1. Aller dans **Supabase Dashboard** > **SQL Editor**
2. Exécuter cette requête pour vérifier le trigger :

```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Résultat attendu :** Une ligne avec le trigger `on_auth_user_created`

Si aucun résultat → Le trigger n'existe pas, passer à l'Étape 2.

### Étape 2 : Vérifier le code du trigger

Exécuter cette requête pour voir le code de la fonction :

```sql
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'handle_new_user';
```

**Code attendu :**

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Points clés à vérifier :**
- ✅ La ligne `COALESCE(NEW.raw_user_meta_data->>'display_name', 'User')` doit être présente
- ✅ Le champ `display_name` doit être dans la liste des colonnes INSERT

### Étape 3 : Recréer le trigger si nécessaire

Si le trigger est absent ou mal configuré, exécuter ce script complet dans **SQL Editor** :

```sql
-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recréer la fonction
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Résultat attendu :** Message "Success. No rows returned"

### Étape 4 : Vérifier les données existantes

Si des utilisateurs ont déjà été créés avant le fix, leur `display_name` sera `NULL` ou `'User'`. Pour vérifier :

```sql
SELECT id, email, display_name, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;
```

**Corriger manuellement un utilisateur existant :**

```sql
-- Remplacer 'UUID-DE-L-UTILISATEUR' et 'NomSouhaité'
UPDATE profiles
SET display_name = 'NomSouhaité'
WHERE id = 'UUID-DE-L-UTILISATEUR';
```

### Étape 5 : Tester avec un nouvel utilisateur

1. Créer un nouveau compte via la page d'inscription avec :
   - **Nom d'affichage** : `TestUser123`
   - **Email** : `testuser@example.com`
   - **Mot de passe** : `password123`

2. Vérifier dans **SQL Editor** :

```sql
SELECT id, email, display_name
FROM profiles
WHERE email = 'testuser@example.com';
```

**Résultat attendu :** `display_name = 'TestUser123'`

3. Se connecter avec ce compte et vérifier que le nom s'affiche correctement dans TestHome.jsx

### Étape 6 : Vérifier le code frontend

Le service d'inscription ([authService.js:10-24](../src/services/authService.js#L10-L24)) envoie bien le `display_name` dans les métadonnées :

```javascript
export async function signUp(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,  // ✅ Bon format
      },
    },
  })
  // ...
}
```

**Important :** Le champ doit être `display_name` (avec underscore) et non `displayName` (camelCase).

## Vérification complète du flux

```
1. User remplit formulaire SignupPage
   └─> displayName="Tester1"

2. authService.signUp(email, password, "Tester1")
   └─> Supabase Auth.signUp({ options: { data: { display_name: "Tester1" }}})

3. Supabase crée utilisateur dans auth.users
   └─> raw_user_meta_data = { "display_name": "Tester1" }

4. Trigger on_auth_user_created se déclenche
   └─> handle_new_user() extrait raw_user_meta_data->>'display_name'
   └─> INSERT dans profiles (id, email, display_name='Tester1', role='user')

5. Frontend (useAuth) charge le profil
   └─> getUserProfile(userId) récupère display_name='Tester1'

6. TestHome.jsx affiche {profile?.display_name}
   └─> Affiche "Tester1" au lieu de "Utilisateur"
```

## Debugging supplémentaire

### Vérifier les métadonnées d'un utilisateur existant

```sql
SELECT
  id,
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'display_name' as extracted_display_name
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**Résultat attendu :** La colonne `extracted_display_name` doit contenir le nom saisi lors de l'inscription.

### Vérifier si le profil existe bien

```sql
-- Remplacer par l'UUID de l'utilisateur
SELECT p.*, u.raw_user_meta_data
FROM profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE p.id = 'UUID-DE-L-UTILISATEUR';
```

## Impact sur les tests E2E

Le test `tests/auth/02-signin-signout.spec.js` vérifie que le `display_name` s'affiche correctement :

```javascript
// tests/auth/02-signin-signout.spec.js:71
await expect(page.getByTestId('user-display-name')).toContainText('Tester1')
```

Ce test échouera tant que le trigger n'est pas corrigé.

## Checklist de résolution

- [ ] Vérifier que le trigger `on_auth_user_created` existe
- [ ] Vérifier que la fonction `handle_new_user()` copie bien `display_name`
- [ ] Recréer le trigger si nécessaire
- [ ] Tester avec un nouveau compte
- [ ] Corriger manuellement les utilisateurs existants si besoin
- [ ] Vérifier que le test E2E passe

## Prochaines étapes après le fix

Une fois le trigger corrigé :

1. Créer un nouveau compte de test avec un `display_name` unique
2. Vérifier que le nom s'affiche dans TestHome.jsx
3. Lancer les tests E2E pour confirmer que tout fonctionne
4. Mettre à jour ce document avec la date du fix

---

**Date de création** : 07 janvier 2026
**Date de résolution** : 07 janvier 2026
**Status** : ✅ RÉSOLU

## Résolution confirmée

Le trigger `handle_new_user()` a été corrigé dans Supabase pour copier correctement le `display_name` depuis `raw_user_meta_data` vers la table `profiles`.

**Vérification effectuée** :
- ✅ Fonction SQL mise à jour avec extraction du `display_name`
- ✅ Nouvel utilisateur créé via l'interface d'inscription
- ✅ `display_name` correctement sauvegardé dans la base de données
- ✅ Nom d'affichage visible dans TestHome.jsx après connexion

Le flux complet d'inscription → sauvegarde → affichage du `display_name` fonctionne maintenant correctement.
