import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const UserService = {
    // Create or overwrite a user profile
    async createUserProfile(uid, data) {
        try {
            if (!uid) throw new Error("User ID is required");

            const userRef = doc(db, "users", uid);
            const now = new Date();

            const userData = {
                ...data,
                createdAt: now,
                updatedAt: now,
                // Default fields
                avatar: data.avatar || null,
                role: data.role || 'Client', // Default role if not specified
                status: 'active'
            };

            await setDoc(userRef, userData, { merge: true });
            return { success: true, data: userData };
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    },

    // Get a user profile by ID
    async getUserProfile(uid) {
        try {
            if (!uid) return null;
            const userRef = doc(db, "users", uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (error) {
            console.error("Error getting user profile:", error);
            throw error;
        }
    },

    // Update a user profile
    async updateUserProfile(uid, data) {
        try {
            if (!uid) throw new Error("User ID is required");
            const userRef = doc(db, "users", uid);

            await updateDoc(userRef, {
                ...data,
                updatedAt: new Date()
            });

            return { success: true };
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    }
};
