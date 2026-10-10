# Plan de développement MAGUISSI BIRR

Ce plan distingue le code déjà présent, les validations qui bloquent une diffusion fiable et les évolutions reportables. Ne pas refaire une fonction déjà présente : vérifier d’abord son code et ses tests.

## Priorité immédiate — fiabilité du MVP local

- [x] Dépôt GitHub indépendant et architecture mobile Expo / React Native / TypeScript.
- [x] Écrans principaux, formulaire et historique des signalements conservés localement.
- [x] Catégories QHSE, 14 régions, description et localisation facultative.
- [x] Capture caméra et sélection de photos dans la galerie.
- [x] Persistance des photos dans le stockage de l’application et ré-encodage JPEG avant stockage.
- [x] Recherche/filtrage de l’historique et partage manuel du résumé.
- [x] Export JSON et restauration additive, sans écrasement des dossiers locaux ; URI des photos exclues des sauvegardes.
- [x] Validation des signalements et protections contre les données malformées, identifiants/références en double et collisions.
- [x] Premiers tests unitaires, workflow CI et documentation produit.
- [ ] Confirmer la CI sur les commits récents (typecheck et tests Jest) et corriger tout échec observé.
- [ ] Reproduire le scénario de mise à jour depuis la version publiée précédente sur un appareil de test, en conservant les données locales ; relever le message exact du crash avant de conclure à une cause.
- [ ] Vérifier que les signalements créés avec l’ancien schéma restent lisibles et que toute migration éventuelle est additive et réversible.
- [ ] Installer la version candidate sur un téléphone Android réel ; tester démarrage à froid, navigation, clavier et zones sûres.
- [ ] Tester permissions GPS/caméra/galerie acceptées et refusées, ainsi que l’absence de réseau et le stockage insuffisant.
- [ ] Vérifier les photos après fermeture/redémarrage, la création de signalements et la recherche/historique.
- [ ] Tester export et restauration avec une sauvegarde de test ; confirmer que les données existantes ne sont jamais remplacées.
- [ ] Vérifier les libellés avec TalkBack et les parcours d’erreur.
- [ ] Corriger tout défaut bloquant trouvé avant de préparer une bêta.

## Avant toute diffusion publique — prérequis

- [ ] Valider la notice de confidentialité, les conditions d’utilisation, le responsable du traitement et les durées de conservation.
- [ ] Valider les conseils de sécurité, les responsabilités QHSE et les règles d’escalade avec les personnes compétentes.
- [ ] Vérifier la marque, les licences et les droits sur les ressources graphiques avant toute migration éventuelle d’éléments historiques.
- [ ] Préparer une bêta signée seulement après validation automatisée et manuelle.

## À reporter — version connectée et console

Ces travaux ne sont pas requis pour fiabiliser le MVP local et ne doivent pas retarder ses tests de base. Les lancer seulement quand SES confirme le besoin, le responsable opérationnel, les accès autorisés, le budget et les règles de traitement des données.

- [ ] Concevoir et déployer une API HTTPS versionnée.
- [ ] Base PostgreSQL, migrations, authentification, rôles et organisations.
- [ ] Téléversement sécurisé, référence officielle et chronologie côté serveur.
- [ ] Synchronisation hors ligne avec file d’envoi, idempotence et états d’envoi confirmés.
- [ ] Notifications, affectation, suivi, actions correctives et console professionnelle.
- [ ] Sauvegardes serveur, surveillance, gestion des abus, tests de sécurité et plan de reprise.
- [ ] Cartographie opérationnelle, indicateurs avancés et exports de gestion.

## À reporter — améliorations non bloquantes

- [ ] Écran de détail de dossier plus riche.
- [ ] Micro-formations, campagnes de sensibilisation et nouveaux contenus de prévention.
- [ ] Import de ressources graphiques historiques après audit des licences.
- [ ] Finitions visuelles supplémentaires après les tests d’accessibilité et d’usage.

Aucune release de production ne doit être annoncée tant que la CI du commit candidat, les essais sur appareil réel, les exigences de confidentialité et les responsabilités opérationnelles ne sont pas validés. Aucune fonctionnalité serveur ne doit être annoncée avant son déploiement effectif.
