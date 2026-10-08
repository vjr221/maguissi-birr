# Feuille de route

## Phase 0 — séparation et audit
- Dépôt GitHub dédié : `vjr221/maguissi-birr` (créé).
- Importer la base de démarrage sans toucher au dépôt VJR 221.
- Inventorier les fichiers de la branche historique `maguissi-birr` et migrer uniquement ceux qui appartiennent au produit.
- Vérifier qu'aucune référence VJR 221, secret ou URL d'API VJR 221 n'est présente.

## Phase 1 — application mobile
- Finaliser les écrans, navigation, accessibilité et validation des formulaires.
- Ajouter tests unitaires et tests de parcours.
- Tester permissions GPS/photos, mode avion, stockage insuffisant et erreurs.
- Vérifier les données de référence régionales.

## Phase 2 — backend sécurisé
- API versionnée, PostgreSQL et migrations.
- Authentification, rôles, organisations et autorisations.
- Téléversement sécurisé des pièces jointes, limites de taille et contrôle de contenu.
- Références générées côté serveur ; historique de statut auditable.
- Anti-abus, limitation de débit, sauvegardes, journalisation et supervision.

## Phase 3 — console professionnelle
- Affectation des dossiers, équipes et organisations.
- Qualification, demandes d'information, transfert et clôture motivée.
- Délais de traitement, escalades, tableaux de bord et export contrôlé.

## Phase 4 — release
- Audit des dépendances et de sécurité.
- Politique de confidentialité, conditions d'utilisation et contacts de support.
- Builds Android/iOS reproductibles, signatures protégées par secrets CI.
- Tests sur appareils réels, version bêta puis release publique.

## Critères de sortie
- Aucune dépendance à VJR 221.
- Typecheck et tests verts.
- Pas de secrets dans le dépôt.
- Les limites de la version hors ligne sont expliquées clairement.
- Backend et traitement des données validés avant toute annonce de suivi en ligne.
