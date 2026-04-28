'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, BellRing, Check, CheckCheck, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  adminGetUnreadNotifications,
  adminGetNotificationCount,
  adminMarkNotificationRead,
  adminMarkAllNotificationsRead,
} from '@/service/notification/notification.action';
import { INotification } from '@/service/notification/types/notification.type';

// Generate a short beep using Web Audio API
function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch {
    // Browser may block AudioContext without user gesture — silent fail
  }
}

const AdminNotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const prevCountRef = useRef<number>(0);
  const queryClient = useQueryClient();
  const panelRef = useRef<HTMLDivElement>(null);

  // Poll unread count every 15s
  const { data: countData } = useQuery({
    queryKey: ['admin-notif-count'],
    queryFn: adminGetNotificationCount,
    refetchInterval: 15_000,
  });

  // Poll unread notifications every 15s
  const { data: notifsData } = useQuery({
    queryKey: ['admin-notifs-unread'],
    queryFn: adminGetUnreadNotifications,
    refetchInterval: 15_000,
  });

  const unreadCount = countData?.success ? countData.data.count : 0;

  useEffect(() => {
    if (notifsData?.success) setNotifications(notifsData.data);
  }, [notifsData]);

  // Play sound when new notifications arrive
  useEffect(() => {
    if (unreadCount > prevCountRef.current && prevCountRef.current >= 0) {
      playNotificationSound();
      const newCount = unreadCount - prevCountRef.current;
      toast(`${newCount} nouvelle${newCount > 1 ? 's' : ''} situation${newCount > 1 ? 's' : ''} à traiter`, {
        icon: <BellRing className="h-4 w-4 text-amber-500" />,
        style: { background: '#111827', color: '#f9fafb', border: '1px solid #f59e0b', borderRadius: '10px' },
      });
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMarkRead = async (id: string) => {
    const res = await adminMarkNotificationRead(id);
    if (res.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      queryClient.invalidateQueries({ queryKey: ['admin-notif-count'] });
    } else toast.error(res.error);
  };

  const handleMarkAllRead = async () => {
    const res = await adminMarkAllNotificationsRead();
    if (res.success) {
      setNotifications([]);
      queryClient.invalidateQueries({ queryKey: ['admin-notif-count'] });
    } else toast.error(res.error);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-gray-800 hover:bg-gray-700 transition border border-gray-700"
        aria-label="Notifications"
      >
        {unreadCount > 0
          ? <BellRing className="h-4 w-4 text-amber-400 animate-[wiggle_1s_ease-in-out_infinite]" />
          : <Bell className="h-4 w-4 text-gray-400" />
        }
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <span className="font-semibold text-white text-sm">Notifications</span>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Tout marquer lu
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-800">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-500 text-sm">
                Aucune notification non lue
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800 transition">
                  <div className="shrink-0 mt-0.5 h-7 w-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <BellRing className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-snug">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(notif.createdAt).toLocaleString('fr-FR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="shrink-0 mt-0.5 text-gray-500 hover:text-green-400 transition"
                    title="Marquer comme lu"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-800 bg-gray-900">
            <a
              href="/admin/situations"
              className="flex items-center justify-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Voir toutes les situations
            </a>
          </div>
        </div>
      )}

      {/* Wiggle animation */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminNotificationBell;
