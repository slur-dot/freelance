import { db } from "../firebaseConfig";
import {
    collection, query, where, getDocs, doc, getDoc,
    addDoc, updateDoc, deleteDoc, orderBy, serverTimestamp,
    getCountFromServer
} from "firebase/firestore";

export const ContractService = {
    /**
     * Create a new contract.
     */
    async createContract(companyId, contractData) {
        try {
            const contractDoc = {
                companyId,
                vendor: contractData.vendor || "",
                type: contractData.type || "Project", // SLA, Project, Procurement
                status: "pending_signature", // pending_signature, active, completed, expired, terminated
                startDate: contractData.startDate || "",
                endDate: contractData.endDate || "",
                value: contractData.value || "",
                description: contractData.description || "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, "contracts"), contractDoc);
            return { id: docRef.id, ...contractDoc };
        } catch (error) {
            console.error("Error creating contract:", error);
            throw error;
        }
    },

    /**
     * Get all contracts for a company.
     */
    async getCompanyContracts(companyId) {
        try {
            const q = query(
                collection(db, "contracts"),
                where("companyId", "==", companyId),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            // Fallback without ordering if composite index missing
            console.warn("Falling back to unordered contract query:", error);
            try {
                const q = query(
                    collection(db, "contracts"),
                    where("companyId", "==", companyId)
                );
                const snapshot = await getDocs(q);
                const contracts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return contracts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            } catch (err) {
                console.error("Error fetching company contracts:", err);
                return [];
            }
        }
    },

    /**
     * Get contract stats for a company (counts by status).
     */
    async getContractStats(companyId) {
        try {
            const contracts = await this.getCompanyContracts(companyId);
            return {
                total: contracts.length,
                active: contracts.filter(c => c.status === "active").length,
                pending: contracts.filter(c => c.status === "pending_signature").length,
                expired: contracts.filter(c => c.status === "expired").length,
                completed: contracts.filter(c => c.status === "completed").length
            };
        } catch (error) {
            console.error("Error fetching contract stats:", error);
            return { total: 0, active: 0, pending: 0, expired: 0, completed: 0 };
        }
    },

    /**
     * Update a contract's status or details.
     */
    async updateContract(contractId, updates) {
        try {
            const contractRef = doc(db, "contracts", contractId);
            await updateDoc(contractRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating contract:", error);
            throw error;
        }
    },

    /**
     * Delete a contract.
     */
    async deleteContract(contractId) {
        try {
            await deleteDoc(doc(db, "contracts", contractId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting contract:", error);
            throw error;
        }
    }
};
