import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp, orderBy } from "firebase/firestore";

export const PayoutService = {
    // Get payouts for a specific seller
    async getSellerPayouts(sellerId) {
        try {
            const payoutsRef = collection(db, "payouts");
            const q = query(payoutsRef, where("sellerId", "==", sellerId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching payouts:", error);
            throw error;
        }
    },

    // Create a new payout request
    async requestPayout(payoutData) {
        try {
            const payoutsRef = collection(db, "payouts");
            const newPayout = {
                ...payoutData,
                processedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'pending' // Default status
            };

            const docRef = await addDoc(payoutsRef, newPayout);
            return { id: docRef.id, ...newPayout };
        } catch (error) {
            console.error("Error creating payout:", error);
            throw error;
        }
    },

    // Update a payout
    async updatePayout(payoutId, updates) {
        try {
            const payoutRef = doc(db, "payouts", payoutId);
            await updateDoc(payoutRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating payout:", error);
            throw error;
        }
    },

    // Delete a payout
    async deletePayout(payoutId) {
        try {
            const payoutRef = doc(db, "payouts", payoutId);
            await deleteDoc(payoutRef);
            return { success: true };
        } catch (error) {
            console.error("Error deleting payout:", error);
            throw error;
        }
    },

    // Get payout stats
    async getPayoutStats(sellerId) {
        // Client-side calculation for MVP
        try {
            const payouts = await this.getSellerPayouts(sellerId);
            return {
                total: payouts.length,
                totalAmount: payouts.reduce((acc, curr) => acc + (curr.amount || 0), 0),
                completed: payouts.filter(p => p.status === 'completed').length,
                pending: payouts.filter(p => p.status === 'pending').length
            };
        } catch (error) {
            console.error("Error fetching payout stats:", error);
            return { total: 0, totalAmount: 0, completed: 0, pending: 0 };
        }
    }
};
