import NotifService from 'react-native-notifications';
import { ScannedProduct } from '../types';

class NotificationService {
  private notificationIds: Set<string> = new Set();

  init() {
    NotifService.registerRemoteNotifications();
  }

  // Schedule reminder for expiring products
  async scheduleReminder(product: ScannedProduct) {
    try {
      const expiryDate = new Date(product.expiryDate);
      const reminderDate = new Date(expiryDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before

      if (reminderDate > new Date()) {
        NotifService.postLocalNotification({
          id: product.id,
          title: `⏰ ${product.brand} expires soon!`,
          body: `${product.productName} expires on ${product.expiryDate}`,
          fireDate: reminderDate,
          payload: { productId: product.id },
        });

        this.notificationIds.add(product.id);
        console.log('Reminder scheduled for:', product.id);
      }
    } catch (error) {
      console.error('Failed to schedule reminder:', error);
    }
  }

  // Cancel reminder
  cancelReminder(productId: string) {
    NotifService.cancelLocalNotification(productId);
    this.notificationIds.delete(productId);
  }

  // Cancel all
  cancelAll() {
    this.notificationIds.forEach(id => {
      NotifService.cancelLocalNotification(id);
    });
    this.notificationIds.clear();
  }
}

export default new NotificationService();