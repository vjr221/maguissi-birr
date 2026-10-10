# Feuille de route MAGUISSI BIRR

La priorité est de rendre le MVP local fiable. Les fonctions serveur, la console et les enrichissements secondaires sont reportés tant que les validations essentielles ne sont pas terminées.

## Phase 0 — séparation et fondations
- [x] Dépôt GitHub indépendant : `vjr221/maguissi-birr`.
- [x] Documents de présentation, architecture, modèle de données et workflow QHSE.
- [x] Architecture mobile modulaire et cycle de travail indépendant de VJR 221.
- [ ] Vérifier les éléments de marque et licences avant migration éventuelle de ressources historiques (à faire avant une diffusion publique, pas avant les tests locaux).

## Phase 1 — MVP mobile local

### Déjà présent dans le dépôt
- [x] Accueil et navigation principale.
- [x] 11 catégories QHSE et 14 régions.
- [x] Formulaire avec description, localité et GPS facultatif.
- [x] Sélection de photos, capture caméra et persistance locale des médias.
- [x] Référence locale clairement non officielle.
- [x] Historique local, recherche, filtrage et statuts locaux.
- [x] Export JSON et restauration additive des sauvegardes.
- [x] Conseils QHSE/environnement, validation des données et protections d’intégrité.
- [x] Tests unitaires initiaux et workflow CI.

### Validation encore requise avant bêta
- [ ] Confirmer TypeScript et Jest sur le dernier commit candidat.
- [ ] Tester sur un téléphone Android réel : démarrage, navigation, clavier, zones sûres et permissions.
- [ ] Tester la persistance des photos et des signalements après redémarrage, les erreurs de stockage et les sauvegardes.
- [ ] Vérifier TalkBack, messages d’erreur et parcours sans permissions.
- [ ] Corriger les défauts bloquants et refaire les contrôles concernés.
- [ ] Valider confidentialité, consignes d’urgence, responsabilités QHSE et support.

## Phase 2 — MVP connecté (reportée)

Ne démarrer qu’après décision de SES et validation des responsables, de l’hébergement, du budget et des obligations de confidentialité.

- [ ] API HTTPS versionnée et base de données avec migrations.
- [ ] Authentification, rôles, organisations et contrôle d’accès.
- [ ] Référence officielle et jeton de suivi générés côté serveur.
- [ ] Téléversement privé et validation serveur des médias.
- [ ] Synchronisation hors ligne avec idempotence, reprise et confirmation serveur explicite.
- [ ] Historique d’événements auditable et notifications surveillées.

## Phase 3 — console professionnelle (reportée)

- [ ] Qualification, affectation et transfert à une organisation compétente.
- [ ] Actions correctives, preuves de résolution et clôture validée.
- [ ] Délais de traitement, escalades et tableaux de bord.
- [ ] Cartographie région / département / commune et exports contrôlés.

## Phase 4 — prévention et écosystème (reportée)

- [ ] Fiches pratiques supplémentaires revues par des professionnels QHSE.
- [ ] Micro-formations et campagnes de sensibilisation.
- [ ] Partenariats et indicateurs agrégés/anonymisés avec gouvernance définie.

## Conditions de publication

- CI verte sur le commit candidat et résultats vérifiés.
- Essais sur téléphone réel et revue des risques.
- Notice de confidentialité, conditions d’utilisation et support validés.
- Responsabilités QHSE et règles d’escalade confirmées.
- Aucun statut distant simulé et aucune promesse de traitement serveur avant implémentation.
- Aucun secret dans Git ; builds signés via secrets protégés.
