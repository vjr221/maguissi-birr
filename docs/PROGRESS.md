# MAGUISSI BIRR — Journal de progression

Dernière mise à jour : 10 octobre 2026 (UTC)  
Dépôt de référence : `vjr221/maguissi-birr`  
Branche de travail : `main`  
Identité : projet indépendant de VJR 221.

## État à reprendre lors de la prochaine session

- Derniers changements de code : `9fc9083bed530c1bfae7b03380cef987016bd043` (stockage local) et `7eb80929d08300922ed5943ed7227187c5d42aa5` (tests du stockage local).
- Changements de sauvegarde précédents : `71fff68843d7fec489d3d7fc6b82d568cf449b2c` (rejet des identifiants/références en double à l’export/import) et `ce08abf86696691bddd89f3e627d6f9722202a35` (tests de sauvegarde).
- Changements applicatifs précédents : `49be8067ff5866a90c90879d8a2eb436d8a61879` (accessibilité du formulaire) et `5ad75448e44a544466a33f75234afb664b5ebff1` (libellés de navigation).
- Les changements sont écrits sur `main`. **La CI pour les commits récents n’a pas été confirmée** : le connecteur GitHub disponible permet de consulter les tâches d’un run connu, mais ne fournit pas ici la liste des derniers runs push. Ne pas assimiler cette limite d’observation à un succès ou à un échec CI.
- Le workflow CI de `.github/workflows/ci.yml` exécute `npm install --no-audit --no-fund`, `npm run typecheck` et `npm test -- --ci`.
- Dernière validation Android entièrement documentée : workflow [Android test APK #38010274393](https://github.com/vjr221/maguissi-birr/actions/runs/38010274393), sur le commit `4090d9c5d14e5c2c4a2ffe66ddb34b3811afc74c`. Elle a validé TypeScript, tests, Expo Doctor, compatibilité des dépendances, bundle, génération native, build APK et démarrage à froid sur émulateur. Ce résultat antérieur ne valide pas automatiquement les derniers changements.
- Version déclarée dans `package.json` et `app.json` : `1.0.1`. Ne pas publier de release finale sur la seule base du build de test.

## Changements récents

### Intégrité du stockage local — commits `9fc9083` et `7eb8092`
- La lecture des dossiers locaux détecte désormais les identifiants ou références dupliqués, conserve une copie brute de récupération et bloque les opérations normales au lieu de continuer avec des données ambiguës.
- L’enregistrement refuse d’attribuer à un nouveau dossier une référence déjà utilisée par un autre dossier.
- Les tests couvrent la sauvegarde de récupération pour des données dupliquées et le refus d’une référence conflictuelle.
- Ces protections ne suppriment ni ne réparent automatiquement les données en conflit : elles les préservent pour investigation.

### Intégrité des sauvegardes — commits `71fff68` et `ce08abf`
- L’export refuse désormais une collection qui contient des identifiants de dossier ou des références en double.
- L’import valide le document complet puis refuse les sauvegardes ambiguës avant qu’elles puissent atteindre le processus de restauration.
- Les tests couvrent les doublons d’identifiant et de référence à l’export comme à l’import.
- La fusion additive conserve son comportement de sécurité : les dossiers locaux gagnent en cas de conflit et les doublons rencontrés lors d’une fusion directe sont ignorés sans écrasement.

### Accessibilité de la navigation — commit `5ad7544`
Ajout de libellés explicites aux onglets Accueil, Signalements, Signaler, Prévention et Contact dans `app/_layout.tsx`.

### Accessibilité du formulaire — commit `49be806`
Dans `app/new-report.tsx` :
- les boutons de catégorie et de région exposent leur libellé et leur état sélectionné ;
- les actions caméra et galerie ont des libellés plus explicites, la galerie annonçant le nombre de photos jointes ;
- le bouton d’enregistrement expose son état désactivé/en cours et une annonce explicite de l’action.

Ces changements nécessitent encore les vérifications TypeScript/tests via CI et une vérification avec un lecteur d’écran sur appareil réel.

## Éléments de fiabilité déjà présents

- Les signalements sont stockés localement avec AsyncStorage ; aucune API serveur ne reçoit les dossiers.
- Une référence locale n’est pas un numéro officiel et ne doit pas être présentée comme une preuve de transmission.
- Si les données locales sont malformées, le stockage conserve une copie de récupération et refuse de remplacer silencieusement les dossiers.
- La restauration d’une sauvegarde est additive : les dossiers existants gagnent en cas de conflit et les médias/URI locaux ne sont pas importés depuis une autre installation.
- Les métadonnées de sauvegarde sont validées ; les tests couvrent les fichiers malformés, les conflits et les identifiants/références dupliqués à l’import/export comme dans le stockage local.

## Prochaines actions, dans l’ordre

1. Confirmer le résultat CI des derniers commits depuis GitHub Actions ou en déclenchant un run contrôlé ; corriger tout échec TypeScript ou Jest.
2. Lire les journaux de tests et ne déclarer aucun contrôle réussi sans résultat observé.
3. Auditer les chemins de restauration/export de sauvegarde dans l’interface et vérifier qu’une erreur affiche un message compréhensible sans toucher aux dossiers locaux.
4. Vérifier l’accessibilité du formulaire et des cinq onglets avec TalkBack sur Android réel.
5. Exécuter la checklist de validation : permissions GPS/caméra, refus de permissions, photos après redémarrage, stockage insuffisant, recherche/historique, navigation et démarrage à froid.
6. Valider la notice de confidentialité, les responsabilités QHSE et les conditions d’utilisation avant toute bêta publique.
7. Ne préparer la release finale qu’après les contrôles automatisés et les tests sur appareil réel.

## Contraintes permanentes du projet

- Continuer les modifications sur `main`, comme demandé.
- Garder MAGUISSI BIRR distinct de VJR 221.
- Ne jamais supprimer ni remplacer les données de signalement silencieusement.
- Ne pas inventer de résultats de test, de transmissions serveur ou de statuts de dossier.
- Ne pas publier de release finale tant que les validations restantes ne sont pas terminées.
