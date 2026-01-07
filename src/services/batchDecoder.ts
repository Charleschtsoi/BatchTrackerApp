import { BatchDatabase, Brand, ScannedProduct } from '../types';

class BatchDecoderService {
  private database: BatchDatabase | null = null;

  // Fetch your database repo
  async initializeDatabase() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Charleschtsoi/batch-code-database/main/BatchFormulas.json'
      );
      this.database = await response.json();
      console.log('Database loaded:', this.database.brands.length, 'brands');
    } catch (error) {
      console.error('Failed to load database', error);
      throw error;
    }
  }

  // Decode batch code
  decodeProduct(batchCode: string, brandId: string): ScannedProduct | null {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    // Find the brand
    const brand = this.database.brands.find(b => b.id === brandId);
    if (!brand) {
      console.error('Brand not found:', brandId);
      return null;
    }

    // Try each format pattern
    for (const format of brand.formats) {
      const regex = new RegExp(format.pattern);
      
      if (regex.test(batchCode)) {
        // Call the specific decoder function
        const expiryDate = this.callDecoder(format.decoder, batchCode, format);
        
        if (expiryDate) {
          return {
            id: `${brandId}-${batchCode}-${Date.now()}`,
            batchCode,
            productName: `${brand.name} Product`,
            brand: brand.name,
            expiryDate, // YYYY-MM-DD format
            scannedDate: new Date().toISOString().split('T')[0],
            category: 'Makeup/Skincare',
            warning: this.getWarning(expiryDate),
          };
        }
      }
    }

    console.warn('No matching format found for batch code:', batchCode);
    return null;
  }

  // Decoder functions for each brand
  private callDecoder(decoderName: string, batchCode: string, format: any): string | null {
    switch (decoderName) {
      case 'estee_lauder_decoder':
        return this.esteeeLauderDecoder(batchCode, format);
      case 'mac_decoder':
        return this.macDecoder(batchCode, format);
      // Add more decoders as needed
      default:
        console.warn('Unknown decoder:', decoderName);
        return null;
    }
  }

  // Example: Estée Lauder decoder
  // Batch format: L123456 = L (month) + 123456 (year/day)
  private esteeeLauderDecoder(batchCode: string, format: any): string {
    try {
      const monthMap = format.monthMap;
      const monthLetter = batchCode[0]; // 'L', 'M', 'N', etc.
      const yearCode = batchCode.substring(1, 3); // '12' = year 2012-2112
      const dayCode = batchCode.substring(3, 5); // '34' = day 34

      const month = monthMap[monthLetter];
      const year = 2000 + parseInt(yearCode);
      const day = Math.min(parseInt(dayCode), 28); // Cap at 28 to avoid invalid dates

      // Return in YYYY-MM-DD format
      const expiryDate = new Date(year, month - 1, day);
      return expiryDate.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error decoding Estée Lauder code:', error);
      return null;
    }
  }

  // Example: MAC decoder
  private macDecoder(batchCode: string, format: any): string {
    // Implement based on MAC batch code format
    // This is a placeholder
    try {
      // MAC uses format like: A01 (month/year)
      const monthYear = batchCode.substring(0, 3);
      // Parse and return expiry date
      return new Date().toISOString().split('T')[0];
    } catch (error) {
      console.error('Error decoding MAC code:', error);
      return null;
    }
  }

  // Determine warning status
  private getWarning(expiryDate: string): 'safe' | 'expires_soon' | 'expired' {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expiry < today) return 'expired';
    if (expiry < thirtyDaysFromNow) return 'expires_soon';
    return 'safe';
  }

  // Search brands by name
  searchBrands(query: string): Brand[] {
    if (!this.database) return [];
    return this.database.brands.filter(b =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default new BatchDecoderService();