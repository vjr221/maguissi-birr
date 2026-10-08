# Feuille de route MAGUISSI BIRR

## Phase 0 — séparation et audit
- [x] Dépôt GitHub indépendant : `vjr221/maguissi-birr`.
- [x] Reconstituer les documents de présentation, architecture, modèle de données et workflow QHSE depuis la branche historique.
- [x] Reprendre la direction visuelle et les fonctions utiles dans une architecture mobile modulaire.
- [x] Maintenir le dépôt et le cycle de release indépendants de VJR 221.
- [ ] Vérifier les éléments de marque et licences avant migration éventuelle des ressources graphiques historiques.

## Phase 1 — prototype mobile enrichi
- [x] Accueil et navigation de base.
- [x] 11 catégories QHSE et 14 régions.
- [x] Formulaire avec description, localité et GPS facultatif.
- [x] Sélection de photos et capture caméra.
- [x] Référence locale partageable, explicitement indiquée comme non officielle.
- [x] Historique local avec recherche et statut en français.
- [x] Conseils environnementaux et QHSE enrichis.
- [x] Validation des descriptions et des données locales.
- [x] Premiers tests unitaires et pipeline CI.
- [ ] Tests sur appareils réels, permissions, redémarrage, médias et stockage insuffisant.
- [ ] Affiner accessibilité, erreurs et détails de dossier.

## Phase 2 — MVP connecté
- [ ] API REST versionnée et base PostgreSQL.
- [ ] Authentification, rôles, organisations et autorisations.
- [ ] Références officielles et jetons de suivi générés côté serveur.
- [ ] Téléversement sécurisé des médias et validation serveur.
- [ ] Historique d'événements auditable.
- [ ] Notifications et synchronisation avec gestion claire des erreurs.

## Phase 3 — console professionnelle
- [ ] Qualification, affectation et transfert à une organisation compétente.
- [ ] Actions correctives, preuves de résolution et clôture validée.
- [ ] Délais de traitement, escalades et tableaux de bord.
- [ ] Cartographie et filtres région / département / commune.
- [ ] Exports contrôlés et rapports périodiques.

## Phase 4 — prévention et écosystème
- [ ] Fiches pratiques enrichies et revues par des professionnels QHSE.
- [ ] Micro-formations et campagnes de sensibilisation.
- [ ] Partenariats avec organisations compétentes et collectivités.
- [ ] Indicateurs agrégés et anonymisés, avec gouvernance définie.

## Conditions de publication
- Typecheck et tests verts sur le commit candidat.
- Essais sur appareils réels et revue de sécurité.
- Politique de confidentialité, conditions d'utilisation et support validés.
- Responsabilités QHSE et règles d'escalade confirmées.
- Aucun statut distant simulé et aucune promesse de traitement serveur avant son implémentation.
- Aucun secret dans Git ; builds signés via secrets protégés.
