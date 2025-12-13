import { Route } from '../types';

// Helper to determine risk based on location (Simplified for MVP)
// In a real app, this would come from a live backend
const getRisk = (name: string): Route['riskLevel'] => {
  if (name.includes('Abuja') && name.includes('Kaduna')) return 'Critical';
  if (name.includes('Maiduguri') || name.includes('Biu')) return 'Critical';
  if (name.includes('Zaria') || name.includes('Gusau')) return 'High Risk';
  if (name.includes('Lokoja') || name.includes('Okene')) return 'High Risk';
  if (name.includes('East-West') || name.includes('Eleme')) return 'Caution';
  if (name.includes('Lagos') && name.includes('Ibadan')) return 'Caution';
  return 'Safe';
};

export const FEDERAL_ROADS: Route[] = [
  // --- A-SERIES TRUNK ROADS (Main Arteries) ---
  {
    id: 'A1',
    name: 'A1: Lagos - Sokoto',
    start: 'Lagos',
    end: 'Sokoto',
    riskLevel: 'Caution',
    avgSpeed: '55 km/h',
    activeIncidents: 4,
    coordinates: [[6.45, 3.40], [7.37, 3.94], [8.48, 4.54], [9.08, 4.90], [11.50, 5.00], [13.00, 5.25]]
  },
  {
    id: 'A2',
    name: 'A2: Port Harcourt - Kano',
    start: 'Port Harcourt',
    end: 'Kano',
    riskLevel: 'High Risk',
    avgSpeed: '60 km/h',
    activeIncidents: 9,
    coordinates: [[4.78, 7.00], [6.32, 5.60], [7.80, 6.74], [9.05, 7.50], [10.52, 7.44], [12.00, 8.52]]
  },
  {
    id: 'A3',
    name: 'A3: Port Harcourt - Maiduguri',
    start: 'Port Harcourt',
    end: 'Maiduguri',
    riskLevel: 'Critical',
    avgSpeed: '45 km/h',
    activeIncidents: 15,
    coordinates: [[4.78, 7.00], [6.45, 7.50], [7.73, 8.52], [9.90, 8.90], [10.30, 9.80], [11.83, 13.15]]
  },
  {
    id: 'A4',
    name: 'A4: Calabar - Maiduguri',
    start: 'Calabar',
    end: 'Maiduguri',
    riskLevel: 'High Risk',
    avgSpeed: '50 km/h',
    activeIncidents: 7,
    coordinates: [[4.95, 8.32], [6.00, 8.70], [7.00, 9.30], [8.90, 11.30], [9.20, 12.50], [11.83, 13.15]]
  },
  
  // --- A-SERIES CONNECTORS ---
  { id: 'A5', name: 'A5: Lagos - Abeokuta - Ibadan', start: 'Lagos', end: 'Ibadan', riskLevel: 'Safe', avgSpeed: '40 km/h', activeIncidents: 1, coordinates: [[6.45, 3.40], [7.15, 3.35], [7.37, 3.94]] },
  { id: 'A6', name: 'A6: Onitsha - Owerri', start: 'Onitsha', end: 'Owerri', riskLevel: 'Caution', avgSpeed: '50 km/h', activeIncidents: 2, coordinates: [[6.15, 6.78], [5.48, 7.03]] },
  { id: 'A7', name: 'A7: Chikanda - Ilorin', start: 'Chikanda', end: 'Ilorin', riskLevel: 'Safe', avgSpeed: '70 km/h', activeIncidents: 0, coordinates: [[9.00, 3.00], [8.50, 4.55]] },
  { id: 'A8', name: 'A8: Numan - Jalingo', start: 'Numan', end: 'Jalingo', riskLevel: 'Caution', avgSpeed: '60 km/h', activeIncidents: 1, coordinates: [[9.45, 12.03], [8.89, 11.37]] },
  { id: 'A9', name: 'A9: Kano - Katsina', start: 'Kano', end: 'Katsina', riskLevel: 'High Risk', avgSpeed: '75 km/h', activeIncidents: 3, coordinates: [[12.00, 8.52], [12.99, 7.60]] },
  
  // --- EAST-WEST & CROSS COUNTRY (100-200 Series) ---
  { id: 'A121', name: 'A121: Sagamu - Benin', start: 'Sagamu', end: 'Benin', riskLevel: 'Caution', avgSpeed: '65 km/h', activeIncidents: 4, coordinates: [[6.83, 3.63], [6.80, 4.50], [6.33, 5.60]] },
  { id: 'A122', name: 'A122: Ibadan - Benin', start: 'Ibadan', end: 'Benin', riskLevel: 'Caution', avgSpeed: '55 km/h', activeIncidents: 2, coordinates: [[7.37, 3.94], [7.25, 5.20], [6.33, 5.60]] },
  { id: 'A123', name: 'A123: Ilorin - Kabba - Lokoja', start: 'Ilorin', end: 'Lokoja', riskLevel: 'High Risk', avgSpeed: '50 km/h', activeIncidents: 3, coordinates: [[8.50, 4.55], [7.83, 6.07], [7.80, 6.74]] },
  { id: 'A124', name: 'A124: Takum - Katsina Ala', start: 'Takum', end: 'Katsina Ala', riskLevel: 'Caution', avgSpeed: '45 km/h', activeIncidents: 1, coordinates: [[7.25, 10.00], [7.16, 9.30]] },
  { id: 'A125', name: 'A125: Kontagora - Sokoto', start: 'Kontagora', end: 'Sokoto', riskLevel: 'High Risk', avgSpeed: '60 km/h', activeIncidents: 5, coordinates: [[10.40, 5.47], [11.50, 5.00], [13.00, 5.25]] },
  { id: 'A126', name: 'A126: Gusau - Sabon Birni', start: 'Gusau', end: 'Sabon Birni', riskLevel: 'Critical', avgSpeed: '50 km/h', activeIncidents: 6, coordinates: [[12.17, 6.66], [13.20, 5.50]] },
  
  // --- NORTHERN & MIDDLE BELT CONNECTORS (200-300 Series) ---
  { id: 'A231', name: 'A231: Kano - Kongolam', start: 'Kano', end: 'Kongolam', riskLevel: 'High Risk', avgSpeed: '70 km/h', activeIncidents: 2, coordinates: [[12.00, 8.52], [12.80, 8.50], [13.00, 8.00]] },
  { id: 'A232', name: 'A232: Benin - Enugu', start: 'Benin', end: 'Enugu', riskLevel: 'High Risk', avgSpeed: '50 km/h', activeIncidents: 5, coordinates: [[6.33, 5.60], [6.15, 6.78], [6.45, 7.50]] },
  { id: 'A233', name: 'A233: 9th Mile - Otukpo', start: '9th Mile', end: 'Otukpo', riskLevel: 'Caution', avgSpeed: '55 km/h', activeIncidents: 1, coordinates: [[6.42, 7.40], [7.19, 8.13]] },
  { id: 'A234', name: 'A234: Abuja - Akwanga', start: 'Abuja', end: 'Akwanga', riskLevel: 'Caution', avgSpeed: '75 km/h', activeIncidents: 2, coordinates: [[9.05, 7.50], [8.90, 8.40]] },
  { id: 'A235', name: 'A235: Akwanga - Jos', start: 'Akwanga', end: 'Jos', riskLevel: 'Safe', avgSpeed: '60 km/h', activeIncidents: 0, coordinates: [[8.90, 8.40], [9.90, 8.90]] },
  { id: 'A236', name: 'A236: Zaria - Gusau', start: 'Zaria', end: 'Gusau', riskLevel: 'Critical', avgSpeed: '65 km/h', activeIncidents: 7, coordinates: [[11.08, 7.71], [12.17, 6.66]] },
  { id: 'A237', name: 'A237: Kano - Kari', start: 'Kano', end: 'Kari', riskLevel: 'High Risk', avgSpeed: '70 km/h', activeIncidents: 3, coordinates: [[12.00, 8.52], [11.50, 10.50]] },

  // --- EASTERN CONNECTORS (300-400 Series) ---
  { id: 'A341', name: 'A341: Bauchi - Yola', start: 'Bauchi', end: 'Yola', riskLevel: 'High Risk', avgSpeed: '60 km/h', activeIncidents: 4, coordinates: [[10.30, 9.80], [10.00, 11.00], [9.20, 12.50]] },
  { id: 'A342', name: 'A342: Aba - Owerri - Ihiala', start: 'Aba', end: 'Ihiala', riskLevel: 'Safe', avgSpeed: '45 km/h', activeIncidents: 1, coordinates: [[5.10, 7.35], [5.48, 7.03], [5.85, 6.85]] },
  { id: 'A343', name: 'A343: Umuahia - Uyo', start: 'Umuahia', end: 'Uyo', riskLevel: 'Safe', avgSpeed: '50 km/h', activeIncidents: 0, coordinates: [[5.52, 7.48], [5.03, 7.92]] },
  { id: 'A344', name: 'A344: Maiduguri - Bama', start: 'Maiduguri', end: 'Bama', riskLevel: 'Critical', avgSpeed: '30 km/h', activeIncidents: 8, coordinates: [[11.83, 13.15], [11.50, 13.68]] },
  { id: 'A345', name: 'A345: Bauchi - Kari', start: 'Bauchi', end: 'Kari', riskLevel: 'Caution', avgSpeed: '65 km/h', activeIncidents: 1, coordinates: [[10.30, 9.80], [11.00, 10.20]] },
  { id: 'A453', name: 'A453: Mubi - Bama', start: 'Mubi', end: 'Bama', riskLevel: 'Critical', avgSpeed: '35 km/h', activeIncidents: 6, coordinates: [[10.27, 13.26], [11.50, 13.68]] },

  // --- F-SERIES FEDERAL ROADS (Major Inter-State) ---
  { id: 'F100', name: 'F100: Lagos - Ota - Abeokuta', start: 'Lagos', end: 'Abeokuta', riskLevel: 'Caution', avgSpeed: '40 km/h', activeIncidents: 5, coordinates: [[6.60, 3.35], [6.70, 3.20], [7.15, 3.35]] },
  { id: 'F101', name: 'F101: Ikorodu - Epe - Ijebu Ode', start: 'Ikorodu', end: 'Ijebu Ode', riskLevel: 'Safe', avgSpeed: '55 km/h', activeIncidents: 0, coordinates: [[6.61, 3.50], [6.58, 3.98], [6.82, 3.92]] },
  { id: 'F102', name: 'F102: Ibadan - Oyo - Ogbomoso', start: 'Ibadan', end: 'Ogbomoso', riskLevel: 'Safe', avgSpeed: '60 km/h', activeIncidents: 1, coordinates: [[7.37, 3.94], [7.84, 3.93], [8.13, 4.25]] },
  { id: 'F103', name: 'F103: Oyo - Iseyin', start: 'Oyo', end: 'Iseyin', riskLevel: 'Caution', avgSpeed: '50 km/h', activeIncidents: 2, coordinates: [[7.84, 3.93], [7.96, 3.60]] },
  { id: 'F104', name: 'F104: Ogbomoso - Igbeti', start: 'Ogbomoso', end: 'Igbeti', riskLevel: 'Caution', avgSpeed: '55 km/h', activeIncidents: 1, coordinates: [[8.13, 4.25], [8.75, 4.13]] },
  { id: 'F105', name: 'F105: Minna - Bida', start: 'Minna', end: 'Bida', riskLevel: 'Safe', avgSpeed: '70 km/h', activeIncidents: 0, coordinates: [[9.61, 6.55], [9.08, 6.01]] },
  { id: 'F106', name: 'F106: Kaduna - Kafanchan', start: 'Kaduna', end: 'Kafanchan', riskLevel: 'High Risk', avgSpeed: '60 km/h', activeIncidents: 4, coordinates: [[10.52, 7.44], [9.58, 8.29]] },
  { id: 'F107', name: 'F107: Zaria - Pambegua', start: 'Zaria', end: 'Pambegua', riskLevel: 'High Risk', avgSpeed: '55 km/h', activeIncidents: 3, coordinates: [[11.08, 7.71], [10.80, 8.00]] },
  { id: 'F108', name: 'F108: Kano - Gwarzo', start: 'Kano', end: 'Gwarzo', riskLevel: 'Caution', avgSpeed: '60 km/h', activeIncidents: 1, coordinates: [[12.00, 8.52], [11.90, 7.90]] },
  { id: 'F109', name: 'F109: Funtua - Yashe', start: 'Funtua', end: 'Yashe', riskLevel: 'High Risk', avgSpeed: '50 km/h', activeIncidents: 2, coordinates: [[11.52, 7.31], [11.80, 7.50]] },
  { id: 'F110', name: 'F110: Gusau - Talata Mafara', start: 'Gusau', end: 'Talata Mafara', riskLevel: 'High Risk', avgSpeed: '60 km/h', activeIncidents: 4, coordinates: [[12.17, 6.66], [12.56, 6.06]] },
  { id: 'F111', name: 'F111: Sokoto - Goronyo', start: 'Sokoto', end: 'Goronyo', riskLevel: 'Critical', avgSpeed: '55 km/h', activeIncidents: 5, coordinates: [[13.00, 5.25], [13.40, 5.60]] },
  { id: 'F112', name: 'F112: Akure - Ado Ekiti', start: 'Akure', end: 'Ado Ekiti', riskLevel: 'Safe', avgSpeed: '60 km/h', activeIncidents: 0, coordinates: [[7.25, 5.20], [7.62, 5.22]] },
  { id: 'F113', name: 'F113: Owo - Ikare - Kabba', start: 'Owo', end: 'Kabba', riskLevel: 'Caution', avgSpeed: '50 km/h', activeIncidents: 2, coordinates: [[7.19, 5.58], [7.83, 6.07]] },
  { id: 'F114', name: 'F114: Auchi - Okene', start: 'Auchi', end: 'Okene', riskLevel: 'High Risk', avgSpeed: '55 km/h', activeIncidents: 4, coordinates: [[7.06, 6.27], [7.55, 6.23]] },
  { id: 'F115', name: 'F115: Lokoja - Anyigba', start: 'Lokoja', end: 'Anyigba', riskLevel: 'High Risk', avgSpeed: '60 km/h', activeIncidents: 3, coordinates: [[7.80, 6.74], [7.49, 7.17]] },
  { id: 'F116', name: 'F116: Makurdi - Gboko', start: 'Makurdi', end: 'Gboko', riskLevel: 'Caution', avgSpeed: '65 km/h', activeIncidents: 1, coordinates: [[7.73, 8.52], [7.32, 9.00]] },
  { id: 'F117', name: 'F117: Katsina Ala - Takum', start: 'Katsina Ala', end: 'Takum', riskLevel: 'Caution', avgSpeed: '50 km/h', activeIncidents: 1, coordinates: [[7.16, 9.30], [7.25, 10.00]] },
  { id: 'F118', name: 'F118: Yola - Mubi', start: 'Yola', end: 'Mubi', riskLevel: 'High Risk', avgSpeed: '60 km/h', activeIncidents: 2, coordinates: [[9.20, 12.50], [10.27, 13.26]] },
  { id: 'F119', name: 'F119: Damaturu - Biu', start: 'Damaturu', end: 'Biu', riskLevel: 'Critical', avgSpeed: '50 km/h', activeIncidents: 7, coordinates: [[11.74, 11.96], [10.60, 12.19]] },
  { id: 'F120', name: 'F120: Potiskum - Gombe', start: 'Potiskum', end: 'Gombe', riskLevel: 'High Risk', avgSpeed: '65 km/h', activeIncidents: 3, coordinates: [[11.70, 11.08], [10.28, 11.17]] },
  { id: 'F121', name: 'F121: Hadejia - Nguru', start: 'Hadejia', end: 'Nguru', riskLevel: 'Safe', avgSpeed: '70 km/h', activeIncidents: 0, coordinates: [[12.45, 10.04], [12.87, 10.45]] },
  { id: 'F122', name: 'F122: Kano - Gumel', start: 'Kano', end: 'Gumel', riskLevel: 'Caution', avgSpeed: '75 km/h', activeIncidents: 1, coordinates: [[12.00, 8.52], [12.63, 9.39]] },
  { id: 'F123', name: 'F123: Sokoto - Illela', start: 'Sokoto', end: 'Illela', riskLevel: 'Critical', avgSpeed: '60 km/h', activeIncidents: 4, coordinates: [[13.00, 5.25], [13.73, 5.30]] },
  { id: 'F124', name: 'F124: Gusau - Kaura Namoda', start: 'Gusau', end: 'Kaura Namoda', riskLevel: 'High Risk', avgSpeed: '55 km/h', activeIncidents: 3, coordinates: [[12.17, 6.66], [12.60, 6.59]] },
  { id: 'F125', name: 'F125: Yauri - Jega', start: 'Yauri', end: 'Jega', riskLevel: 'Caution', avgSpeed: '65 km/h', activeIncidents: 1, coordinates: [[10.87, 4.74], [12.21, 4.37]] },
  { id: 'F126', name: 'F126: Tegina - Birnin Gwari', start: 'Tegina', end: 'Birnin Gwari', riskLevel: 'Critical', avgSpeed: '45 km/h', activeIncidents: 9, coordinates: [[10.02, 6.17], [10.99, 6.55]] },
  { id: 'F127', name: 'F127: Birnin Kebbi - Argungu', start: 'Birnin Kebbi', end: 'Argungu', riskLevel: 'Safe', avgSpeed: '70 km/h', activeIncidents: 0, coordinates: [[12.45, 4.19], [12.74, 4.53]] },
  { id: 'F128', name: 'F128: Enugu - Abakaliki - Ikom', start: 'Enugu', end: 'Ikom', riskLevel: 'Caution', avgSpeed: '60 km/h', activeIncidents: 2, coordinates: [[6.45, 7.50], [6.32, 8.11], [5.96, 8.72]] },
  { id: 'F129', name: 'F129: Onitsha - Awka - Enugu', start: 'Onitsha', end: 'Enugu', riskLevel: 'Caution', avgSpeed: '55 km/h', activeIncidents: 3, coordinates: [[6.15, 6.78], [6.21, 7.07], [6.45, 7.50]] },
  { id: 'F130', name: 'F130: Owerri - Umuahia', start: 'Owerri', end: 'Umuahia', riskLevel: 'Safe', avgSpeed: '60 km/h', activeIncidents: 0, coordinates: [[5.48, 7.03], [5.52, 7.48]] },
  { id: 'F131', name: 'F131: Aba - Ikot Ekpene', start: 'Aba', end: 'Ikot Ekpene', riskLevel: 'Safe', avgSpeed: '50 km/h', activeIncidents: 1, coordinates: [[5.10, 7.35], [5.18, 7.71]] },
  { id: 'F132', name: 'F132: Calabar - Itu', start: 'Calabar', end: 'Itu', riskLevel: 'Caution', avgSpeed: '50 km/h', activeIncidents: 2, coordinates: [[4.95, 8.32], [5.18, 7.98]] },
  { id: 'F133', name: 'F133: Warri - Sapele', start: 'Warri', end: 'Sapele', riskLevel: 'Safe', avgSpeed: '65 km/h', activeIncidents: 0, coordinates: [[5.55, 5.79], [5.89, 5.67]] },
  { id: 'F134', name: 'F134: Asaba - Ughelli', start: 'Asaba', end: 'Ughelli', riskLevel: 'Caution', avgSpeed: '60 km/h', activeIncidents: 2, coordinates: [[6.20, 6.73], [5.49, 6.00]] },
  { id: 'F135', name: 'F135: Abuja - Lokoja', start: 'Abuja', end: 'Lokoja', riskLevel: 'High Risk', avgSpeed: '70 km/h', activeIncidents: 5, coordinates: [[9.05, 7.50], [7.80, 6.74]] },
  { id: 'F136', name: 'F136: Abuja - Kaduna', start: 'Abuja', end: 'Kaduna', riskLevel: 'Critical', avgSpeed: '85 km/h', activeIncidents: 8, coordinates: [[9.05, 7.50], [9.50, 7.40], [10.52, 7.44]] },
  { id: 'F137', name: 'F137: Kaduna - Zaria', start: 'Kaduna', end: 'Zaria', riskLevel: 'Critical', avgSpeed: '80 km/h', activeIncidents: 6, coordinates: [[10.52, 7.44], [11.08, 7.71]] },
  { id: 'F138', name: 'F138: Zaria - Kano', start: 'Zaria', end: 'Kano', riskLevel: 'High Risk', avgSpeed: '80 km/h', activeIncidents: 4, coordinates: [[11.08, 7.71], [12.00, 8.52]] },
  { id: 'F139', name: 'F139: East-West Road', start: 'Warri', end: 'Eket', riskLevel: 'Caution', avgSpeed: '65 km/h', activeIncidents: 3, coordinates: [[5.55, 5.79], [4.78, 7.00], [4.65, 7.93]] }
];
