export const REGIONS = [
  'Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda',
  'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor'
];

export const REPORT_CATEGORIES = [
  { id: 'environment', label: 'Environnement', icon: '🌱' },
  { id: 'waste', label: 'Déchets et dépôts sauvages', icon: '♻️' },
  { id: 'water', label: 'Eau et assainissement', icon: '💧' },
  { id: 'air', label: 'Pollution de l’air', icon: '🌫️' },
  { id: 'noise', label: 'Nuisances sonores', icon: '🔊' },
  { id: 'hygiene', label: 'Hygiène et salubrité', icon: '🧼' },
  { id: 'safety', label: 'Santé et sécurité', icon: '🦺' },
  { id: 'quality', label: 'Qualité', icon: '✅' },
  { id: 'incident', label: 'Incident ou accident', icon: '⚠️' },
  { id: 'industrial-risk', label: 'Risque industriel', icon: '🏭' },
  { id: 'other', label: 'Autre situation', icon: '📍' }
] as const;
