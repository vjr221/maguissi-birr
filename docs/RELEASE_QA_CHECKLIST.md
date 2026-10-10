# MAGUISSI BIRR — Checklist de validation avant publication

Cette checklist complète les contrôles automatisés. Elle ne remplace pas un essai sur un téléphone Android réel ni la validation des procédures QHSE par les personnes responsables.

### Résultat automatisé vérifié — 10 octobre 2026
Le workflow [Android test APK, run 38010274393](https://github.com/vjr221/maguissi-birr/actions/runs/38010274393) a réussi sur le commit `4090d9c5d14e5c2c4a2ffe66ddb34b3811afc74c` : TypeScript et tests unitaires, Expo Doctor, compatibilité des dépendances, bundle Android, génération native, build APK release et démarrage à froid sur émulateur. L’APK de test a été archivé comme artefact GitHub (valide jusqu’au 24 octobre 2026). SHA-256 de l’APK : `8a8fdb58420d9a43a3e4b8e3abb493849a1a16488b9bf5cc3252570d9f4eec60`. Le code applicatif de `main` n’a pas changé depuis ce commit ; les commits suivants sont documentaires. Ce résultat ne remplace pas les essais sur téléphone réel et ne constitue pas une nouvelle release publique.

## 1. Build et qualité logicielle
- [x] CI : vérification TypeScript et tests unitaires réussis (run 38010274393).
- [x] Expo Doctor et vérification de compatibilité des dépendances réussis (run 38010274393).
- [x] Bundle JavaScript Android exporté sans erreur (run 38010274393).
- [x] APK release construit avec le bundle embarqué (pas de serveur de développement requis ; run 38010274393).
- [x] APK installé sur émulateur Android et démarrage à froid sans crash détecté (run 38010274393).
- [ ] Installer l’APK sur un téléphone Android réel et vérifier l’ouverture à froid.
- [ ] Navigation par les cinq onglets, retour Android, clavier et zones sûres vérifiés.
- [ ] Permissions demandées uniquement au moment nécessaire et refus sans blocage de l’application.

## 2. Signalements et données locales
- [ ] Créer un signalement sans photo ni GPS.
- [ ] Créer un signalement avec GPS autorisé, puis avec permission refusée.
- [ ] Ajouter, prévisualiser et supprimer des photos ; vérifier que les photos restent accessibles après fermeture/réouverture.
- [ ] Vérifier la validation des champs, la référence unique et la prévention du double envoi.
- [ ] Rechercher, filtrer et ouvrir les signalements ; modifier le statut et vérifier l’historique.
- [ ] Vérifier qu’une erreur de lecture ne se transforme pas en liste vide et n’écrase pas les données.
- [ ] Exporter une sauvegarde JSON ; confirmer que les photos ne sont pas incluses et que l’avertissement sur les lieux/GPS est affiché.
- [ ] Restaurer une sauvegarde dans une installation de test ; confirmer l’ajout des nouveaux dossiers, le rejet des fichiers invalides et la conservation des dossiers existants.
- [ ] Tester les doublons par identifiant et référence.
- [ ] Vérifier les statistiques après création, modification de statut et restauration.

## 3. Checklist prévention et sécurité
- [ ] Cocher des éléments, quitter l’écran et revenir ; vérifier la persistance.
- [ ] Tester la réinitialisation après confirmation explicite.
- [ ] Vérifier les consignes pour feu, fuite inconnue, blessure et risque électrique.
- [ ] Vérifier les numéros d’urgence localement avant toute diffusion publique.
- [ ] Confirmer qu’aucun texte ne laisse croire qu’un secours ou une équipe SES est automatiquement alerté.

## 4. Confidentialité
- [ ] Vérifier que l’utilisateur sait que les signalements sont conservés localement tant qu’aucun serveur n’est configuré.
- [ ] Vérifier que l’export partage uniquement les données annoncées et qu’aucune photo ni coordonnée n’est ajoutée au résumé de partage par inadvertance.
- [ ] Vérifier que les photos sont ré-encodées avant stockage et que les URI privées ne sont pas présentées comme des liens publics.
- [ ] Tester le comportement de l’application après refus des permissions et indisponibilité du stockage.
- [ ] Ne jamais publier de sauvegarde réelle dans les issues, journaux CI ou dépôts publics.

## 5. Avant une intégration serveur SES
- [ ] Déployer une API HTTPS authentifiée sur un environnement de test autorisé.
- [ ] Définir qui peut consulter, modifier, exporter et supprimer chaque signalement.
- [ ] Ajouter validation côté serveur, limitation de débit, journal d’audit, sauvegardes et politique de conservation.
- [ ] Définir un consentement explicite avant transmission des coordonnées GPS et photos.
- [ ] Mettre en place une file d’envoi hors ligne avec identifiant idempotent, reprises contrôlées et états « en attente / envoyé / échec ».
- [ ] Ne marquer un dossier comme transmis qu’après confirmation explicite de l’API.
- [ ] Tester authentification, permissions, erreurs réseau, doublons, pièces jointes et restauration.
- [ ] Documenter le responsable opérationnel qui reçoit et traite réellement les alertes.

## Critères de publication
La publication stable exige que les contrôles automatisés et le test de démarrage Android passent. Les contrôles manuels doivent être réalisés sur un appareil réel avant diffusion large. Tant qu’une API n’est pas déployée et configurée, l’application doit continuer à indiquer clairement que les signalements restent sur l’appareil et qu’aucune équipe n’est notifiée automatiquement.
