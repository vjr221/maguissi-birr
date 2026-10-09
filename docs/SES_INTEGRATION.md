# Intégration MAGUISSI BIRR avec Sen Environnement Services

## Décision d'architecture

Le site public de SES est accessible à `https://sen-environnement-services.com/` et présente déjà les activités QHSE, environnementales, la gestion des déchets et la formation. L'adresse de contact publiée est `info@sen-environnement-services.com` et le numéro public est `+221 77 475 21 21`.

Une page de présentation dédiée peut être publiée sous `/maguissi-birr/`, avec un lien de téléchargement de l'application, les fonctionnalités, les bonnes pratiques et une politique de confidentialité. Le tableau de bord des gestionnaires doit rester dans une zone authentifiée distincte.

## Étapes avant toute mise en production

1. Obtenir l'accord du propriétaire du site et confirmer l'accès administrateur / hébergement.
2. Vérifier la plateforme, la version PHP, les extensions, les limites d'envoi, les sauvegardes, TLS et la capacité de stockage.
3. Créer un environnement de préproduction et une sauvegarde vérifiée.
4. Installer une API versionnée et protégée; ne jamais mettre de clé secrète permanente dans l'application mobile.
5. Enregistrer les données structurées en base et les pièces jointes dans un stockage privé, hors accès direct public.
6. Envoyer les e-mails après l'enregistrement durable du dossier; conserver un journal des envois et prévoir des reprises en cas d'échec.
7. Tester abus, limites de débit, fichiers invalides, doublons, accès non autorisés, restauration et pertes de connexion.
8. Déployer après validation de SES et essais réels.

## Flux cible

- L'application valide les champs, conserve un brouillon local et met en file d'attente les envois sans réseau.
- Le serveur revalide tout, génère la référence officielle et retourne un reçu après enregistrement.
- Une clé d'idempotence empêche la création de doublons lors d'une nouvelle tentative.
- Les images sont téléversées via un flux séparé protégé, limité en taille et en types MIME; elles ne doivent pas être exposées publiquement.
- Les e-mails ne contiennent que la référence, la priorité, un résumé non sensible et un lien vers le portail sécurisé.
- Le portail exige une authentification et des rôles. Les événements de statut sont historisés avec l'identité de l'agent et l'heure.
- Un incident grave déclenche une consigne claire d'appel aux services compétents; l'application ne doit pas promettre une surveillance 24 h/24 tant que ce service n'est pas effectivement organisé.

## Modèle de données minimum

- Identifiant serveur et référence lisible.
- Catégorie, description, région, localité et coordonnées GPS facultatives.
- Date de création, priorité, statut et organisation concernée.
- Jeton de suivi aléatoire, révocable et limité à un dossier.
- Métadonnées des pièces jointes, sans URL publique.
- Historique d'événements append-only.
- État des notifications et tentatives de livraison.
- Durée de conservation, motif de clôture et preuve de résolution si nécessaire.

## Notifications

Le premier canal recommandé est l'e-mail à une liste de gestionnaires configurée côté serveur. Ne pas coder l'adresse de destination en dur dans l'application. Les alertes critiques, SMS, WhatsApp ou push pourront être ajoutés ensuite selon les comptes, coûts, règles de consentement et procédures d'escalade réellement disponibles.

## Conditions de mise en service

- Les accès au site SES et à l'hébergement sont confirmés.
- La sauvegarde et la restauration sont testées.
- La politique de confidentialité, la durée de conservation et les responsabilités de traitement sont validées.
- Les gestionnaires destinataires et les seuils de priorité sont confirmés.
- Les tests d'intégration, de sécurité et de notifications passent.
- Les signalements réels ne sont jamais envoyés à un environnement de test.

## État actuel

Le dépôt mobile utilise encore AsyncStorage sur l'appareil. Ce document décrit la cible d'intégration; il ne signifie pas que le site SES reçoit déjà des signalements. Aucun déploiement sur le site n'est effectué sans accès autorisé à son administration / hébergement.
