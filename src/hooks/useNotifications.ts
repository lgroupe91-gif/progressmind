import { useEffect, useCallback } from 'react';
import { Routine } from '../types';

export const useNotifications = (routines: Routine[]) => {
  const scheduleNotification = useCallback((title: string, body: string, delay: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'routine-reminder'
        });
      }, delay);
    }
  }, []);

  const scheduleRoutineReminders = useCallback(() => {
    const now = new Date();
    
    routines.forEach(routine => {
      if (routine.scheduledTime && routine.notificationsEnabled && !routine.completed) {
        const [hours, minutes] = routine.scheduledTime.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // Si l'heure est déjà passée aujourd'hui, programmer pour demain
        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        const delay = scheduledTime.getTime() - now.getTime();
        
        if (delay > 0 && delay <= 24 * 60 * 60 * 1000) { // Dans les 24h
          scheduleNotification(
            `⏰ ${routine.title}`,
            `Il est temps de faire ta routine : ${routine.description}`,
            delay
          );
          
          // Rappel 10 minutes avant
          if (delay > 10 * 60 * 1000) {
            scheduleNotification(
              `🔔 Rappel - ${routine.title}`,
              `Ta routine commence dans 10 minutes !`,
              delay - 10 * 60 * 1000
            );
          }
        }
      }
    });
  }, [routines, scheduleNotification]);

  const sendMotivationalNotification = useCallback(() => {
    const messages = [
      "🌟 C'est le moment de briller ! Commence ta routine.",
      "💪 Chaque petit pas compte. Tu peux le faire !",
      "🎯 Tes objectifs t'attendent. Action !",
      "🔥 Maintiens ta série ! Tu es sur la bonne voie.",
      "✨ Transforme cette journée en succès !"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    scheduleNotification(
      "ProgressMind - Motivation",
      randomMessage,
      0
    );
  }, [scheduleNotification]);

  useEffect(() => {
    scheduleRoutineReminders();
    
    // Notification motivationnelle quotidienne à 9h
    const now = new Date();
    const motivationTime = new Date();
    motivationTime.setHours(9, 0, 0, 0);
    
    if (motivationTime <= now) {
      motivationTime.setDate(motivationTime.getDate() + 1);
    }
    
    const motivationDelay = motivationTime.getTime() - now.getTime();
    setTimeout(sendMotivationalNotification, motivationDelay);
    
  }, [scheduleRoutineReminders, sendMotivationalNotification]);

  return {
    scheduleNotification,
    sendMotivationalNotification
  };
};