# MAGUISSI BIRR — Application mobile QHSE & environnement

Application mobile indépendante de VJR 221, orientée prévention QHSE, signalement de situations à risque et sensibilisation environnementale au Sénégal.

## État actuel

La base Expo/React Native est maintenant versionnée dans ce dépôt. Il s'agit d'un **prototype fonctionnel de départ**, pas encore d'une release de production validée. Les signalements sont enregistrés localement sur l'appareil et ne sont envoyés à aucun serveur.

## Fonctionnalités de départ

- Accueil mobile avec accès rapide aux fonctions principales.
- Formulaire de signalement : catégorie, région, localité, description, GPS facultatif et sélection de photos.
- Historique local des signalements.
- Conseils de prévention sur les déchets, l'eau, l'énergie, la sécurité et la biodiversité.
- Workflow GitHub Actions pour lancer le contrôle TypeScript.
- Documentation et feuille de route de développement.

## Lancer le projet

Prérequis : Node.js 22 et npm.

```bash
npm install
npx expo start
```

Puis ouvrir le projet dans Expo Go ou un émulateur compatible. Selon les versions des outils et de l'appareil, certaines fonctions natives (GPS, photos) devront être vérifiées sur un appareil réel.

Contrôle TypeScript :

```bash
npm run typecheck
```

## Confidentialité et limites

- Les signalements restent sur l'appareil avec AsyncStorage.
- La référence générée est locale et ne constitue pas un numéro de dossier officiel.
- Les photos sont référencées par URI locale ; le transfert et la gestion sécurisée des pièces jointes ne sont pas implémentés.
- Le suivi à distance, les comptes utilisateurs et l'espace de gestion exigent une API sécurisée qui n'est pas encore configurée.
- N'ajoutez jamais de clés, certificats ou secrets dans le dépôt.

## Principes

- Dépôt, identité, versions et cycle de release indépendants de VJR 221.
- Consentement clair pour l'accès à la localisation et aux photos.
- Ne jamais demander à l'utilisateur de s'exposer à un danger pour documenter un incident.
- Conseils adaptés au contexte sénégalais, à valider par des professionnels QHSE avant publication.

## Suite du développement

Consulter [la feuille de route](docs/ROADMAP.md). La migration du contenu historique doit être auditée avant d'être considérée comme terminée.
