# TODO Sécurité - GameFund

## 🔒 Améliorations de sécurité à implémenter

### 1. Storage Policies pour les images (PRIORITÉ HAUTE)

**Problème actuel :**
- Le bucket `project-images` est actuellement **complètement public**
- N'importe qui peut lire toutes les images sans authentification
- Risque : exposition non contrôlée des ressources

**Solution recommandée :**
Utiliser les **Row Level Security (RLS) policies** de Supabase Storage au lieu d'un bucket public.

**Implémentation :**

1. **Rendre le bucket privé** :
   - Dashboard Supabase → Storage → project-images
   - Cliquer sur les 3 points → "Make private"

2. **Créer des policies granulaires** :

**IMPORTANT:** Pour que la suppression fonctionne, il faut absolument ajouter au minimum la policy DELETE ci-dessous.

```sql
-- Policy 1: Lecture publique des images (SELECT)
-- Permet à tout le monde de voir les images des projets
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-images'
);

-- Policy 2: Upload restreint (INSERT)
-- Seuls les utilisateurs authentifiés peuvent uploader
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Suppression par utilisateurs authentifiés (DELETE)
-- Les utilisateurs authentifiés peuvent supprimer les images
-- Note: La vérification que c'est bien leur projet se fait côté app
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated'
);

-- Policy 4: Mise à jour par utilisateurs authentifiés (UPDATE)
-- Les utilisateurs authentifiés peuvent modifier les images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated'
);
```

**Note :**
- Les images sont stockées directement à la racine du bucket (format: `projectId-timestamp.ext`)
- La vérification de propriété du projet se fait au niveau de l'application
- Pour une sécurité renforcée, on pourrait ajouter une vérification en jointure avec la table `projects`

**Modifications du code nécessaires :**
- ✅ Aucune modification du code frontend nécessaire
- Les URLs continueront de fonctionner avec les policies
- Les appels à `getPublicUrl()` fonctionnent même avec un bucket privé si les policies autorisent l'accès

**Avantages :**
- ✅ Contrôle granulaire des accès
- ✅ Protection contre la suppression accidentelle
- ✅ Audit des accès possible
- ✅ Conformité RGPD améliorée

---

## 2. Autres améliorations de sécurité futures

### 2.1 Rate Limiting sur les uploads
- Limiter le nombre d'uploads par utilisateur/minute
- Éviter les abus et le spam

### 2.2 Validation côté serveur
- Ajouter des Edge Functions pour valider les fichiers uploadés
- Vérifier le type MIME réel (pas seulement l'extension)
- Scanner les images pour contenu malveillant

### 2.3 Expiration des URLs
- Utiliser des signed URLs avec expiration
- Empêcher le hotlinking d'images

### 2.4 Optimisation des images
- Redimensionner automatiquement les images à l'upload
- Convertir en formats optimisés (WebP)
- Limiter la taille maximale

---

## 📅 Timeline

- **Phase 7 (actuelle)** : Bucket public temporaire ✅
- **Phase 12 (Polish & Déploiement)** : Implémenter les storage policies 🎯
- **Post-MVP** : Rate limiting et optimisations avancées

---

## 📝 Notes

**Date de création :** 08 janvier 2026
**Créé par :** Assistant Claude
**Priorité :** Haute pour production, acceptable pour développement
**Impact :** Aucune modification du code frontend requise
