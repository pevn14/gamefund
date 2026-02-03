# Documentation API Supabase

Ce document couvre le déploiement, l'utilisation et la référence de l'API (Edge Functions) du projet GameFund.

## 1. Déploiement

Pour mettre en ligne cette API sur votre projet Supabase, suivez ces étapes avec la CLI Supabase.

### Étape 1 : Connexion
```bash
npx supabase login
```

### Étape 2 : Lier le projet (Link)
```bash
# Remplacer <PROJECT_REF> par votre Reference ID (ex: yenatijeznplmvvymats)
npx supabase link --project-ref <PROJECT_REF>
```

### Étape 3 : Configurer les Secrets

1.  **GAMEFUND_API_KEY** (Votre clé privée pour autoriser l'application) :
    Choisissez une clé (aléatoire ou `sb_secret_...`) :
    ```bash
    npx supabase secrets set GAMEFUND_API_KEY=<VOTRE_SECRET>
    ```

2.  **PUBLISHABLE_KEY** (Nécessaire pour le contexte anonyme) :
    Copiez votre `sb_publishable_...` (disponible dans votre `.env` local ou dashboard) :
    ```bash
    # Utilisez la variable PUBLISHABLE_KEY (sans préfixe SUPABASE_)
    npx supabase secrets set PUBLISHABLE_KEY=sb_publishable_...
    ```

### Étape 4 : Déployer (Deploy)
```bash
npx supabase functions deploy
```

---

## 2. Utilisation (Client)

### Base URL
L'URL de base dépend de votre projet :
`https://<PROJECT_REF>.supabase.co/functions/v1`

### Authentification
Cette API est protégée par une clé personnalisée.

**1. Accès API (Obligatoire)**
Vous devez inclure le header `x-api-key` dans chaque requête.
```
x-api-key: <VOTRE_SECRET>
```

**2. Identité Utilisateur (Optionnel)**
*   **Absence de header** : Vous serez authentifié comme "Anonyme" (utilisant la `PUBLISHABLE_KEY`).
*   **Présence de header** : Vous serez authentifié comme l'utilisateur du token.

```
Authorization: Bearer <USER_JWT_TOKEN>
```

---

## 3. Référence des Endpoints

### Projects (`/projects`)

#### Lister tous les projets
- **URL** : `/projects`
- **Method** : `GET`
- **Exemple (Anonyme)** :
  ```bash
  curl -i \
    -H "x-api-key: <VOTRE_SECRET>" \
    'https://<PROJECT_REF>.supabase.co/functions/v1/projects'
  ```
- **Exemple (Authentifié)** :
  ```bash
  curl -i \
    -H "x-api-key: <VOTRE_SECRET>" \
    -H "Authorization: Bearer <USER_JWT>" \
    'https://<PROJECT_REF>.supabase.co/functions/v1/projects'
  ```

#### Obtenir un projet spécifique
- **URL** : `/projects?id=<PROJECT_ID>`
- **Method** : `GET`
- **Exemple** :
  ```bash
  curl -i \
    -H "x-api-key: <VOTRE_SECRET>" \
    'https://<PROJECT_REF>.supabase.co/functions/v1/projects?id=123-456'
  ```

### Donations (`/donations`)

#### Lister les donations d'un projet
- **URL** : `/donations?projectId=<PROJECT_ID>`
- **Method** : `GET`
- **Exemple** :
  ```bash
  curl -i \
    -H "x-api-key: <VOTRE_SECRET>" \
    'https://<PROJECT_REF>.supabase.co/functions/v1/donations?projectId=123-456'
  ```
