import React, { useState, useEffect } from 'react';
import { Bell, Clock, Volume2, VolumeX, Settings, Check, X } from 'lucide-react';

interface NotificationSettingsProps {
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setNotificationsEnabled(true);
        // Test notification
        new Notification('ProgressMind', {
          body: 'Les notifications sont maintenant activées !',
          icon: '/icon-192.png'
        });
      }
    }
  };

  const scheduleNotification = (title: string, body: string, delay: number) => {
    if (permission === 'granted') {
      setTimeout(() => {
        new Notification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png'
        });
      }, delay);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl p-4 max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {permission === 'default' && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Activer les notifications</h4>
              <p className="text-sm text-blue-700 mb-3">
                Recevez des rappels pour vos routines quotidiennes et restez motivé !
              </p>
              <button
                onClick={requestNotificationPermission}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Autoriser les notifications
              </button>
            </div>
          )}

          {permission === 'granted' && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Check className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-green-800">Notifications activées</h4>
              </div>
              <p className="text-sm text-green-700">
                Vous recevrez des rappels pour vos routines programmées.
              </p>
            </div>
          )}

          {permission === 'denied' && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">Notifications bloquées</h4>
              <p className="text-sm text-red-700">
                Pour activer les notifications, allez dans les paramètres de votre navigateur.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Types de rappels</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Routines programmées</p>
                    <p className="text-xs text-gray-600">Rappel à l'heure définie</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Rappels quotidiens</p>
                    <p className="text-xs text-gray-600">Motivation journalière</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;