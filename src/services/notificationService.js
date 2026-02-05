import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp, orderBy, writeBatch } from "firebase/firestore";

export const NotificationService = {
    // Get notifications for a user
    async getUserNotifications(userId) {
        try {
            const notifRef = collection(db, "notifications");
            const q = query(
                notifRef,
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            const notifRef = doc(db, "notifications", notificationId);
            await updateDoc(notifRef, {
                read: true,
                readAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    },

    // Mark all as read
    async markAllAsRead(userId) {
        try {
            const notifRef = collection(db, "notifications");
            const q = query(notifRef, where("userId", "==", userId), where("read", "==", false));
            const snapshot = await getDocs(q);

            const batch = writeBatch(db);
            snapshot.docs.forEach(doc => {
                batch.update(doc.ref, { read: true, readAt: serverTimestamp() });
            });

            await batch.commit();
            return { success: true };
        } catch (error) {
            console.error("Error marking all as read:", error);
            throw error;
        }
    },

    // Create notification (usually called by backend triggers, but useful for client-side actions too)
    async createNotification(userId, title, message, type = "info") {
        try {
            const notifRef = collection(db, "notifications");
            await addDoc(notifRef, {
                userId,
                title,
                message,
                type,
                read: false,
                createdAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    },

    async deleteNotification(notificationId) {
        try {
            await deleteDoc(doc(db, "notifications", notificationId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    }
};
