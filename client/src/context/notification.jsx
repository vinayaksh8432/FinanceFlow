import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Update unread count whenever notifications change
        const unread = notifications.filter((notif) => !notif.read).length;
        setUnreadCount(unread);
    }, [notifications]);

    const addNotification = (notification) => {
        setNotifications((prev) => [
            {
                id: Date.now(),
                timestamp: new Date(),
                read: false,
                ...notification,
            },
            ...prev,
        ]);
    };

    const markAsRead = (notificationId) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, read: true }))
        );
    };

    const clearNotification = (notificationId) => {
        setNotifications((prev) =>
            prev.filter((notif) => notif.id !== notificationId)
        );
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotifications must be used within a NotificationProvider"
        );
    }
    return context;
};
