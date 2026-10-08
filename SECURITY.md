# Politique de sécurité

## Signaler une vulnérabilité
Ne publiez pas de données personnelles, de photos sensibles, de jetons ou d'informations d'exploitation dans une issue publique. Contactez le mainteneur par un canal privé lié au compte propriétaire du dépôt et décrivez :
- la version et l'environnement concernés ;
- les étapes minimales pour reproduire le problème ;
- l'impact potentiel et, si possible, une mesure d'atténuation.

## Règles de développement
- Aucun secret, clé privée, certificat de signature ou donnée personnelle réelle dans Git.
- Les secrets de publication doivent être stockés dans les secrets de l'environnement CI.
- Les signalements de démonstration doivent utiliser des données fictives.
- Les fonctions réseau devront être testées contre les accès non autorisés, abus, téléversements dangereux et fuites de données avant mise en production.
- Les changements sensibles doivent être examinés avant publication.
