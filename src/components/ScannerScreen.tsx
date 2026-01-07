import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import batchDecoder from '../services/batchDecoder';
import notificationService from '../services/notificationService';
import storageService from '../services/storageService';
import { Brand } from '../types';

export const ScannerScreen = () => {
  const [scannedData, setScannedData] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await batchDecoder.initializeDatabase();
      const allBrands = batchDecoder.searchBrands(''); // Get all
      setBrands(allBrands);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load database');
    }
  };

  // Handle barcode scan
  const onBarCodeRead = async (event: any) => {
    const batchCode = event.data;
    setScannedData(batchCode);

    if (!selectedBrand) {
      Alert.alert('Please select a brand first');
      return;
    }

    // Decode the batch code
    const decodedProduct = batchDecoder.decodeProduct(
      batchCode,
      selectedBrand.id
    );

    if (decodedProduct) {
      // Save to local storage
      await storageService.addProduct(decodedProduct);

      // Schedule reminder
      await notificationService.scheduleReminder(decodedProduct);

      Alert.alert(
        'Success! ✅',
        `${decodedProduct.productName}\nExpires: ${decodedProduct.expiryDate}`,
        [{ text: 'OK' }]
      );

      setScannedData(''); // Reset scanner
    } else {
      Alert.alert('Error', 'Could not decode batch code for this brand');
    }
  };

  if (loading) {
    return <Text>Loading database...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          {selectedBrand ? `Selected: ${selectedBrand.name}` : 'Select a brand:'}
        </Text>
        <FlatList
          horizontal
          data={brands}
          keyExtractor={b => b.id}
          renderItem={({ item }) => (
            <Button
              title={item.name}
              onPress={() => setSelectedBrand(item)}
              color={selectedBrand?.id === item.id ? 'blue' : 'gray'}
            />
          )}
        />
      </View>

      <RNCamera
        style={{ flex: 1 }}
        onBarCodeRead={onBarCodeRead}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      />

      <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
        <Text>Last scan: {scannedData || 'None'}</Text>
      </View>
    </View>
  );
};