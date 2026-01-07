import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannedProduct } from '../types';

class StorageService {
  private STORAGE_KEY = 'SCANNED_PRODUCTS';

  // Save product to local storage
  async addProduct(product: ScannedProduct): Promise<void> {
    try {
      const products = await this.getProducts();
      products.push(product);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      console.log('Product saved:', product.id);
    } catch (error) {
      console.error('Failed to save product:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts(): Promise<ScannedProduct[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load products:', error);
      return [];
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    try {
      const products = await this.getProducts();
      const filtered = products.filter(p => p.id !== productId);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      console.log('Product deleted:', productId);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }

  // Get products by status
  async getProductsByWarning(warning: 'safe' | 'expires_soon' | 'expired') {
    const products = await this.getProducts();
    return products.filter(p => p.warning === warning);
  }

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }
}

export default new StorageService();