export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: 'traditional' | 'contemporary' | 'festive' | 'bridal';
  price: number;
  priceDisplay: string;
  showPrice: boolean;
  images: string[];
  description: {
    short: string;
    full: string;
  };
  specifications: {
    fabric: string;
    color: string;
    hexColor?: string; // e.g. #C4204F
    sleeveType?: string;
    neckline?: string;
    cutLength?: string;
    work: string;
    care: string;
    occasion: string;
  };
  features: string[];
  available: boolean;
  featured: boolean;
  isBestseller?: boolean;
  isNewCollection?: boolean;
  tags: string[];
  relatedProducts: string[];
}

export interface WhatsAppMessage {
  phoneNumber: string;
  message: string;
}
