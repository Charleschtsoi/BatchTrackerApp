// Product that user scans
export interface ScannedProduct {
  id: string;
  batchCode: string;
  productName: string;
  brand: string;
  expiryDate: string; // YYYY-MM-DD
  scannedDate: string; // When user scanned it
  category: string;
  warning: 'safe' | 'expires_soon' | 'expired';
}

// Decoder format from your database
export interface BatchFormat {
  pattern: string;
  description: string;
  decoder: string;
  example: string;
  monthMap?: Record<string, number>;
}

export interface Brand {
  id: string;
  name: string;
  dataType: 'formula' | 'full_product';
  formats: BatchFormat[];
}

export interface BatchDatabase {
  version: string;
  lastUpdated: string;
  brands: Brand[];
}