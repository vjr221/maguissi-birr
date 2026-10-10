# MAGUISSI BIRR — Journal de progression

Dernière mise à jour : 10 octobre 2026 (UTC)  
Dépôt de référence : `vjr221/maguissi-birr`  
Branche de travail : `main`  
Identité : projet indépendant de VJR 221.

## Audit de l’avancement et des priorités — 10 octobre 2026

Comparaison du plan et de la feuille de route avec le code présent sur `main` :

- **Déjà présent** : formulaire local, 11 catégories, 14 régions, GPS facultatif, caméra/galerie, persistance et ré-encodage des photos, historique avec recherche/filtrage, partage manuel, export JSON et restauration additive.
- **Déjà renforcé** : validation des sauvegardes, exclusion des URI de photos des sauvegardes, détection des données locales invalides, copie de récupération, protection contre les identifiants/références dupliqués et génération d’identifiants sans collision connue. Le flux de persistance des photos a aussi été rendu séquentiel : si une photo échoue après une ou plusieurs copies réussies, les copies créées pendant cette tentative sont nettoyées au mieux, sans supprimer les URI sources déjà présentes dans le stockage permanent.
- **À confirmer avant bêta** : CI des commits récents, essais sur Android réel, permissions acceptées/refusées, persistance après redémarrage, erreurs de stockage, sauvegarde/restauration réelle et TalkBack.
- **Crash après mise à jour** : l’utilisateur confirme le 10 octobre 2026 que ce crash est déjà corrigé. Ne pas rouvrir ce problème comme s’il était encore actif. Conserver un test de non-régression de compatibilité avec les données d’une ancienne version lors de la QA générale.
- **Reporté** : API et base serveur, synchronisation, comptes, notifications, affectation, console professionnelle, cartographie opérationnelle et enrichissements non bloquants. Ces tâches dépendent d’une décision opérationnelle de SES et ne doivent pas détourner l’effort des validations du MVP.
- Les documents `WORKPLAN.md` et `ROADMAP.md` ont été réalignés sur cet état pour ne pas recréer les fonctionnalités déjà présentes.

## État des validations

- Les changements sont écrits sur `main`.
- **La CI des commits récents n’est pas confirmée** : le connecteur GitHub disponible dans cette session ne fournit pas ici la liste des derniers runs push. Cette limite d’observation ne signifie ni réussite ni échec.
- Le workflow `.github/workflows/ci.yml` exécute `npm install --no-audit --no-fund`, `npm run typecheck` et `npm test -- --ci`.
- Dernière validation Android entièrement documentée : workflow [Android test APK #38010274393](https://github.com/vjr221/maguissi-birr/actions/runs/38010274393), sur le commit `4090d9c5d14e5c2c4a2ffe66ddb34b3811afc74c`. TypeScript, tests, Expo Doctor, compatibilité des dépendances, bundle, génération native, build APK et démarrage à froid sur émulateur ont réussi sur ce commit. Cela ne valide pas automatiquement les changements postérieurs.
- Version déclarée dans `package.json` et `app.json` : `1.0.1`. Pas de release finale sur la seule base de cet ancien build.

## Derniers changements de code

- `8ce34549` et `21282af` : refus d’un identifiant déjà lié à une autre référence et test vérifiant qu’aucune écriture n’a lieu en cas de conflit.
- `a2fec1e`, `4d6e294` et `14807ef` : génération d’identifiants/références locales avec vérification des dossiers existants, tentatives bornées et tests de collision.
- `9fc9083` et `7eb8092` : conservation d’une copie brute de récupération et blocage des opérations normales si le stockage local est malformé ou contient des identités dupliquées.
- `71fff688` et `ce08abf` : contrôles d’intégrité à l’export/import des sauvegardes et tests.
- `5ad7544` et `49be806` : libellés d’accessibilité pour la navigation et le formulaire.
- `df6a633`, `93eeb04` et `25463f3` : persistance séquentielle des photos et tests de nettoyage des copies partielles si une étape échoue. Ces nouveaux tests sont ajoutés au dépôt, mais leur exécution CI n’est pas encore confirmée.
- `fcac390b` et `e9e4dfb9` : une valeur de stockage vide (`""`) n’est plus confondue avec une clé absente ; elle est conservée dans la copie de récupération et signalée comme donnée malformée.
- `2f1c1ec7` : l’écran des signalements distingue désormais une erreur de lecture des données d’une liste réellement vide ; il explique de ne pas créer une sauvegarde vide ni désinstaller l’application pendant le diagnostic.
- `f0d5c4b7` et `61f25700` : la récupération ne prétend plus qu’une copie actuelle a été conservée si une ancienne sauvegarde différente existe déjà ou si l’écriture échoue ; des tests couvrent ces cas sans écraser la copie préexistante.

## Règles permanentes

- Continuer sur `main`, comme demandé.
- Garder MAGUISSI BIRR distinct de VJR 221.
- Ne jamais supprimer ni remplacer silencieusement les données de signalement.
- Ne pas inventer de résultats de test, de transmissions serveur ou de statuts de dossier.
- Le crash de mise à jour signalé précédemment est corrigé selon la confirmation de l’utilisateur ; se concentrer sur la non-régression, pas sur une investigation déjà résolue.
- Ne pas publier de release finale avant validation des contrôles automatisés, essais sur téléphone réel et exigences opérationnelles.

- `6d93fc6e` : l’écran Statistiques distingue désormais une erreur de lecture des données d’un véritable total à zéro ; les indicateurs ne sont pas affichés lorsque les données locales sont illisibles.
