export type Gender = 'Male' | 'Female';

export interface PredefinedService {
  id: string;
  name: string;
  price: number;
  gender: Gender;
  category: string;
}

export const predefinedServices: PredefinedService[] = [
  // Male Services
  { id: 'm1', name: 'Hair Cut', price: 200, gender: 'Male', category: 'Hair' },
  { id: 'm2', name: 'Beard', price: 150, gender: 'Male', category: 'Hair' },
  { id: 'm3', name: 'Hair Wash', price: 100, gender: 'Male', category: 'Hair' },
  { id: 'm4', name: 'Head Massage (15 Min)', price: 300, gender: 'Male', category: 'Hair' },
  { id: 'm5', name: 'Hair Spa', price: 499, gender: 'Male', category: 'Hair' },
  { id: 'm6', name: 'Face D-Tan', price: 249, gender: 'Male', category: 'Skin' },
  { id: 'm7', name: 'Face & Neck D-Tan', price: 349, gender: 'Male', category: 'Skin' },
  { id: 'm8', name: 'Cleanup', price: 449, gender: 'Male', category: 'Skin' },
  { id: 'm9', name: 'Facial Basic', price: 649, gender: 'Male', category: 'Skin' },
  { id: 'm10', name: 'Facial Advance', price: 999, gender: 'Male', category: 'Skin' },

  // Female Services - EYE CARE
  { id: 'f1', name: 'Threading', price: 50, gender: 'Female', category: 'Eye Care' },
  { id: 'f2', name: 'Upper Lips', price: 40, gender: 'Female', category: 'Eye Care' },
  { id: 'f3', name: 'Forehead', price: 40, gender: 'Female', category: 'Eye Care' },
  { id: 'f4', name: 'Chin', price: 40, gender: 'Female', category: 'Eye Care' },
  { id: 'f5', name: 'Full Face Threading', price: 150, gender: 'Female', category: 'Eye Care' },
  { id: 'f6', name: 'Full Face Wax', price: 250, gender: 'Female', category: 'Eye Care' },

  // Female Services - SKIN CARE
  { id: 'f7', name: 'Face De-Tan', price: 249, gender: 'Female', category: 'Skin Care' },
  { id: 'f8', name: 'Face & Neck', price: 349, gender: 'Female', category: 'Skin Care' },
  { id: 'f9', name: 'Cleanup', price: 500, gender: 'Female', category: 'Skin Care' },
  { id: 'f10', name: 'Skin Glow Face Mask', price: 500, gender: 'Female', category: 'Skin Care' },
  { id: 'f11', name: 'Facial (Normal)', price: 649, gender: 'Female', category: 'Skin Care' },
  { id: 'f12', name: 'Vitamin C Facial', price: 1400, gender: 'Female', category: 'Skin Care' },
  { id: 'f13', name: 'Anti-Ageing Facial', price: 1800, gender: 'Female', category: 'Skin Care' },
  { id: 'f14', name: 'Skin Tightening', price: 2000, gender: 'Female', category: 'Skin Care' },
  { id: 'f15', name: 'O3+ Facial', price: 3000, gender: 'Female', category: 'Skin Care' },
  { id: 'f16', name: 'Advanced Anti-Acne Facial', price: 900, gender: 'Female', category: 'Skin Care' },

  // Female Services - HAIR
  { id: 'f17', name: 'Hair Cut', price: 350, gender: 'Female', category: 'Hair' },
  { id: 'f18', name: 'Hair Wash', price: 150, gender: 'Female', category: 'Hair' },
  { id: 'f19', name: 'Blow Dry', price: 250, gender: 'Female', category: 'Hair' },
  { id: 'f20', name: 'Basic Cut', price: 199, gender: 'Female', category: 'Hair' },
  { id: 'f21', name: 'Deep Conditioner', price: 500, gender: 'Female', category: 'Hair' },
  { id: 'f22', name: 'Hair Spa', price: 500, gender: 'Female', category: 'Hair' },
  { id: 'f23', name: 'Hair Spa Advance', price: 800, gender: 'Female', category: 'Hair' },
  { id: 'f24', name: 'Hair Treatment', price: 1000, gender: 'Female', category: 'Hair' },
  { id: 'f25', name: 'Root Touch-Up', price: 800, gender: 'Female', category: 'Hair' },

  // Female Services - WAXING (NORMAL WAX)
  { id: 'f26', name: 'Full Hands', price: 200, gender: 'Female', category: 'Waxing (Normal Wax)' },
  { id: 'f27', name: 'Half Legs', price: 200, gender: 'Female', category: 'Waxing (Normal Wax)' },
  { id: 'f28', name: 'Underarms', price: 70, gender: 'Female', category: 'Waxing (Normal Wax)' },
  { id: 'f29', name: 'Full Legs', price: 500, gender: 'Female', category: 'Waxing (Normal Wax)' },

  // Female Services - WAXING (RICA WAX)
  { id: 'f30', name: 'Full Hands (Rica)', price: 300, gender: 'Female', category: 'Waxing (Rica Wax)' },
  { id: 'f31', name: 'Half Legs (Rica)', price: 350, gender: 'Female', category: 'Waxing (Rica Wax)' },
  { id: 'f32', name: 'Underarms (Rica)', price: 100, gender: 'Female', category: 'Waxing (Rica Wax)' },
  { id: 'f33', name: 'Full Legs (Rica)', price: 750, gender: 'Female', category: 'Waxing (Rica Wax)' },
];
