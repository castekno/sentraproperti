export type PropertyCategory =
  | 'Rumah'
  | 'Ruko'
  | 'Kosan'
  | 'Tanah Kavling'
  | 'Tanah Kebun'
  | 'Tanah Tambang'
  | 'Lainnya';

export type PaymentScheme = 'Cash' | 'Cash Bertahap' | 'Bank BSI' | 'Credit Developer';

export type PropertyStatus = 'Tersedia' | 'Terjual' | 'Indent' | 'Hot Deal';

export interface Project {
  id: string;
  cityId: string;
  name: string;
  groupSales?: string; // Group Sales
  category: PropertyCategory;
  address: string;
  mapUrl: string;
  price: number;
  priceDisplay?: string;
  paymentSchemes: PaymentScheme[]; // 'Cash', 'Cash Bertahap', 'Bank BSI', 'Credit Developer'
  description: string;
  landArea: number; // LT dalam m2
  buildingArea: number; // LB dalam m2
  totalUnits?: number; // Jumlah Total Unit
  availableUnits?: number; // Sisa Unit Tersedia
  bedrooms: number;
  bathrooms: number;
  carports?: number;
  floors?: number;
  electricity?: string;
  waterSource?: string;
  certificate: string; // SHM, HGB, dll
  facilities: string[];
  strategicPoints: string[];
  // 6 Foto Utama Project
  photos: string[]; // 6 URLs or Base64 images
  photoCaptions?: string[];
  // Foto Skema Cicilan (Jika Bank BSI / Cash Bertahap / Credit Developer dicentang)
  bsiSchemePhoto?: string;
  bsiSchemePhotoCaption?: string;
  cashBertahapSchemePhoto?: string;
  cashBertahapSchemePhotoCaption?: string;
  creditDeveloperSchemePhoto?: string;
  creditDeveloperSchemePhotoCaption?: string;
  featured?: boolean;
  status: PropertyStatus;
  createdAt: number;
  updatedAt: number;
}

export interface City {
  id: string;
  name: string;
  province: string;
  coverImage: string;
  description?: string;
  order?: number;
  createdAt?: number;
}

export interface PropertyFilter {
  cityId: string;
  category: string;
  searchQuery: string;
  paymentScheme: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'newest';
}

export interface DocumentationPhoto {
  id: string;
  title: string;
  caption: string;
  photoUrl: string;
  category?: string;
  date?: string;
  createdAt: number;
  updatedAt?: number;
}
