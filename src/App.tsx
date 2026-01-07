import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ProductListScreen } from './components/ProductList';
import { ScannerScreen } from './components/ScannerScreen';
import notificationService from './services/notificationService';

const Tab = createBottomTabNavigator();

export default function App() {
  React.useEffect(() => {
    notificationService.init();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            tabBarIcon: ({ color }) => '📱',
            title: 'Scan Product',
          }}
        />
        <Tab.Screen
          name="Products"
          component={ProductListScreen}
          options={{
            tabBarIcon: ({ color }) => '📦',
            title: 'My Products',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}