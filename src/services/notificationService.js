import { db } from "../firebaseConfig";
import {
    collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where,
    serverTimestamp, orderBy, writeBatch,
} from "firebase/firestore";

export const NotificationService = {
    async getUserNotifications(userId) {
        try {
            const notifRef = collection(db, "notifications");
            const q = query(
                notifRef,
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        } catch (error) {
            if (error.code === 'failed-precondition') {
                const q = query(collection(db, "notifications"), where("userId", "==", userId));
                const snapshot = await getDocs(q);
                return snapshot.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => {
                        const ta = a.createdAt?.toMillis?.() ?? 0;
                        const tb = b.createdAt?.toMillis?.() ?? 0;
                        return tb - ta;
                    });
            }
            console.error("Error fetching notifications:", error);
            return [];
        }
    },

    async markAsRead(notificationId) {
        try {
            await updateDoc(doc(db, "notifications", notificationId), {
                read: true,
                readAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    },

    async markAllAsRead(userId) {
        try {
            const q = query(
                collection(db, "notifications"),
                where("userId", "==", userId),
                where("read", "==", false)
            );
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.docs.forEach((d) => {
                batch.update(d.ref, { read: true, readAt: serverTimestamp() });
            });
            await batch.commit();
            return { success: true };
        } catch (error) {
            console.error("Error marking all as read:", error);
            throw error;
        }
    },

    async createNotification(userId, title, message, options = {}) {
        try {
            const { type = "info", link = null, sourceId = null, sourceType = null, actorId = null } = options;
            await addDoc(collection(db, "notifications"), {
                userId,
                title,
                message,
                type,
                link,
                sourceId,
                sourceType,
                actorId,
                read: false,
                createdAt: serverTimestamp(),
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
    },
};
