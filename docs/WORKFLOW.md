# Workflow QHSE cible

1. Réception : le serveur valide et enregistre l'alerte, puis retourne une référence officielle et un horodatage.
2. Qualification : vérifier catégorie, localisation, gravité, doublon et informations manquantes.
3. Affectation : choisir une équipe ou organisation selon zone, compétence et règles validées.
4. Traitement : documenter les actions réalisées et les responsables autorisés.
5. Résolution : consigner action corrective, date, preuves et commentaire.
6. Validation : selon le processus applicable, faire valider la résolution.
7. Clôture : clôturer avec motif et historique consultable par les personnes autorisées.
8. Escalade : les cas critiques ou hors délai peuvent être signalés aux responsables selon des règles validées.

## Statuts candidats
RECEIVED, QUALIFICATION, ASSIGNED, IN_PROGRESS, NEEDS_INFO, TRANSFERRED, RESOLVED, CLOSED, REJECTED, DUPLICATE.

## Principes
- Une alerte critique affichée par l'application ne remplace pas un appel aux secours.
- La priorité opérationnelle doit suivre des critères documentés et validés par des professionnels.
- Le déclarant ne voit que les informations qui lui sont destinées, jamais les notes internes ou les données d'autres personnes.
- Aucun statut distant ne doit être simulé dans l'application hors ligne.
