# MAGUISSI BIRR — Application mobile QHSE & environnement

**Signaler. Suivre. Agir.**

MAGUISSI BIRR est une application mobile conçue pour structurer les signalements de situations à risque, soutenir la prévention QHSE et diffuser des pratiques favorables à la protection de l'environnement. L'initiative est portée par **M. Diallo, manager de SEN ENVIRONNEMENT SERVICES (SES)**.

## État actuel

Ce dépôt contient une base mobile Expo / React Native / TypeScript : accueil, formulaire de signalement, catégories QHSE, 14 régions du Sénégal, GPS facultatif, sélection et capture de photos, historique local avec recherche, conseils pratiques, validation des données, tests unitaires initiaux et workflow GitHub Actions.

**Cette version est un prototype et n'est pas une release de production.** Les signalements restent sur le téléphone. Aucun serveur ne les reçoit et la référence créée localement n'est pas un numéro de dossier officiel.

## Démarrer

Prérequis : Node.js 22 et npm.

```bash
npm install
npx expo start
npm run typecheck
npm test
```

Tester le GPS et les médias sur un appareil réel. Consulter l'onglet Actions du dépôt pour l'état des contrôles.

## Identité visuelle

- Signature : **Signaler. Suivre. Agir.**
- Logo vectoriel : [assets/branding/maguissi-birr-logo.svg](assets/branding/maguissi-birr-logo.svg)
- Icône vectorielle de référence : [assets/branding/maguissi-birr-icon.svg](assets/branding/maguissi-birr-icon.svg)
- Charte graphique : [docs/BRAND_GUIDE.md](docs/BRAND_GUIDE.md)

Les SVG sont les sources vectorielles de marque. Les ressources PNG optimisées pour les icônes natives et l'écran de lancement doivent être exportées et testées avant une release mobile.

## Limites et confidentialité

- Stockage local via AsyncStorage.
- Les médias sont référencés par URI locale ; aucun téléversement n'est configuré.
- Le suivi distant, les comptes, les notifications, l'affectation et la console professionnelle nécessitent une API sécurisée.
- Le document [confidentialité](docs/PRIVACY.md) est un brouillon à valider avant toute diffusion publique.
- Ne jamais committer de secrets, certificats ou données personnelles réelles.

## Documentation

- [Présentation du produit](docs/PROJECT_PRESENTATION.md)
- [Identité visuelle](docs/BRAND_GUIDE.md)
- [Architecture cible](docs/ARCHITECTURE.md)
- [Modèle de données](docs/DATA_MODEL.md)
- [Workflow QHSE](docs/WORKFLOW.md)
- [Guide environnemental](docs/ENVIRONMENT_GUIDE.md)
- [Plan de développement](docs/WORKPLAN.md)
- [Feuille de route](docs/ROADMAP.md)
- [Politique de sécurité](SECURITY.md)

## Initiative

MAGUISSI BIRR est une initiative portée par M. Diallo, manager de [SEN ENVIRONNEMENT SERVICES (SES)](https://sen-environnement-services.com/). L'application conserve son identité numérique propre et poursuit un objectif de prévention, de sécurité et de protection de l'environnement.

## Confidentialité et sécurité

Aucune release publique ne sera considérée prête avant validation des tests, de la sécurité, des fonctions annoncées et de la gestion des données.
