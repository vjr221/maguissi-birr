# MAGUISSI BIRR — Application mobile QHSE & environnement

**Signaler. Suivre. Agir. Améliorer.**

Application mobile indépendante de VJR 221, pensée pour la prévention QHSE, les signalements environnementaux et le suivi structuré des situations à risque au Sénégal.

## État actuel

Ce dépôt contient un prototype Expo / React Native / TypeScript : accueil, formulaire, catégories QHSE, 14 régions, GPS facultatif, sélection de photos et prise de photo, historique local avec recherche, conseils pratiques, validation des données, tests unitaires initiaux et workflow GitHub Actions.

**Ce n'est pas encore une release de production.** Les signalements restent sur le téléphone. Aucun serveur ne les reçoit et la référence créée localement n'est pas un numéro de dossier officiel.

## Démarrer

Prérequis : Node.js 22 et npm.

```bash
npm install
npx expo start
npm run typecheck
npm test
```

Tester GPS et médias sur un appareil réel. Consulter l'onglet Actions du dépôt pour l'état des contrôles.

## Limites et confidentialité

- Stockage local via AsyncStorage.
- Les médias sont référencés par URI locale ; aucun téléversement n'est configuré.
- Le suivi distant, les comptes, les notifications, l'affectation et la console professionnelle nécessitent une API sécurisée.
- Le document [confidentialité](docs/PRIVACY.md) est un brouillon à valider avant toute diffusion publique.
- Ne jamais committer de secrets, certificats ou données personnelles réelles.

## Documentation

- [Présentation du produit](docs/PROJECT_PRESENTATION.md)
- [Architecture cible](docs/ARCHITECTURE.md)
- [Plan d’intégration avec le site SES](docs/SES_INTEGRATION.md)
- [Contrat API et critères d’acceptation](docs/API_CONTRACT.md)
- [Modèle de données](docs/DATA_MODEL.md)
- [Workflow QHSE](docs/WORKFLOW.md)
- [Guide environnemental](docs/ENVIRONMENT_GUIDE.md)
- [Plan de développement](docs/WORKPLAN.md)
- [Feuille de route](docs/ROADMAP.md)
- [Politique de sécurité](SECURITY.md)

L'application doit rester indépendante de VJR 221. Aucune release publique ne sera considérée prête avant validation des tests, de la sécurité, des fonctions annoncées et de la gestion des données.
