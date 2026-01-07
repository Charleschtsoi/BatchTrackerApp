import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ScannedProduct } from '../types';

interface Props {
  product: ScannedProduct;
  onDelete: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onDelete }) => {
  const daysUntilExpiry = Math.ceil(
    (new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const warningColor = {
    safe: '#4CAF50',
    expires_soon: '#FF9800',
    expired: '#F44336',
  }[product.warning];

  return (
    <View style={[styles.card, { borderLeftColor: warningColor, borderLeftWidth: 5 }]}>
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.productName}>{product.productName}</Text>
      
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Batch Code:</Text>
          <Text style={styles.value}>{product.batchCode}</Text>
        </View>
        <View>
          <Text style={styles.label}>Expires:</Text>
          <Text style={[styles.value, { color: warningColor }]}>
            {product.expiryDate}
          </Text>
        </View>
      </View>

      <Text style={styles.daysLeft}>
        {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'EXPIRED'}
      </Text>

      <Button title="Delete" onPress={onDelete} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
  },
  daysLeft: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
});

export default ProductCard;