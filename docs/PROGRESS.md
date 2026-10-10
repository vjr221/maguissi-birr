# MAGUISSI BIRR — Journal de progression

Dernière mise à jour : 10 octobre 2026 (UTC)  
Dépôt de référence : `vjr221/maguissi-birr`  
Branche de travail : `main`  
Identité : projet indépendant de VJR 221.

## État à reprendre lors de la prochaine session

- Dernière modification applicative : `49be8067ff5866a90c90879d8a2eb436d8a61879` — amélioration de l’accessibilité du formulaire de signalement.
- Dernier commit de documentation au moment du point : `6acf178aa89c347c3f1a95b0add3399b516b2ad9` — mise à jour de la checklist pour signaler honnêtement que la CI des nouveaux changements reste en attente.
- Modification précédente : `5ad75448e44a544466a33f75234afb664b5ebff1` — libellés de lecteur d’écran sur les cinq onglets principaux.
- Les commits sont bien écrits sur `main`. **La CI après ces changements n’a pas encore été confirmée** au moment de cette note.
- Dernière validation Android entièrement documentée : workflow [Android test APK #38010274393](https://github.com/vjr221/maguissi-birr/actions/runs/38010274393), sur le commit `4090d9c5d14e5c2c4a2ffe66ddb34b3811afc74c`. Elle a validé TypeScript, tests, Expo Doctor, compatibilité des dépendances, bundle, génération native, build APK et démarrage à froid sur émulateur. Ce résultat antérieur ne valide pas automatiquement les derniers changements.
- Version déclarée dans `package.json` et `app.json` : `1.0.1`. Ne pas publier de release finale sur la seule base du build de test.

## Changements récents

### Accessibilité de la navigation — commit `5ad7544`
Ajout de libellés explicites aux onglets Accueil, Signalements, Signaler, Prévention et Contact dans `app/_layout.tsx`.

### Accessibilité du formulaire — commit `49be806`
Dans `app/new-report.tsx` :
- les boutons de catégorie et de région exposent leur libellé et leur état sélectionné ;
- les actions caméra et galerie ont des libellés plus explicites, la galerie annonçant le nombre de photos jointes ;
- le bouton d’enregistrement expose son état désactivé/en cours et une annonce explicite de l’action.

Ces changements nécessitent encore des vérifications TypeScript/tests via CI et une vérification avec un lecteur d’écran sur appareil réel.

## Éléments de fiabilité déjà présents

- Les signalements sont stockés localement avec AsyncStorage ; aucune API serveur ne reçoit les dossiers.
- Une référence locale n’est pas un numéro officiel et ne doit pas être présentée comme une preuve de transmission.
- Si les données locales sont malformées, le stockage conserve une copie de récupération et refuse de remplacer silencieusement les dossiers.
- La restauration d’une sauvegarde est additive : les dossiers existants gagnent en cas de conflit et les médias/URI locaux ne sont pas importés depuis une autre installation.
- Les métadonnées de sauvegarde sont validées ; des tests couvrent les fichiers malformés et les conflits de restauration.

## Prochaines actions, dans l’ordre

1. Vérifier le workflow Actions déclenché par les commits récents ; corriger tout échec TypeScript, Jest, Expo Doctor ou build.
2. Lire les journaux de tests et ne déclarer aucun contrôle réussi sans résultat observé.
3. Ajouter/compléter les tests de régression pour la restauration de sauvegarde, les doublons et la préservation des données locales.
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
