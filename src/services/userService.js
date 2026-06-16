import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { sanitizeUserUpdate } from "../utils/roleUtils";

const ALLOWED_ROLES = ['Client', 'Freelancer', 'Company', 'Vendor', 'Seller', 'Admin'];

export const UserService = {
    async createUserProfile(uid, data) {
        try {
            if (!uid) throw new Error("User ID is required");

            const role = ALLOWED_ROLES.includes(data.role) ? data.role : 'Client';
            const userRef = doc(db, "users", uid);
            const now = new Date();

            const userData = {
                ...sanitizeUserUpdate(data),
                fullName: data.fullName || data.name || '',
                avatar: data.avatar || data.profileImage || data.photoURL || null,
                createdAt: now,
                updatedAt: now,
                role,
                status: 'active',
                isBanned: false,
            };

            await setDoc(userRef, userData, { merge: true });
            return { success: true, data: userData };
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    },

    async getUserProfile(uid) {
        try {
            if (!uid) return null;
            const userRef = doc(db, "users", uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error("Error getting user profile:", error);
            throw error;
        }
    },

    async updateUserProfile(uid, data) {
        try {
            if (!uid) throw new Error("User ID is required");
            const userRef = doc(db, "users", uid);
            const safe = sanitizeUserUpdate(data);

            if (safe.profileImage && !safe.avatar) safe.avatar = safe.profileImage;
            if (safe.name && !safe.fullName) safe.fullName = safe.name;

            await updateDoc(userRef, {
                ...safe,
                updatedAt: new Date(),
            });

            return { success: true };
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },

    async deleteUserProfile(uid) {
        try {
            if (!uid) throw new Error("User ID is required");
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { status: 'deleted', isBanned: true, updatedAt: new Date() });
            return { success: true };
        } catch (error) {
            console.error("Error deleting user profile:", error);
            throw error;
        }
    },
};
