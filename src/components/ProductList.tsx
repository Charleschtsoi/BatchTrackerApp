import React, { useEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import notificationService from '../services/notificationService';
import storageService from '../services/storageService';
import { ScannedProduct } from '../types';
import ProductCard from './ProductCard';

export const ProductListScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<ScannedProduct[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
    // Refresh every 60 seconds to check for expiries
    const interval = setInterval(loadProducts, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadProducts = async () => {
    const allProducts = await storageService.getProducts();
    setProducts(allProducts);
  };

  const handleDelete = async (productId: string) => {
    Alert.alert('Delete', 'Remove this product?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await storageService.deleteProduct(productId);
          notificationService.cancelReminder(productId);
          loadProducts();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        onRefresh={loadProducts}
        refreshing={refreshing}
        ListEmptyComponent={<Text style={{ padding: 20 }}>No products scanned yet</Text>}
      />
    </View>
  );
};