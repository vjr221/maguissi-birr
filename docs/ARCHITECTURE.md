# Architecture cible

## Mobile
- React Native, Expo et TypeScript.
- Modules : signalements, localisation facultative, photos, historique local, conseils, suivi serveur futur et préférences.
- Séparer l'interface, la validation métier et l'accès aux données.
- Le mode hors ligne doit afficher clairement si une donnée est locale ou synchronisée.

## API prévue
Ressources candidates, à concevoir et versionner avant implémentation :
- POST /api/v1/reports
- GET /api/v1/reports/{trackingToken}
- GET /api/v1/reports/{id}/timeline
- POST /api/v1/reports/{id}/messages
- POST /api/v1/reports/{id}/media

La consultation publique doit utiliser un jeton difficile à deviner, limité à un dossier et révocable. Ne pas exposer un dossier sur la seule base d'un identifiant séquentiel.

## Backend et données
PostgreSQL, migrations versionnées, stockage privé des médias et journal d'événements auditable. La génération de référence officielle doit être faite côté serveur. Les événements de workflow doivent être append-only ou protégés contre les modifications non autorisées.

## Sécurité
- HTTPS obligatoire.
- Authentification forte des agents et contrôle d'accès par rôle et organisation.
- Limitation de débit et protections anti-abus.
- Validation MIME, taille, type et contenu des fichiers.
- Médias stockés hors accès public direct, avec URL signée à durée limitée si nécessaire.
- Sauvegardes, journalisation, supervision et procédure d'incident.
- Minimisation des données et politique de conservation.
- Aucun secret dans le dépôt Git.

## Console professionnelle future
Qualification, affectation, escalades, actions correctives, preuves de résolution, cartographie, indicateurs et exports avec accès contrôlé.
