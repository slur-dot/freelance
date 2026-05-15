import { db } from "../firebaseConfig";
import {
    collection, query, where, getDocs, doc,
    addDoc, updateDoc, orderBy, serverTimestamp
} from "firebase/firestore";

/**
 * User-facing ticket service.
 * Allows any authenticated user to create support tickets
 * and check their status. Admin-side operations are in AdminService.
 */
export const TicketService = {
    /**
     * Create a support ticket from any user dashboard.
     */
    async createTicket(userId, ticketData) {
        try {
            const ticketDoc = {
                userId,
                createdBy: ticketData.createdBy || userId,
                subject: ticketData.subject || "",
                description: ticketData.description || "",
                category: ticketData.category || "general", // general, billing, technical, dispute
                priority: ticketData.priority || "medium",  // low, medium, high, urgent
                status: "open",
                assignedTo: "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, "tickets"), ticketDoc);
            return { id: docRef.id, ...ticketDoc };
        } catch (error) {
            console.error("Error creating ticket:", error);
            throw error;
        }
    },

    /**
     * Get all tickets for a specific user.
     */
    async getUserTickets(userId) {
        try {
            const q = query(
                collection(db, "tickets"),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            // Fallback without ordering if composite index missing
            console.warn("Falling back to unordered ticket query:", error);
            try {
                const q = query(
                    collection(db, "tickets"),
                    where("userId", "==", userId)
                );
                const snapshot = await getDocs(q);
                const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return tickets.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            } catch (err) {
                console.error("Error fetching user tickets:", err);
                return [];
            }
        }
    },

    /**
     * Add a reply/comment to a ticket.
     */
    async addTicketReply(ticketId, replyData) {
        try {
            const replyDoc = {
                ticketId,
                userId: replyData.userId,
                message: replyData.message,
                isAdmin: replyData.isAdmin || false,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(
                collection(db, "tickets", ticketId, "replies"),
                replyDoc
            );

            // Update ticket's updatedAt
            await updateDoc(doc(db, "tickets", ticketId), {
                updatedAt: serverTimestamp()
            });

            return { id: docRef.id, ...replyDoc };
        } catch (error) {
            console.error("Error adding ticket reply:", error);
            throw error;
        }
    },

    /**
     * Get all replies for a ticket.
     */
    async getTicketReplies(ticketId) {
        try {
            const q = query(
                collection(db, "tickets", ticketId, "replies"),
                orderBy("createdAt", "asc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching ticket replies:", error);
            return [];
        }
    }
};
