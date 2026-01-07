# SQL Test Data - 5 Projets de Test

## Instructions

Exécuter ce script dans **Supabase Dashboard > SQL Editor** pour créer 5 projets de test variés.

## Étape 1: Récupérer l'UUID d'un créateur

```sql
SELECT id, email, display_name FROM profiles LIMIT 1;
```

Copier l'UUID retourné et le remplacer dans `{creator_uuid}` ci-dessous.

## Étape 2: Insérer les 5 projets

```sql
-- Remplacer {creator_uuid} par l'UUID réel avant d'exécuter
INSERT INTO projects (creator_id, title, description, image_url, goal_amount, deadline, status)
VALUES
  -- Projet 1: RPG fantasy (actif, objectif 50k€, 30 jours)
  ('{creator_uuid}',
   'Mystic Quest: The Awakening',
   'Un RPG épique mêlant magie et technologie dans un monde post-apocalyptique. Explorez des donjons mystérieux, combattez des créatures légendaires et sauvez le monde de l''extinction.',
   'https://picsum.photos/seed/game1/800/400',
   50000,
   NOW() + INTERVAL '30 days',
   'active'),

  -- Projet 2: Platformer indé (actif, objectif 30k€, 45 jours)
  ('{creator_uuid}',
   'Cyber Ninja Chronicles',
   'Un jeu d''action-platformer cyberpunk où vous incarnez un ninja futuriste. Parcourez les toits d''une mégalopole dystopique et déjouez les complots d''une corporation maléfique.',
   'https://picsum.photos/seed/game2/800/400',
   30000,
   NOW() + INTERVAL '45 days',
   'active'),

  -- Projet 3: Puzzle game (actif, objectif 15k€, 10 jours)
  ('{creator_uuid}',
   'Quantum Enigma',
   'Un jeu de réflexion innovant basé sur la physique quantique. Résolvez des énigmes en manipulant le temps et l''espace dans un univers visuel époustouflant.',
   'https://picsum.photos/seed/game3/800/400',
   15000,
   NOW() + INTERVAL '10 days',
   'active'),

  -- Projet 4: Simulation (actif, objectif 100k€, 60 jours)
  ('{creator_uuid}',
   'Galactic Tycoon',
   'Construisez votre empire spatial dans cette simulation de gestion. Explorez la galaxie, établissez des colonies et dominez le commerce interstellaire.',
   'https://picsum.photos/seed/game4/800/400',
   100000,
   NOW() + INTERVAL '60 days',
   'active'),

  -- Projet 5: Roguelike (actif, objectif 8k€, 20 jours)
  ('{creator_uuid}',
   'Dungeon Dash',
   'Un roguelike rapide et addictif. Affrontez des hordes de monstres dans des donjons générés aléatoirement. Chaque partie est unique !',
   'https://picsum.photos/seed/game5/800/400',
   8000,
   NOW() + INTERVAL '20 days',
   'active');
```

## Étape 3: Vérifier l'insertion

```sql
SELECT id, title, goal_amount, deadline, status FROM projects ORDER BY created_at DESC LIMIT 5;
```

## Optionnel: Ajouter des donations pour tester les stats

```sql
-- 1. Récupérer l'UUID d'un donateur
SELECT id FROM profiles LIMIT 1;

-- 2. Ajouter quelques donations (remplacer {donor_uuid})
INSERT INTO donations (project_id, donor_id, amount, message)
SELECT
  p.id,
  '{donor_uuid}',
  CASE
    WHEN p.title = 'Mystic Quest: The Awakening' THEN 5000
    WHEN p.title = 'Quantum Enigma' THEN 14000
    WHEN p.title = 'Dungeon Dash' THEN 2000
    ELSE 1000
  END,
  'Super projet, hâte de tester !'
FROM projects p
WHERE p.status = 'active'
  AND p.title IN ('Mystic Quest: The Awakening', 'Quantum Enigma', 'Dungeon Dash')
LIMIT 3;
```

## Résultat attendu

Après exécution, vous aurez:
- 5 projets actifs avec des objectifs variés (8k€ à 100k€)
- Des dates limites échelonnées (10 à 60 jours)
- Des images placeholder générées par Picsum
- (Optionnel) 3 projets avec des donations initiales
