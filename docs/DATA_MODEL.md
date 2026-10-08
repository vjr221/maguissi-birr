# Modèle de données cible

## Report
- id : UUID interne
- public_reference : référence générée par le serveur
- tracking_token_hash : empreinte d'un jeton de suivi aléatoire, jamais un jeton en clair
- category_id
- description
- priority : définie selon des règles validées, pas uniquement selon la perception du déclarant
- status
- region, department, commune, locality
- latitude, longitude (facultatifs)
- reporter_id (facultatif selon le parcours)
- assigned_organization_id, assigned_user_id
- created_at, updated_at, resolved_at, closed_at

## ReportEvent
- id
- report_id
- actor_id ou acteur système
- event_type
- previous_status, new_status
- note
- created_at

Chaque évolution significative produit un événement horodaté. Les événements doivent être protégés contre la modification silencieuse.

## Media
- id, report_id, media_type
- private_storage_key
- checksum
- size_bytes
- created_at
- scan_status

Ne pas conserver un chemin local d'appareil comme s'il s'agissait d'un média envoyé au serveur.

## Organization
- id, name, type, active
- périmètre géographique et catégories autorisées

## Règles
- Collecter le minimum de données personnelles nécessaire.
- Séparer la référence publique de l'identifiant interne.
- Vérifier les autorisations côté serveur pour chaque lecture et écriture.
- Définir les durées de conservation et mécanismes d'accès/suppression avant production.
