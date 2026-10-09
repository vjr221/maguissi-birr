# Contrat API proposé — MAGUISSI BIRR / SES

Ce contrat décrit la cible à implémenter et tester. Il ne correspond pas à un serveur déjà déployé. Toutes les routes doivent être servies en HTTPS.

## Principes

- Préfixe versionné : `/wp-json/maguissi-birr/v1` si l'intégration WordPress est retenue, sinon `/api/v1`.
- Le mobile est un client non fiable : le serveur revalide tous les champs et ne contient aucun secret SMTP ou administrateur.
- Chaque envoi porte un UUID d'idempotence. Une nouvelle tentative du même envoi renvoie le même dossier plutôt que de créer un doublon.
- Référence officielle et horodatage sont générés côté serveur.
- Les données sensibles et les pièces jointes ne sont jamais accessibles par une URL publique permanente.
- Les changements d'état et les tentatives de notification sont inscrits dans un journal d'audit.
- Les réponses d'erreur ne doivent jamais exposer de traces PHP, secrets, chemins de fichiers ou données d'autres dossiers.

## Routes proposées

| Méthode | Route | Accès | Usage |
|---|---|---|---|
| POST | `/reports` | Déclarant / jeton d'accès limité | Créer un signalement |
| GET | `/reports/{reference}` | Gestionnaire authentifié ou jeton de suivi aléatoire | Consulter un dossier autorisé |
| POST | `/reports/{reference}/attachments` | Dossier autorisé | Envoyer une pièce jointe validée |
| GET | `/manager/reports` | Rôle gestionnaire QHSE | Liste filtrée et paginée |
| PATCH | `/manager/reports/{id}` | Rôle autorisé | Modifier statut, priorité et affectation |
| POST | `/manager/reports/{id}/actions` | Rôle gestionnaire | Enregistrer une action corrective |
| GET | `/manager/metrics` | Rôle superviseur | Indicateurs agrégés |
| GET | `/health` | Public, sans détail système | Disponibilité minimale |

## Création d'un signalement

Exemple de corps sans photo :

```json
{
  "client_submission_id": "UUID-generated-on-device",
  "category_id": "environment",
  "description": "Description factuelle de la situation observée.",
  "region": "Dakar",
  "locality": "Localité facultative",
  "latitude": 14.7167,
  "longitude": -17.4677,
  "occurred_at": "2026-10-09T10:30:00Z"
}
```

Le serveur répond avec un code de création, une référence publique non séquentielle si possible, un statut initial, la date de réception et un jeton de suivi à forte entropie. Les réponses de suivi ne doivent retourner que les informations explicitement autorisées.

## Pièces jointes

- Liste blanche des formats image, taille maximale configurable, contrôle MIME réel et décodage.
- Renommer côté serveur, supprimer les métadonnées EXIF si nécessaire et analyser les fichiers.
- Stockage privé; téléchargement par contrôleur après vérification de l'autorisation.
- Limiter le nombre de photos par dossier et refuser les fichiers vides ou malformés.

## Notifications e-mail

- Destinataire opérationnel initial demandé : `moctar.diallo@sen-environnement-services.com`, à enregistrer dans la configuration privée du serveur.
- L'e-mail est créé seulement après validation et enregistrement transactionnel du dossier. Le message contient la référence, la priorité et un lien vers le portail protégé; pas de photos en pièce jointe par défaut.
- Les destinataires et identifiants SMTP sont configurés côté serveur et non dans l'application mobile ou dans le dépôt public. Tester la délivrabilité avant production.
- En cas d'échec, la notification est remise en file et une nouvelle tentative est journalisée. La mise en file doit être indépendante de la transaction de signalement afin qu'une panne d'e-mail ne fasse pas perdre le dossier.

## Contrôle d'accès

Rôles minimaux : administrateur technique, superviseur QHSE, gestionnaire QHSE, lecteur/auditeur. Le déclarant ne peut consulter qu'un dossier auquel il a accès via une session ou un jeton de suivi non devinable. Prévoir limitation de débit, protection CSRF sur les sessions web, validation des entrées, échappement des sorties, journalisation sans données excessives et révocation des sessions.

## Synchronisation mobile

1. Le mobile place la soumission dans une file locale avec un UUID stable.
2. Le serveur vérifie les données et l'idempotence.
3. Le mobile marque l'envoi comme confirmé seulement après accusé de réception serveur.
4. Les erreurs réseau peuvent être réessayées avec le même UUID; les erreurs de validation sont montrées à l'utilisateur.
5. Les données en attente sont visibles dans l'application, avec une commande de reprise et un indicateur clair.

## Critères d'acceptation

- Deux envois du même UUID ne créent qu'un dossier.
- Un utilisateur non connecté ne peut pas accéder aux vues gestionnaires.
- Un gestionnaire ne peut modifier que les dossiers permis par son rôle.
- Les photos ne sont pas accessibles par lien direct public.
- L'e-mail part après persistance, et les échecs sont traçables.
- Une coupure réseau pendant l'envoi ne perd pas le brouillon.
- Sauvegarde et restauration de la base et des pièces jointes sont testées.
- Les règles de confidentialité, conservation, escalade et gestion des incidents sont validées par SES avant la production.
