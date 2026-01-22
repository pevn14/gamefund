# GameFund : Développer une plateforme de crowdfunding avec Claude Code et Supabase

> **Repository GitHub** : [https://github.com/pevn14/gamefund](https://github.com/pevn14/gamefund)

## Partie 1 : Le projet et la méthodologie

### Introduction

**GameFund** est un projet d'étude personnel dont l'objectif principal est d'explorer le développement assisté par IA avec **Claude Code**, tout en montant en compétences sur une stack moderne React/Supabase.

Ce n'est pas un projet destiné à la production, mais un terrain d'apprentissage pour :
- Expérimenter une méthodologie de développement avec l'IA
- Maîtriser une stack frontend moderne (Vite + React)
- Découvrir Supabase comme alternative Backend-as-a-Service
- Mettre en place des tests E2E avec Playwright (dans un projet parallèle)

---

### Le concept : une plateforme de crowdfunding pour jeux vidéo

GameFund simule une plateforme de financement participatif dédiée aux jeux vidéo indépendants. Les fonctionnalités principales incluent :

- **Authentification** : inscription, connexion, gestion de profil
- **Gestion de projets** : création, édition, publication de campagnes de crowdfunding
- **Système de dons** : contribution aux projets avec suivi des montants
- **Dashboards** : tableaux de bord créateur et donateur
- **Administration** : gestion des utilisateurs et projets (rôle admin)

---

### Méthodologie : PRD + Développement itératif par phases

#### 1. Product Requirements Document (PRD)

Avant d'écrire la moindre ligne de code, j'ai rédigé un **PRD complet** en collaboration avec **Claude** (via l'interface web claude.ai). Cette phase de conception a permis de définir :
- La vision du produit
- Les user stories par rôle (visiteur, donateur, créateur, admin)
- Les écrans et composants UI nécessaires
- Le modèle de données
- Les règles métier

La rédaction du PRD avec Claude a été un exercice intéressant : l'IA aide à structurer les idées, à ne pas oublier de cas d'usage, et à formaliser les exigences de manière professionnelle. Le résultat est un document de plusieurs pages qui sert ensuite de **contrat** avec Claude Code : l'IA peut s'y référer pour comprendre le contexte et prendre des décisions cohérentes.

#### 2. Développement par phases

Le projet a été découpé en **12 phases** progressives :

| Phase | Description |
|-------|-------------|
| 1-2 | Setup projet + Design System (composants UI) |
| 3-4 | Authentification + Intégration Supabase |
| 5-6 | CRUD Projets + Affichage public |
| 7-8 | Système de dons + Dashboard donateur |
| 9-10 | Dashboard créateur + Gestion projets |
| 11-12 | Administration + Polish final |

Chaque phase est **autonome** et livre des fonctionnalités testables. Cette approche itérative permet :
- De valider régulièrement l'avancement
- De corriger rapidement les erreurs de conception
- De garder Claude Code focalisé sur un périmètre limité

#### 3. Collaboration avec Claude Code

Le workflow type d'une session :

```
1. Rappeler le contexte (phase en cours, fichiers concernés)
2. Décrire la fonctionnalité à implémenter
3. Laisser Claude proposer une approche
4. Itérer sur le code généré
5. Tester manuellement
6. Committer les changements
```

**Points clés** :
- Toujours fournir suffisamment de contexte
- Valider chaque changement avant de passer au suivant
- Ne pas hésiter à challenger les propositions de l'IA
- Documenter les décisions importantes

---

### Stack technique

#### Frontend
- **Vite 6** : bundler ultra-rapide, HMR instantané
- **React 19** : dernière version avec les nouveaux hooks
- **Tailwind CSS 4** : utility-first CSS, configuration minimale
- **Lucide React** : icônes SVG légères et cohérentes

#### Backend (Supabase)
- **PostgreSQL** : base de données relationnelle
- **Auth** : authentification email/password intégrée
- **Storage** : hébergement d'images (avatars, projets)
- **RLS** : Row Level Security pour la sécurité des données

#### Outils
- **Claude Code** : assistant IA pour le développement
- **Git** : versioning avec commits atomiques
- **Playwright** : tests E2E (projet parallèle)

---

### Architecture du projet

```
src/
├── components/
│   ├── ui/          # Design System (Button, Card, Input...)
│   ├── layout/      # MainLayout, Container, Header, Footer
│   ├── auth/        # Composants d'authentification
│   └── donations/   # Composants liés aux dons
├── pages/
│   ├── public/      # Pages accessibles à tous
│   ├── creator/     # Dashboard et gestion créateur
│   └── Admin*.jsx   # Pages d'administration
├── services/        # Couche d'accès aux données (Supabase)
├── hooks/           # Hooks React personnalisés
└── App.jsx          # Routing principal
```

---

### Tests E2E avec Playwright

Dans un **projet parallèle**, j'ai mis en place une suite de tests E2E couvrant :
- L'authentification (login, signup, logout)
- La navigation entre pages
- La création et édition de projets
- Le processus de don

**Approche adoptée** :
- Utilisation systématique de `data-testid` pour les sélecteurs
- Organisation des tests par famille fonctionnelle
- Documentation des test IDs dans un fichier CSV de référence

Le taux de couverture actuel : **97%** des éléments documentés sont implémentés (178/183 data-testid).

---

### Retours d'expérience

#### Ce qui fonctionne bien
- Claude Code excelle pour le **boilerplate** et les patterns répétitifs
- L'IA comprend bien les conventions React et Supabase
- Les corrections de bugs sont souvent rapides et précises
- La documentation générée est de qualité

#### Points de vigilance
- Toujours **relire** le code généré avant de l'accepter
- L'IA peut "oublier" des détails entre les sessions longues
- Les mappings de données (frontend ↔ base) nécessitent une attention particulière
- Prévoir du temps pour les **edge cases** et la validation

#### Conseils
1. **Investir dans le PRD** : plus il est précis, meilleurs sont les résultats
2. **Découper finement** : des tâches petites = moins d'erreurs
3. **Tester souvent** : valider chaque fonctionnalité avant de continuer
4. **Documenter** : noter les décisions pour les sessions futures

---

### Conclusion

GameFund démontre qu'il est possible de développer une application complète en collaborant avec une IA. La clé du succès réside dans :
- Une **préparation solide** (PRD, découpage en phases)
- Une **méthodologie rigoureuse** (itérations courtes, validation continue)
- Un **esprit critique** face aux propositions de l'IA

Ce projet m'a permis de monter significativement en compétences sur React, Supabase et les bonnes pratiques de développement moderne.

---

## Partie 2 : Deep dive sur Supabase et les politiques RLS

### Qu'est-ce que Supabase ?

**Supabase** se présente comme une alternative open-source à Firebase. C'est un Backend-as-a-Service (BaaS) qui fournit :

- Une **base de données PostgreSQL** managée
- Un système d'**authentification** complet
- Du **stockage de fichiers** (Storage)
- Des **fonctions Edge** (serverless)
- Des **webhooks** et abonnements temps réel

L'avantage principal : bénéficier de la puissance de PostgreSQL (requêtes SQL, contraintes, fonctions) avec une API REST/GraphQL générée automatiquement.

---

### Architecture de GameFund avec Supabase

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend React                        │
│                   (Vite + Tailwind)                     │
└─────────────────────┬───────────────────────────────────┘
                      │ @supabase/supabase-js
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Auth     │  │  Database   │  │   Storage   │     │
│  │  (email/    │  │ (PostgreSQL)│  │  (S3-like)  │     │
│  │  password)  │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                          │                              │
│                    ┌─────┴─────┐                        │
│                    │    RLS    │                        │
│                    │ Policies  │                        │
│                    └───────────┘                        │
└─────────────────────────────────────────────────────────┘
```

---

### Le modèle de données

GameFund utilise 3 tables principales :

#### Table `profiles`
Étend les données utilisateur de Supabase Auth :
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',  -- 'user' ou 'admin'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table `projects`
Les campagnes de crowdfunding :
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  goal_amount NUMERIC NOT NULL,
  deadline DATE,
  status TEXT DEFAULT 'draft',  -- draft, active, completed, failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table `donations`
Les contributions aux projets :
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES profiles(id),
  project_id UUID REFERENCES projects(id),
  amount NUMERIC NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Comprendre les politiques RLS (Row Level Security)

#### Le problème de sécurité

Par défaut, si on expose une API REST sur une base de données, **tout le monde peut tout lire et tout modifier**. C'est évidemment inacceptable.

Solutions classiques :
- Écrire un backend qui filtre les accès (Node.js, Django...)
- Utiliser des règles de sécurité côté client (Firebase Rules)

Supabase propose une troisième voie : **RLS** (Row Level Security), une fonctionnalité native de PostgreSQL.

#### Le principe de RLS

RLS permet de définir des **politiques** (policies) directement dans la base de données. Chaque politique spécifie :
- **Qui** peut accéder (utilisateur authentifié, admin, propriétaire...)
- **Quelle opération** (SELECT, INSERT, UPDATE, DELETE)
- **Quelles lignes** (condition WHERE)

```sql
-- Activer RLS sur une table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer une politique : tout le monde peut voir les projets actifs
CREATE POLICY "Projets actifs visibles par tous"
  ON projects
  FOR SELECT
  USING (status = 'active');
```

#### Les fonctions d'authentification Supabase

Supabase fournit des fonctions SQL pour accéder au contexte d'authentification :

| Fonction | Description |
|----------|-------------|
| `auth.uid()` | UUID de l'utilisateur connecté (NULL si anonyme) |
| `auth.jwt()` | Token JWT complet avec les métadonnées |
| `auth.role()` | Rôle de l'utilisateur ('authenticated', 'anon') |

Ces fonctions sont **sécurisées** : elles ne peuvent pas être falsifiées côté client.

---

### Les politiques RLS de GameFund

#### Politiques sur `profiles`

```sql
-- Tout le monde peut voir les profils actifs
CREATE POLICY "Profils publics visibles"
  ON profiles FOR SELECT
  USING (is_active = true);

-- Un utilisateur peut modifier uniquement son profil
CREATE POLICY "Utilisateur modifie son profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

#### Politiques sur `projects`

```sql
-- Les projets actifs sont visibles par tous
CREATE POLICY "Projets actifs publics"
  ON projects FOR SELECT
  USING (status = 'active');

-- Les créateurs voient tous leurs projets (même brouillons)
CREATE POLICY "Créateur voit ses projets"
  ON projects FOR SELECT
  USING (auth.uid() = creator_id);

-- Seul le créateur peut modifier son projet
CREATE POLICY "Créateur modifie son projet"
  ON projects FOR UPDATE
  USING (auth.uid() = creator_id);

-- Utilisateur authentifié peut créer un projet
CREATE POLICY "Création projet par utilisateur auth"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
```

#### Politiques sur `donations`

```sql
-- Les donateurs voient leurs dons
CREATE POLICY "Donateur voit ses dons"
  ON donations FOR SELECT
  USING (auth.uid() = donor_id);

-- Les créateurs voient les dons sur leurs projets
CREATE POLICY "Créateur voit dons de ses projets"
  ON donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = donations.project_id
      AND projects.creator_id = auth.uid()
    )
  );

-- Utilisateur authentifié peut faire un don
CREATE POLICY "Création don par utilisateur auth"
  ON donations FOR INSERT
  WITH CHECK (auth.uid() = donor_id);
```

---

### Cas particulier : les politiques Admin

#### Le problème de récursion infinie

Pour vérifier si un utilisateur est admin, on pourrait écrire :

```sql
-- ⚠️ NE PAS FAIRE ÇA !
CREATE POLICY "Admin voit tout"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
```

**Problème** : pour vérifier si l'utilisateur est admin, PostgreSQL doit lire la table `profiles`... qui déclenche à nouveau la vérification... → **récursion infinie** !

#### La solution : SECURITY DEFINER

On crée une fonction qui s'exécute avec les droits du propriétaire (bypass RLS) :

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER  -- ← Exécute avec les droits du créateur
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM profiles
    WHERE id = auth.uid()
  );
END;
$$;
```

Puis on utilise cette fonction dans les politiques :

```sql
-- Admin peut tout voir
CREATE POLICY "Admin accès complet profiles"
  ON profiles FOR ALL
  USING (is_admin());

CREATE POLICY "Admin accès complet projects"
  ON projects FOR ALL
  USING (is_admin());

CREATE POLICY "Admin accès complet donations"
  ON donations FOR ALL
  USING (is_admin());
```

---

### Supabase Storage et ses politiques

#### Créer un bucket

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

#### Politiques sur le storage

```sql
-- Tout le monde peut voir les images de projets
CREATE POLICY "Images projets publiques"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Utilisateur authentifié peut uploader
CREATE POLICY "Upload images projets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-images'
    AND auth.role() = 'authenticated'
  );

-- Propriétaire peut supprimer son image
CREATE POLICY "Suppression propre image"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

### Fonctions RPC personnalisées

Pour des calculs complexes, on peut créer des fonctions PostgreSQL appelables depuis le client :

```sql
-- Calculer le total collecté pour un projet
CREATE OR REPLACE FUNCTION get_project_total_collected(project_uuid UUID)
RETURNS NUMERIC
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM donations
  WHERE project_id = project_uuid;
$$;

-- Compter les donateurs uniques
CREATE OR REPLACE FUNCTION get_project_donors_count(project_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(DISTINCT donor_id)::INTEGER
  FROM donations
  WHERE project_id = project_uuid;
$$;
```

Appel depuis le frontend :
```javascript
const { data } = await supabase
  .rpc('get_project_total_collected', { project_uuid: projectId })
```

---

### Bonnes pratiques RLS

1. **Toujours activer RLS** sur les tables contenant des données sensibles
2. **Commencer restrictif** : interdire tout, puis ouvrir progressivement
3. **Utiliser `auth.uid()`** plutôt que des paramètres client
4. **Éviter les requêtes imbriquées** qui peuvent causer des récursions
5. **Tester avec différents rôles** (anon, authenticated, admin)
6. **Documenter chaque politique** avec un nom explicite

---

### Debugging RLS

#### Vérifier les politiques actives

```sql
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

#### Tester une politique

```sql
-- Se connecter en tant qu'utilisateur spécifique
SET request.jwt.claim.sub = 'user-uuid-here';
SET request.jwt.claim.role = 'authenticated';

-- Tester une requête
SELECT * FROM projects;
```

---

### Conclusion

Supabase et RLS offrent une approche élégante pour sécuriser les données **directement dans la base**. Les avantages :

- **Sécurité centralisée** : les règles sont au plus près des données
- **Impossible à contourner** : même via l'API REST directe
- **Performance** : PostgreSQL optimise les filtres RLS
- **Simplicité** : pas de backend à maintenir pour les cas simples

Les inconvénients :
- **Courbe d'apprentissage** : SQL + concepts RLS
- **Debugging complexe** : les erreurs RLS sont parfois obscures
- **Limites** : certaines logiques métier restent plus simples en code

Pour un projet d'étude comme GameFund, Supabase s'est révélé être un excellent choix, permettant de se concentrer sur le frontend tout en garantissant une sécurité robuste des données.

---

## Partie 3 : Préparer les tests E2E avec Playwright

### Introduction

Les tests End-to-End (E2E) sont essentiels pour valider que l'application fonctionne correctement du point de vue de l'utilisateur final. Pour GameFund, j'ai choisi de séparer les tests dans un **projet parallèle** utilisant Playwright.

Cette approche présente plusieurs avantages :
- **Séparation des responsabilités** : le code applicatif reste léger
- **Indépendance** : les tests peuvent évoluer sans impacter l'application
- **CI/CD** : les tests peuvent tourner dans un pipeline séparé

---

### Pourquoi Playwright ?

Parmi les frameworks de test E2E disponibles (Cypress, Selenium, Puppeteer...), **Playwright** se distingue par :

| Critère | Playwright | Alternatives |
|---------|------------|--------------|
| Multi-navigateurs | Chrome, Firefox, Safari, Edge | Variable |
| Parallélisation | Native, très efficace | Souvent limitée |
| Auto-wait | Intelligent, peu de flaky tests | À configurer |
| API moderne | Async/await, TypeScript natif | Variable |
| Debugging | Trace viewer, codegen | Moins complet |
| Mobile | Émulation intégrée | Souvent payant |

Playwright est également bien documenté et maintenu activement par Microsoft.

---

### La stratégie de test : parcours utilisateurs

#### Philosophie

Plutôt que de tester chaque composant isolément (ce qui relève des tests unitaires), les tests E2E doivent valider les **parcours utilisateurs critiques** :

```
Parcours critique > Fonctionnalités isolées
```

**Priorités pour GameFund** :
1. **Flux d'argent** : tout ce qui touche aux donations
2. **Authentification** : sécurité des accès
3. **Gestion des projets** : création, publication
4. **Dashboards** : affichage des données personnalisées

#### Organisation par familles fonctionnelles

Les tests sont regroupés en **6 familles** :

```
tests/
├── auth/                    # Authentification
│   ├── signup.spec.js       # Inscription
│   ├── login.spec.js        # Connexion
│   └── session.spec.js      # Gestion de session
├── projects/                # Gestion des projets
│   ├── gallery.spec.js      # Galerie publique
│   ├── detail.spec.js       # Page détail
│   ├── create-edit.spec.js  # CRUD projets
│   └── creator-list.spec.js # Liste créateur
├── donations/               # Système de dons
│   ├── donate.spec.js       # Faire un don
│   ├── my-donations.spec.js # Mes donations
│   └── project-donations.spec.js
├── dashboards/              # Dashboards
│   ├── creator.spec.js
│   ├── donor.spec.js
│   └── admin.spec.js
├── profiles/                # Profils créateurs
└── navigation/              # Navigation globale
```

Cette organisation permet de :
- Exécuter une famille spécifique rapidement
- Identifier facilement où ajouter un nouveau test
- Maintenir une cohérence dans la couverture

---

### Le rôle crucial des data-testid

#### Le problème des sélecteurs fragiles

Les sélecteurs CSS classiques sont fragiles :

```javascript
// ❌ Fragile : casse si le texte change
await page.getByText('Se connecter').click()

// ❌ Fragile : casse si la structure HTML change
await page.locator('form > div:nth-child(2) > button').click()

// ❌ Fragile : casse si le style change
await page.locator('.btn-primary').click()
```

Ces sélecteurs dépendent de détails d'implémentation qui peuvent changer pour des raisons légitimes (traduction, refactoring CSS, réorganisation du DOM).

#### La solution : data-testid

L'attribut `data-testid` crée un **contrat explicite** entre le code et les tests :

```jsx
// Dans le composant React
<button data-testid="login-submit-button" className="btn-primary">
  Se connecter
</button>
```

```javascript
// Dans le test Playwright
await page.getByTestId('login-submit-button').click()
```

**Avantages** :
- **Stable** : ne change pas lors de refactoring CSS
- **Explicite** : signale clairement que l'élément est testé
- **Découplé** : le test ne dépend pas de l'UI visible
- **Documenté** : facile à rechercher dans le code

#### Convention de nommage

Pattern : `{contexte}-{élément}-{action?}`

| Exemple | Description |
|---------|-------------|
| `login-email-input` | Champ email de la page login |
| `project-card` | Carte projet (répétable) |
| `donation-form-submit-button` | Bouton soumettre du formulaire de don |
| `creator-dashboard-stats` | Section statistiques du dashboard créateur |

#### Statistiques de couverture GameFund

| Métrique | Valeur |
|----------|--------|
| data-testid documentés | 183 |
| data-testid implémentés | 178 |
| **Taux de couverture** | **97%** |

Les 5 manquants correspondent à des fonctionnalités non encore développées ou à des éléments avec une implémentation différente.

---

### Le plan de test : structure et contenu

#### Éléments d'un scénario de test

Chaque scénario est documenté avec :

1. **Objectif** : ce que le test valide
2. **Prérequis** : état initial nécessaire
3. **Parcours** : étapes numérotées
4. **Points de vérification** : assertions à effectuer

**Exemple : Scénario "Faire un don"**

```
Objectif : Parcours complet de donation

Prérequis : Utilisateur connecté, projet actif existant

Parcours :
1. Accéder à la page détail d'un projet actif
2. Cliquer sur "Faire un don"
3. Entrer un montant (>= 1€)
4. Entrer un message (optionnel)
5. Cliquer sur "Continuer"
6. Vérifier la prévisualisation dans la modal
7. Confirmer le don
8. Vérifier le message de succès
9. Vérifier que les stats du projet sont mises à jour

Points de vérification :
- Validation montant minimum (1€)
- Modal affiche le bon montant et le nouveau total
- Statistiques mises à jour après confirmation
- Don visible dans la liste des donations du projet
```

#### Les 3 rôles utilisateurs

Les tests couvrent 3 profils distincts :

| Rôle | Accès | Tests critiques |
|------|-------|-----------------|
| **Visiteur** | Pages publiques uniquement | Galerie, détail projet (limité) |
| **Utilisateur** | Tout sauf admin | Donations, création projet, dashboards |
| **Admin** | Tout | Gestion utilisateurs, modération projets |

---

### Configuration Playwright recommandée

#### playwright.config.js

```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],

  webServer: {
    command: 'cd ../gamefund && npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Points clés** :
- `fullyParallel` : exécution parallèle pour la rapidité
- `trace: 'on-first-retry'` : traces uniquement en cas d'échec
- `webServer` : lance automatiquement l'application

#### Helpers d'authentification

Pour éviter de répéter le code de connexion :

```javascript
// helpers/auth.js
export async function login(page, email, password) {
  await page.goto('/login')
  await page.getByTestId('login-email-input').fill(email)
  await page.getByTestId('login-password-input').fill(password)
  await page.getByTestId('login-submit-button').click()
  await page.waitForURL('/')
}

export async function logout(page) {
  await page.getByTestId('header-logout-button').click()
  await page.waitForURL('/')
}
```

#### Fixtures utilisateurs

```json
// fixtures/users.json
{
  "creator": {
    "email": "creator@test.com",
    "password": "TestPass123!",
    "displayName": "Test Creator"
  },
  "donor": {
    "email": "donor@test.com",
    "password": "TestPass123!",
    "displayName": "Test Donor"
  },
  "admin": {
    "email": "admin@test.com",
    "password": "AdminPass123!",
    "displayName": "Test Admin"
  }
}
```

---

### Bonnes pratiques E2E

#### 1. Utiliser systématiquement data-testid

```javascript
// ✅ Bon
await page.getByTestId('login-submit-button').click()

// ❌ À éviter
await page.locator('button[type="submit"]').click()
await page.getByText('Se connecter').click()
```

#### 2. Attentes explicites plutôt que timeouts

```javascript
// ✅ Bon - attendre une condition
await page.getByTestId('login-submit-button').click()
await page.waitForURL('/dashboard')
await expect(page.getByTestId('success-message')).toBeVisible()

// ❌ À éviter - timeout fixe
await page.waitForTimeout(2000)
```

#### 3. Isolation des tests

Chaque test doit être **indépendant** :
- Ne pas dépendre de l'ordre d'exécution
- Créer les données nécessaires en setup
- Nettoyer après si nécessaire

```javascript
test.describe('Donations', () => {
  test.beforeEach(async ({ page }) => {
    // Setup : se connecter
    await login(page, 'donor@test.com', 'TestPass123!')
  })

  test('devrait permettre de faire un don', async ({ page }) => {
    // Test isolé
  })

  test('devrait afficher l\'historique', async ({ page }) => {
    // Autre test isolé, même état initial
  })
})
```

#### 4. Nommage descriptif

```javascript
test.describe('Authentification', () => {
  test('devrait connecter un utilisateur avec credentials valides', async ({ page }) => {
    // ...
  })

  test('devrait afficher une erreur si le mot de passe est incorrect', async ({ page }) => {
    // ...
  })

  test('devrait rediriger vers /login si non authentifié', async ({ page }) => {
    // ...
  })
})
```

#### 5. Éviter les tests flaky

Un test "flaky" échoue de manière aléatoire. Pour les éviter :

- Utiliser les auto-wait de Playwright (pas de `waitForTimeout`)
- Vérifier les assertions avant les actions
- Isoler les tests (pas de dépendances entre tests)
- Utiliser des données de test dédiées

---

### Workflow de développement avec tests E2E

#### Pendant le développement

1. **Implémenter la fonctionnalité** avec les data-testid
2. **Vérifier manuellement** que ça fonctionne
3. **Écrire le test E2E** correspondant
4. **Exécuter le test** pour valider
5. **Committer** le code + le test

#### En CI/CD

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

### Synchronisation code/documentation

Un défi constant : maintenir la **cohérence** entre :
- Le code (data-testid implémentés)
- La documentation (data-testid attendus)
- Les tests (data-testid utilisés)

#### Solution adoptée pour GameFund

1. **Document de référence** : `docs/TESTING.md` liste tous les data-testid
2. **Fichier CSV** : `docs/data_testids.csv` pour import/export
3. **Vérification régulière** : scripts de validation

Exemple de changelog dans la documentation :

```markdown
### 21 janvier 2026 - Synchronisation

| Fichier | Ancien | Nouveau |
|---------|--------|---------|
| ProjectFilters.jsx | search-input | projects-search-input |
| ProjectCard.jsx | project-card-status-badge | project-card-badge |
```

---

### Conclusion

La mise en place de tests E2E demande un investissement initial :
- Définir une stratégie de test claire
- Implémenter systématiquement les data-testid
- Documenter les scénarios de test
- Configurer l'environnement Playwright

Mais les bénéfices sont considérables :
- **Confiance** lors des refactorings
- **Détection précoce** des régressions
- **Documentation vivante** des parcours utilisateurs
- **Gain de temps** sur les tests manuels

Pour un projet d'étude comme GameFund, c'est aussi une excellente opportunité d'apprendre les bonnes pratiques de testing qui s'appliquent à tout projet professionnel.

---

## Partie 4 : Évolutions possibles et passage en production

### Introduction

GameFund est un MVP fonctionnel, mais comme tout projet, il peut évoluer. Cette partie explore les pistes d'amélioration et les considérations pour un éventuel passage en production.

---

### 1. Affiner le design et l'UX

#### État actuel

Le design actuel utilise **Tailwind CSS 4** avec une palette de couleurs personnalisée. Les composants UI sont fonctionnels mais pourraient bénéficier de plusieurs améliorations.

#### Pistes d'amélioration

**Design System plus poussé**
- Créer un **Storybook** pour documenter et tester les composants isolément
- Définir des tokens de design (spacing, typography, colors) dans un fichier centralisé
- Ajouter des variantes de composants (sizes, states)

```javascript
// Exemple de tokens de design
export const tokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#0ea5e9',
      900: '#0c4a6e',
    }
  }
}
```

**Animations et micro-interactions**
- Transitions fluides entre les états (hover, focus, loading)
- Animations de feedback (succès, erreur)
- Skeleton loaders plus sophistiqués

**Responsive avancé**
- Tester sur plus de breakpoints
- Améliorer l'expérience tablette
- Optimiser les images avec `srcset`

**Accessibilité (a11y)**
- Audit avec Lighthouse et axe-core
- Navigation clavier complète
- Labels ARIA sur les éléments interactifs
- Contraste des couleurs conforme WCAG AA

---

### 2. Tests unitaires et d'intégration

#### Pourquoi ajouter des tests unitaires ?

Les tests E2E valident les parcours utilisateurs, mais ils sont :
- **Lents** à exécuter
- **Fragiles** face aux changements d'UI
- **Coûteux** en maintenance

Les tests unitaires complètent en validant la logique métier de manière isolée.

#### Stack recommandée

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

| Outil | Usage |
|-------|-------|
| **Vitest** | Test runner rapide, compatible Vite |
| **Testing Library** | Tests centrés sur l'utilisateur |
| **MSW** | Mock des appels API |

#### Que tester en priorité ?

**1. Hooks personnalisés**
```javascript
// hooks/useAuth.test.js
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

describe('useAuth', () => {
  it('devrait retourner null si non connecté', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeNull()
  })
})
```

**2. Fonctions utilitaires**
```javascript
// utils/formatters.test.js
import { formatCurrency, formatDate } from './formatters'

describe('formatCurrency', () => {
  it('devrait formater en euros', () => {
    expect(formatCurrency(1234.56)).toBe('1 234,56 €')
  })
})
```

**3. Services (avec mocks)**
```javascript
// services/projectService.test.js
import { getProjects } from './projectService'
import { supabase } from './supabase'

vi.mock('./supabase')

describe('getProjects', () => {
  it('devrait retourner les projets actifs', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ id: '1', title: 'Test' }],
        error: null
      })
    })

    const { projects } = await getProjects({ status: 'active' })
    expect(projects).toHaveLength(1)
  })
})
```

**4. Composants avec logique**
```javascript
// components/DonationForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { DonationForm } from './DonationForm'

describe('DonationForm', () => {
  it('devrait valider le montant minimum', async () => {
    render(<DonationForm projectId="123" />)

    const input = screen.getByTestId('donation-form-amount-input')
    fireEvent.change(input, { target: { value: '0.5' } })
    fireEvent.click(screen.getByTestId('donation-form-submit-button'))

    expect(screen.getByText(/minimum 1€/i)).toBeInTheDocument()
  })
})
```

#### Pyramide de tests idéale

```
        /\
       /E2E\        <- Peu, lents, couvrent les parcours critiques
      /------\
     / Intég. \     <- Modérés, testent les interactions composants
    /----------\
   /  Unitaires \   <- Nombreux, rapides, logique métier
  /--------------\
```

---

### 3. Passage en production

#### Options de déploiement

**Option A : Plateformes managées (recommandé pour débuter)**

| Plateforme | Avantages | Inconvénients |
|------------|-----------|---------------|
| **Vercel** | Deploy instantané, preview branches, analytics | Limites free tier |
| **Netlify** | Similaire Vercel, forms intégrés | Limites free tier |
| **Cloudflare Pages** | CDN global, très rapide | Moins de features |

Configuration Vercel :
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Option B : VPS personnel**

Pour plus de contrôle et d'apprentissage :

| Provider | Prix/mois | Specs recommandées |
|----------|-----------|-------------------|
| **Hetzner** | ~5€ | 2 vCPU, 4GB RAM |
| **OVH** | ~6€ | 2 vCPU, 4GB RAM |
| **DigitalOcean** | $6 | 1 vCPU, 1GB RAM |
| **Contabo** | ~5€ | 4 vCPU, 8GB RAM |

Stack de déploiement VPS :
```
┌─────────────────────────────────────────────┐
│                   Nginx                      │
│            (reverse proxy + SSL)             │
└─────────────────┬───────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───▼───┐                 ┌─────▼─────┐
│ Vite  │                 │  Supabase │
│ Build │                 │  (cloud)  │
│(static)│                └───────────┘
└───────┘
```

Scripts de déploiement :
```bash
#!/bin/bash
# deploy.sh

# Build
npm run build

# Copie vers le serveur
rsync -avz --delete dist/ user@server:/var/www/gamefund/

# Reload Nginx
ssh user@server "sudo systemctl reload nginx"
```

#### Considérations de sécurité

**Variables d'environnement**
```bash
# .env.production (NE PAS COMMITTER)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Headers de sécurité (Nginx)**
```nginx
# /etc/nginx/sites-available/gamefund
server {
    listen 443 ssl http2;
    server_name gamefund.example.com;

    # SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/gamefund.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gamefund.example.com/privkey.pem;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    root /var/www/gamefund;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

### 4. Migrer vers Supabase local (self-hosted)

#### Pourquoi migrer ?

Le Supabase cloud est parfait pour le développement, mais en production :
- **Coûts** : le free tier a des limites
- **Données sensibles** : contrôle total sur l'hébergement
- **Performance** : latence réduite si co-localisé avec l'app
- **Compliance** : exigences RGPD, données en Europe

#### Architecture Supabase self-hosted

```
┌────────────────────────────────────────────────────┐
│                    Docker Compose                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Postgres │  │  GoTrue  │  │    PostgREST     │ │
│  │   + RLS  │  │  (Auth)  │  │   (API REST)     │ │
│  └──────────┘  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Storage  │  │ Realtime │  │     Kong         │ │
│  │  (S3)    │  │  (WS)    │  │   (API Gateway)  │ │
│  └──────────┘  └──────────┘  └──────────────────┘ │
└────────────────────────────────────────────────────┘
```

#### Installation avec Docker

```bash
# Cloner le repo Supabase
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copier et configurer les variables
cp .env.example .env
# Éditer .env avec vos valeurs

# Lancer
docker compose up -d
```

**Variables importantes** :
```bash
# .env
POSTGRES_PASSWORD=your-super-secret-password
JWT_SECRET=your-super-long-jwt-secret-at-least-32-chars
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Migration des données

```bash
# Export depuis Supabase cloud
supabase db dump -f backup.sql --db-url "postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres"

# Import vers Supabase local
psql -h localhost -U postgres -d postgres -f backup.sql
```

#### Ressources recommandées

Pour un Supabase self-hosted en production :
- **Minimum** : 2 vCPU, 4GB RAM, 50GB SSD
- **Recommandé** : 4 vCPU, 8GB RAM, 100GB SSD
- **Base de données séparée** : envisager un Postgres managé (Neon, Railway)

---

### 5. Autres évolutions possibles

#### Fonctionnalités métier

**Système de paiement réel**
- Intégration **Stripe** pour les paiements
- Webhooks pour confirmer les donations
- Gestion des remboursements

```javascript
// Exemple d'intégration Stripe
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createPaymentIntent(amount, projectId) {
  return stripe.paymentIntents.create({
    amount: amount * 100, // en centimes
    currency: 'eur',
    metadata: { projectId }
  })
}
```

**Notifications**
- Emails transactionnels (SendGrid, Resend)
- Notifications push (OneSignal)
- Notifications in-app temps réel (Supabase Realtime)

**Social features**
- Commentaires sur les projets
- Système de likes/favoris
- Partage social enrichi (Open Graph)

#### Améliorations techniques

**Performance**
- Lazy loading des images
- Code splitting par route
- Service Worker pour le cache offline
- Optimisation des requêtes Supabase (pagination, indexes)

```javascript
// Lazy loading des routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboardPage'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  )
}
```

**Monitoring**
- **Sentry** pour le tracking d'erreurs
- **Plausible/Umami** pour les analytics (privacy-friendly)
- **Uptime monitoring** (UptimeRobot, Better Uptime)

**SEO**
- Meta tags dynamiques par page
- Sitemap automatique
- Structured data (JSON-LD)

#### Migration vers d'autres technologies

**SSR/SSG avec Next.js ou Astro**

Si le SEO devient critique :
```
Vite (SPA) → Next.js (SSR) ou Astro (SSG)
```

Avantages :
- Meilleur référencement
- Temps de chargement initial réduit
- Preview des liens sociaux

**État global avec Zustand ou TanStack Query**

Pour une gestion d'état plus robuste :
```javascript
// store/useProjectStore.js
import { create } from 'zustand'

export const useProjectStore = create((set) => ({
  projects: [],
  loading: false,
  fetchProjects: async () => {
    set({ loading: true })
    const { projects } = await getProjects()
    set({ projects, loading: false })
  }
}))
```

**TypeScript**

Migrer progressivement vers TypeScript :
```typescript
// types/project.ts
export interface Project {
  id: string
  title: string
  description: string
  goal_amount: number
  deadline: string
  status: 'draft' | 'active' | 'completed' | 'failed'
  creator_id: string
  created_at: string
}

// services/projectService.ts
export async function getProjectById(id: string): Promise<{
  data: Project | null
  error: Error | null
}> {
  // ...
}
```

---

### Conclusion générale du projet

GameFund a été une excellente expérience d'apprentissage couvrant :

| Aspect | Ce qui a été appris |
|--------|---------------------|
| **Méthodologie** | PRD structuré, développement itératif par phases |
| **IA** | Collaboration efficace avec Claude Code |
| **Frontend** | React 19, Vite 6, Tailwind CSS 4 |
| **Backend** | Supabase, PostgreSQL, RLS |
| **Testing** | Playwright, data-testid, plan de test |
| **DevOps** | Git workflow, documentation |

Les prochaines étapes naturelles seraient :
1. **Consolider** : ajouter les tests unitaires
2. **Améliorer** : affiner l'UX et le design
3. **Déployer** : mettre en production sur Vercel ou un VPS
4. **Étendre** : ajouter les paiements réels avec Stripe

Ce projet démontre qu'avec une bonne méthodologie et les bons outils, il est possible de développer une application complète en un temps raisonnable, même pour un développeur solo.

---

## Partie 5 : Guide complet de mise en production

### Introduction

Vous avez développé votre application, les tests passent, tout fonctionne en local. Et maintenant ? Cette partie détaille **pas à pas** comment mettre GameFund (ou toute application Vite/React + Supabase) en production.

Nous aborderons trois scénarios :
1. **Vercel** : le plus simple, idéal pour commencer
2. **VPS avec Nginx** : plus de contrôle, bon apprentissage
3. **Full self-hosted** : Supabase local + application

---

### 1. Prérequis communs

#### Variables d'environnement

Avant tout déploiement, séparez vos configurations :

```bash
# .env.development (développement local)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# .env.production (production)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important** : Ne jamais committer ces fichiers ! Ajoutez au `.gitignore` :

```gitignore
.env
.env.local
.env.production
.env.*.local
```

#### Build de production

Testez votre build localement avant de déployer :

```bash
# Build
npm run build

# Prévisualisation locale du build
npm run preview
```

Vérifiez :
- Pas d'erreurs de build
- L'application fonctionne sur `http://localhost:4173`
- Les appels API Supabase fonctionnent

---

### 2. Déploiement sur Vercel (recommandé pour débuter)

#### Étape 1 : Préparation du repository

Assurez-vous que votre code est sur GitHub :

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Étape 2 : Connexion à Vercel

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. Vercel détecte automatiquement Vite

#### Étape 3 : Configuration

Dans les paramètres du projet Vercel :

**Build & Development Settings** :
- Framework Preset : `Vite`
- Build Command : `npm run build`
- Output Directory : `dist`
- Install Command : `npm install`

**Environment Variables** :
Ajoutez vos variables de production :
```
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Étape 4 : Configuration du routing SPA

Créez `vercel.json` à la racine :

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

Cela garantit que toutes les routes sont gérées par React Router.

#### Étape 5 : Déploiement

Cliquez sur "Deploy". Vercel :
1. Clone votre repository
2. Installe les dépendances
3. Exécute le build
4. Déploie sur son CDN global

**Résultat** : Votre application est accessible sur `votre-projet.vercel.app`

#### Étape 6 : Domaine personnalisé (optionnel)

Dans les paramètres Vercel > Domains :
1. Ajoutez votre domaine (ex: `gamefund.fr`)
2. Configurez les DNS chez votre registrar :
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
3. Vercel génère automatiquement un certificat SSL

#### Avantages Vercel

| Avantage | Description |
|----------|-------------|
| **Deploy instantané** | Push = Deploy automatique |
| **Preview Deployments** | Chaque PR a son URL de preview |
| **CDN global** | Chargement rapide partout |
| **SSL gratuit** | HTTPS automatique |
| **Analytics** | Métriques de base incluses |

#### Limites du free tier

- 100 GB de bande passante/mois
- Builds limités
- Pas de protection par mot de passe

---

### 3. Déploiement sur VPS (Nginx)

Pour plus de contrôle et d'apprentissage.

#### Étape 1 : Choix et configuration du VPS

**Providers recommandés** :

| Provider | Prix | Specs | Avantages |
|----------|------|-------|-----------|
| **Hetzner** | 4,51€/mois | 2 vCPU, 4GB RAM | Excellent rapport qualité/prix |
| **OVH** | 6€/mois | 2 vCPU, 4GB RAM | Données en France |
| **DigitalOcean** | $6/mois | 1 vCPU, 1GB RAM | Interface simple |
| **Contabo** | 4,99€/mois | 4 vCPU, 8GB RAM | Beaucoup de ressources |

**Configuration initiale** (Ubuntu 22.04) :

```bash
# Connexion SSH
ssh root@votre-ip

# Mise à jour du système
apt update && apt upgrade -y

# Création d'un utilisateur non-root
adduser deploy
usermod -aG sudo deploy

# Configuration SSH (sécurité)
# Éditez /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no  # Après avoir configuré les clés SSH

# Redémarrer SSH
systemctl restart sshd
```

#### Étape 2 : Installation des dépendances

```bash
# Connexion en tant que deploy
su - deploy

# Installation Node.js (via nvm recommandé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Installation Nginx
sudo apt install nginx -y

# Installation Certbot (SSL)
sudo apt install certbot python3-certbot-nginx -y

# Pare-feu
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

#### Étape 3 : Déploiement de l'application

**Option A : Déploiement manuel**

```bash
# Sur votre machine locale
npm run build

# Copie vers le serveur
rsync -avz --delete dist/ deploy@votre-ip:/var/www/gamefund/
```

**Option B : Script de déploiement automatisé**

Créez `scripts/deploy.sh` :

```bash
#!/bin/bash
set -e

# Configuration
SERVER="deploy@votre-ip"
DEPLOY_PATH="/var/www/gamefund"
BRANCH="main"

echo "🚀 Déploiement de GameFund..."

# Build local
echo "📦 Build en cours..."
npm run build

# Copie vers le serveur
echo "📤 Upload vers le serveur..."
rsync -avz --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  dist/ ${SERVER}:${DEPLOY_PATH}/

# Rechargement Nginx
echo "🔄 Rechargement Nginx..."
ssh ${SERVER} "sudo systemctl reload nginx"

echo "✅ Déploiement terminé !"
echo "🌐 https://gamefund.example.com"
```

Rendez-le exécutable :
```bash
chmod +x scripts/deploy.sh
```

#### Étape 4 : Configuration Nginx

Créez `/etc/nginx/sites-available/gamefund` :

```nginx
server {
    listen 80;
    server_name gamefund.example.com;

    # Redirection HTTP vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name gamefund.example.com;

    # Certificats SSL (générés par Certbot)
    ssl_certificate /etc/letsencrypt/live/gamefund.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gamefund.example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/gamefund.example.com/chain.pem;

    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;" always;

    # Racine du site
    root /var/www/gamefund;
    index index.html;

    # Gestion des routes SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Compression Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # Logs
    access_log /var/log/nginx/gamefund.access.log;
    error_log /var/log/nginx/gamefund.error.log;
}
```

Activez la configuration :

```bash
# Lien symbolique
sudo ln -s /etc/nginx/sites-available/gamefund /etc/nginx/sites-enabled/

# Test de la configuration
sudo nginx -t

# Rechargement
sudo systemctl reload nginx
```

#### Étape 5 : Certificat SSL avec Let's Encrypt

```bash
# Génération du certificat
sudo certbot --nginx -d gamefund.example.com

# Renouvellement automatique (déjà configuré par défaut)
# Vérification
sudo certbot renew --dry-run
```

#### Étape 6 : Monitoring basique

**Logs en temps réel** :
```bash
# Logs Nginx
sudo tail -f /var/log/nginx/gamefund.access.log
sudo tail -f /var/log/nginx/gamefund.error.log
```

**Script de health check** :

```bash
#!/bin/bash
# scripts/health-check.sh

URL="https://gamefund.example.com"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ Site OK (HTTP $RESPONSE)"
else
    echo "❌ Site DOWN (HTTP $RESPONSE)"
    # Optionnel : envoyer une notification
fi
```

Ajoutez à cron pour vérification régulière :
```bash
crontab -e
# Ajoutez :
*/5 * * * * /home/deploy/scripts/health-check.sh >> /var/log/health-check.log 2>&1
```

---

### 4. Configuration Supabase pour la production

#### Paramètres de sécurité

Dans le dashboard Supabase > Settings > API :

1. **Vérifiez les URL autorisées** :
   - `https://gamefund.example.com`
   - `http://localhost:5173` (pour le dev)

2. **Rate limiting** : activez les limites appropriées

3. **Email templates** : personnalisez les emails (confirmation, reset password)

#### Sauvegardes

Supabase fait des sauvegardes automatiques, mais vous pouvez aussi :

```bash
# Export manuel de la base
supabase db dump -f backup_$(date +%Y%m%d).sql \
  --db-url "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

Script de backup automatique :

```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_URL="postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres"

mkdir -p $BACKUP_DIR

pg_dump $DB_URL > $BACKUP_DIR/gamefund_$DATE.sql

# Garder seulement les 7 derniers backups
ls -t $BACKUP_DIR/*.sql | tail -n +8 | xargs -r rm

echo "Backup créé : gamefund_$DATE.sql"
```

---

### 5. CI/CD avec GitHub Actions

Automatisez vos déploiements :

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          source: "dist/*"
          target: "/var/www/gamefund"
          strip_components: 1

      - name: Reload Nginx
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: sudo systemctl reload nginx
```

**Secrets à configurer dans GitHub** :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`

---

### 6. Checklist de mise en production

#### Avant le déploiement

- [ ] Build local fonctionne (`npm run build && npm run preview`)
- [ ] Variables d'environnement de production configurées
- [ ] Tests E2E passent
- [ ] Pas de console.log() de debug
- [ ] Images optimisées
- [ ] Favicon et meta tags configurés

#### Configuration serveur

- [ ] Utilisateur non-root créé
- [ ] Clés SSH configurées (pas de mot de passe)
- [ ] Pare-feu activé (ufw)
- [ ] Nginx installé et configuré
- [ ] SSL/TLS configuré (Let's Encrypt)
- [ ] Headers de sécurité en place

#### Supabase

- [ ] URL de production autorisée dans les settings
- [ ] Politiques RLS vérifiées
- [ ] Rate limiting activé
- [ ] Sauvegardes configurées

#### Post-déploiement

- [ ] Site accessible en HTTPS
- [ ] Toutes les pages fonctionnent
- [ ] Authentification fonctionne
- [ ] Pas d'erreurs dans la console
- [ ] Performance acceptable (Lighthouse)
- [ ] Monitoring en place

---

### 7. Dépannage courant

#### Erreur 404 sur les routes

**Symptôme** : Les routes fonctionnent depuis la page d'accueil mais pas en accès direct.

**Solution** : Vérifiez la configuration Nginx `try_files` :
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### Erreurs CORS avec Supabase

**Symptôme** : Erreurs "Access-Control-Allow-Origin" dans la console.

**Solution** : Ajoutez votre domaine de production dans Supabase > Settings > API > Additional redirect URLs.

#### Certificat SSL non renouvelé

**Symptôme** : Erreur de certificat expiré.

**Solution** :
```bash
# Renouvellement manuel
sudo certbot renew

# Vérifier le timer
sudo systemctl status certbot.timer
```

#### Build échoue en production

**Symptôme** : Le build fonctionne en local mais pas en CI.

**Solution** : Vérifiez que toutes les variables d'environnement sont définies dans les secrets GitHub/Vercel.

---

### 8. Performance et optimisations

#### Analyse du bundle

```bash
# Installez le plugin d'analyse
npm install -D rollup-plugin-visualizer

# Dans vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
})

# Build avec analyse
npm run build
```

#### Optimisations recommandées

**1. Lazy loading des routes**
```javascript
const AdminDashboard = lazy(() => import('./pages/AdminDashboardPage'))
```

**2. Compression des images**
- Utilisez WebP ou AVIF
- Dimensionnez correctement (pas de 4K pour une miniature)

**3. Cache HTTP agressif**
Déjà configuré dans Nginx avec `expires 1y` pour les assets.

**4. Preconnect aux services externes**
```html
<!-- Dans index.html -->
<link rel="preconnect" href="https://xxx.supabase.co">
```

---

### Conclusion

La mise en production n'est pas un événement unique mais un **processus continu**. Une fois votre application déployée :

1. **Surveillez** les logs et les erreurs
2. **Mesurez** les performances (Lighthouse, Web Vitals)
3. **Automatisez** les déploiements (CI/CD)
4. **Sauvegardez** régulièrement
5. **Mettez à jour** les dépendances de sécurité

Le passage de "ça marche en local" à "c'est en production" est une étape majeure dans tout projet. Prenez le temps de bien configurer chaque aspect, et vous aurez une base solide pour faire évoluer votre application.

---

*Article rédigé dans le cadre du projet d'étude GameFund - Janvier 2026*
