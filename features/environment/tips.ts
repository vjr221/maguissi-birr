export type Tip = {
  title: string;
  body: string;
  category: 'Déchets' | 'Eau' | 'Énergie' | 'Sécurité' | 'Biodiversité' | 'Air' | 'Travail' | 'Chaleur';
};

export const ENVIRONMENT_TIPS: Tip[] = [
  { title: 'Réduire les déchets à la source', body: 'Privilégiez les objets réutilisables, séparez les déchets lorsque des filières adaptées existent et ne brûlez pas les déchets à l’air libre.', category: 'Déchets' },
  { title: 'Éviter les dépôts sauvages', body: 'Utilisez les points de collecte autorisés. Si un dépôt obstrue une route, un caniveau ou un accès de secours, signalez son emplacement sans le manipuler.', category: 'Déchets' },
  { title: 'Protéger les eaux', body: 'Ne versez pas d’huile, de peinture, de produits chimiques ou de médicaments dans les caniveaux, les sols ou les points d’eau.', category: 'Eau' },
  { title: 'Préserver l’eau au quotidien', body: 'Réparez les fuites, fermez les robinets inutilisés et signalez les fuites importantes aux services responsables. Ne touchez pas à une conduite endommagée.', category: 'Eau' },
  { title: 'Économiser l’énergie', body: 'Éteignez les équipements inutilisés, entretenez les installations et favorisez l’éclairage naturel lorsque cela est possible.', category: 'Énergie' },
  { title: 'Limiter la pollution de l’air', body: 'Évitez le brûlage à l’air libre. Si vous observez une fumée inhabituelle, éloignez-vous, évitez de l’inhaler et signalez le lieu aux services compétents.', category: 'Air' },
  { title: 'Signaler sans se mettre en danger', body: 'Gardez vos distances avec les substances inconnues, les fumées et les installations endommagées. N’intervenez pas sans formation ni équipement adaptés.', category: 'Sécurité' },
  { title: 'Réagir face à un produit inconnu', body: 'Ne touchez pas, ne sentez pas et ne mélangez jamais un produit inconnu. Éloignez les personnes de la zone et alertez les responsables ou secours compétents.', category: 'Sécurité' },
  { title: 'Prévenir les risques au travail', body: 'Repérez les sorties, respectez la signalisation, portez les équipements de protection requis et signalez les presque-accidents comme les incidents.', category: 'Travail' },
  { title: 'Se protéger de la chaleur', body: 'Buvez régulièrement de l’eau potable, recherchez l’ombre, adaptez les efforts aux conditions et suivez les consignes de prévention de votre organisation.', category: 'Chaleur' },
  { title: 'Respecter les écosystèmes', body: 'Évitez de dégrader les mangroves, dunes et zones humides. Ne capturez pas la faune et signalez les atteintes aux autorités compétentes.', category: 'Biodiversité' },
  { title: 'Documenter utilement un signalement', body: 'Indiquez le lieu, le moment, les faits observés et le risque apparent. Distinguez ce que vous avez constaté de ce que vous supposez et ne vous exposez jamais pour prendre une photo.', category: 'Sécurité' }
];
