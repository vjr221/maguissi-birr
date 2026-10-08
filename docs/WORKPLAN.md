# Plan de développement

## Fondations mobiles
- [x] Dépôt indépendant.
- [x] Écrans de base, formulaire et historique local.
- [x] Catégories QHSE et 14 régions.
- [x] Conseils environnementaux enrichis.
- [x] Validation du contenu et contrôle des données locales.
- [x] Tests unitaires initiaux et CI.
- [x] Documentation produit, architecture, workflow et confidentialité de travail.

## Prochaine étape — MVP fiable
- [ ] Vérifier le résultat complet de la CI et corriger chaque échec.
- [ ] Tester Android sur appareil réel, notamment GPS, permissions, médias et persistance après redémarrage.
- [ ] Ajouter capture caméra et gestion robuste des URI de médias.
- [ ] Ajouter recherche/filtrage de l'historique, détail de dossier et export local.
- [ ] Auditer le dépôt historique et importer les éléments de marque/licence utiles sans importer des dépendances à VJR 221.

## Version connectée
- [ ] Concevoir et déployer une API sécurisée versionnée.
- [ ] Base PostgreSQL, migrations, authentification, rôles et organisations.
- [ ] Téléversement sécurisé, référence officielle et chronologie côté serveur.
- [ ] Notifications, affectation, suivi, actions correctives et console professionnelle.
- [ ] Sauvegardes, surveillance, gestion des abus, tests de sécurité et plan de reprise.

## Avant publication
- [ ] Valider responsabilités, procédure QHSE et règles d'escalade avec les acteurs métier.
- [ ] Finaliser politique de confidentialité et conditions d'utilisation avec conseil compétent.
- [ ] Tester sur appareils réels et faible connectivité.
- [ ] Vérifier accessibilité, performances, compatibilité, sécurité et dépendances.
- [ ] Produire une bêta signée et la faire tester avant la release publique.

Aucune release de production ne doit être annoncée tant que les contrôles, le fonctionnement réel des fonctions promises et la gestion des données ne sont pas validés.
