import type { Card } from '../types/game';

export const SEASON_CARDS: Card[] = [
  { id: 's1', type: 'SEASON', title: 'Monsoon', description: 'Heavy rainfall and high river levels.' },
  { id: 's2', type: 'SEASON', title: 'Dry Season', description: 'Low water availability and potential drought.' },
  { id: 's3', type: 'SEASON', title: 'Winter', description: 'Moderate climate, transition period.' },
];

export const EXTREME_EVENT_CARDS: Card[] = [
  { id: 'e1', type: 'EXTREME_EVENT', title: 'Major Flood', description: 'River banks breached, infrastructure at risk.' },
  { id: 'e2', type: 'EXTREME_EVENT', title: 'Severe Drought', description: 'Water scarcity affecting agriculture and livestock.' },
  { id: 'e3', type: 'EXTREME_EVENT', title: 'Massive Erosion', description: 'Significant land loss along the river basin.' },
  { id: 'e4', type: 'EXTREME_EVENT', title: 'Wildlife Conflict', description: 'Animals entering human settlements due to habitat loss.' },
];

export const UNCERTAINTY_CARDS: Card[] = [
  { id: 'u1', type: 'UNCERTAINTY', title: 'Policy Change', description: 'New government regulations on water usage.' },
  { id: 'u2', type: 'UNCERTAINTY', title: 'Rainfall Variability', description: 'Unpredictable weather patterns making planning difficult.' },
  { id: 'u3', type: 'UNCERTAINTY', title: 'Incomplete Information', description: 'Sensor data is missing for key river sections.' },
];

export const POWER_CARDS: Card[] = [
  { id: 'p1', type: 'POWER', title: 'Hydrologist', description: 'Expert advice on water flow and flood management.' },
  { id: 'p2', type: 'POWER', title: 'Social Scientist', description: 'Insights on community impact and social cohesion.' },
  { id: 'p3', type: 'POWER', title: 'Environmentalist', description: 'Guidance on ecological preservation and biodiversity.' },
  { id: 'p4', type: 'POWER', title: 'NGO Representative', description: 'Perspective on grassroots needs and implementation.' },
];
