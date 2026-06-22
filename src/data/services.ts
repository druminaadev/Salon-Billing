export interface PredefinedService {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const predefinedServices: PredefinedService[] = [
  // Hair Services
  { id: 'm1', name: 'Men\'s Hair Cut', price: 200, category: 'Hair' },
  { id: 'm2', name: 'Beard Trim/Style', price: 150, category: 'Hair' },
  { id: 'm3', name: 'Basic Hair Wash', price: 100, category: 'Hair' },
  { id: 'm4', name: 'Head Massage (15 Min)', price: 300, category: 'Hair' },
  { id: 'm5', name: 'Basic Hair Spa', price: 499, category: 'Hair' },
  { id: 'f17', name: 'Women\'s Hair Cut', price: 350, category: 'Hair' },
  { id: 'f18', name: 'Premium Hair Wash', price: 150, category: 'Hair' },
  { id: 'f19', name: 'Blow Dry', price: 250, category: 'Hair' },
  { id: 'f20', name: 'Basic Cut', price: 199, category: 'Hair' },
  { id: 'f21', name: 'Deep Conditioner', price: 500, category: 'Hair' },
  { id: 'f22', name: 'Premium Hair Spa', price: 500, category: 'Hair' },
  { id: 'f23', name: 'Hair Spa Advance', price: 800, category: 'Hair' },
  { id: 'f25', name: 'Root Touch-Up', price: 800, category: 'Hair' },

  // Skin Care
  { id: 'm6', name: 'Face D-Tan', price: 249, category: 'Skin Care' },
  { id: 'm7', name: 'Face & Neck D-Tan', price: 349, category: 'Skin Care' },
  { id: 'm8', name: 'Cleanup (Basic)', price: 449, category: 'Skin Care' },
  { id: 'm9', name: 'Facial Basic', price: 649, category: 'Skin Care' },
  { id: 'm10', name: 'Facial Advance', price: 999, category: 'Skin Care' },
  { id: 'f9', name: 'Cleanup (Advanced)', price: 500, category: 'Skin Care' },
  { id: 'f10', name: 'Skin Glow Face Mask', price: 500, category: 'Skin Care' },
  { id: 'f11', name: 'Facial (Normal)', price: 649, category: 'Skin Care' },
  { id: 'f12', name: 'Vitamin C Facial', price: 1400, category: 'Skin Care' },
  { id: 'f13', name: 'Anti-Ageing Facial', price: 1800, category: 'Skin Care' },
  { id: 'f14', name: 'Skin Tightening', price: 2000, category: 'Skin Care' },
  { id: 'f15', name: 'O3+ Facial', price: 3000, category: 'Skin Care' },
  { id: 'f16', name: 'Advanced Anti-Acne Facial', price: 900, category: 'Skin Care' },

  // Eye Care & Threading
  { id: 'f1', name: 'Eyebrow Threading', price: 50, category: 'Eye Care & Threading' },
  { id: 'f2', name: 'Upper Lips', price: 40, category: 'Eye Care & Threading' },
  { id: 'f3', name: 'Forehead', price: 40, category: 'Eye Care & Threading' },
  { id: 'f4', name: 'Chin', price: 40, category: 'Eye Care & Threading' },
  { id: 'f5', name: 'Full Face Threading', price: 150, category: 'Eye Care & Threading' },
  { id: 'f6', name: 'Full Face Wax', price: 250, category: 'Eye Care & Threading' },

  // Waxing (Normal Wax)
  { id: 'f26', name: 'Full Hands', price: 200, category: 'Waxing (Normal Wax)' },
  { id: 'f27', name: 'Half Legs', price: 200, category: 'Waxing (Normal Wax)' },
  { id: 'f28', name: 'Underarms', price: 70, category: 'Waxing (Normal Wax)' },
  { id: 'f29', name: 'Full Legs', price: 500, category: 'Waxing (Normal Wax)' },

  // Waxing (Rica Wax)
  { id: 'f30', name: 'Full Hands (Rica)', price: 300, category: 'Waxing (Rica Wax)' },
  { id: 'f31', name: 'Half Legs (Rica)', price: 350, category: 'Waxing (Rica Wax)' },
  { id: 'f32', name: 'Underarms (Rica)', price: 100, category: 'Waxing (Rica Wax)' },
  { id: 'f33', name: 'Full Legs (Rica)', price: 750, category: 'Waxing (Rica Wax)' },

  // Packages & Combos
  { id: 'mc1', name: 'Grooming Combo 449 (Cut, Beard, Wash, Style, D-Tan)', price: 449, category: 'Packages' },
  { id: 'mc2', name: 'Grooming Combo 599 (Cut, Beard, Wash, Style, D-Tan, Massage)', price: 599, category: 'Packages' },
  { id: 'mc3', name: 'Grooming Combo 799 (Cut, Beard, Wash, Style, Cleanup, Massage)', price: 799, category: 'Packages' },
  { id: 'mc4', name: 'Grooming Combo 1199 (Cut, Beard, Wash, Style, D-Tan, Massage, Color)', price: 1199, category: 'Packages' },
  { id: 'fc1', name: 'Basic Combo 199 (Hair Cut Only)', price: 199, category: 'Packages' },
  { id: 'fc2', name: 'Beauty Combo 499 (Cut, Wash, Dry, Eyebrow, Upper Lips, Forehead)', price: 499, category: 'Packages' },
  { id: 'fc3', name: 'Hair Care Combo 799 (Cut, Wash, Dry, Spa)', price: 799, category: 'Packages' },
  { id: 'fc4', name: 'Beauty Care Combo 799 (Cleanup, Eyebrow, Lips, Full Hand, Half Leg, Underarms)', price: 799, category: 'Packages' },
  { id: 'fc5', name: 'Premium Combo 1499 (Facial, Full Leg, Full Arm, Underarm, Threading, Spa)', price: 1499, category: 'Packages' },
  { id: 'fc6', name: 'Special Combo 2499 (O3+ Facial & D-Tan, L\'Oréal Spa, Rica Wax, Underarms, Threading)', price: 2499, category: 'Packages' },

  // Hair Treatment
  { id: 'fht1', name: 'Keratin', price: 2499, category: 'Hair Treatment' },
  { id: 'fht2', name: 'Smoothing', price: 1999, category: 'Hair Treatment' },
  { id: 'fht3', name: 'Botox', price: 2999, category: 'Hair Treatment' },
  { id: 'fht4', name: 'Nano Plastia', price: 4999, category: 'Hair Treatment' },
];
