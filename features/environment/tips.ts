export type Tip = { title: string; body: string; category: 'Déchets' | 'Eau' | 'Énergie' | 'Sécurité' | 'Biodiversité' };

export const ENVIRONMENT_TIPS: Tip[] = [
  { title: 'Réduire les déchets à la source', body: 'Privilégiez les objets réutilisables, séparez les déchets lorsque des filières adaptées existent et ne brûlez pas les déchets à l’air libre.', category: 'Déchets' },
  { title: 'Protéger les eaux', body: 'Ne versez pas d’huile, de peinture, de produits chimiques ou de médicaments dans les caniveaux, les sols ou les points d’eau.', category: 'Eau' },
  { title: 'Économiser l’énergie', body: 'Éteignez les équipements inutilisés, entretenez les installations et favorisez l’éclairage naturel lorsque cela est possible.', category: 'Énergie' },
  { title: 'Signaler sans se mettre en danger', body: 'Gardez vos distances avec les substances inconnues, les fumées et les installations endommagées. N’intervenez pas sans formation ni équipement adaptés.', category: 'Sécurité' },
  { title: 'Respecter les écosystèmes', body: 'Évitez de dégrader les mangroves, dunes et zones humides. Ne capturez pas la faune et signalez les atteintes aux autorités compétentes.', category: 'Biodiversité' }
];
