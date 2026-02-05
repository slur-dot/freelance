import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getCountFromServer, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const VendorService = {
    // --- Profile Management ---

    async getVendorProfile(vendorId) {
        try {
            const docRef = doc(db, "users", vendorId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Ensure vendor-specific fields exist or default them
                return {
                    id: docSnap.id,
                    ...data,
                    businessName: data.businessName || data.displayName || "Vendor",
                    status: data.status || { profileCompletion: 0, verified: false, rating: 0 },
                    visibility: data.visibility || { email: true, phone: true, socialLinks: true },
                    paymentMethod: data.paymentMethod || { type: "Bank", number: "" }
                };
            } else {
                // Handle case where user auth exists but doc doesn't (should represent new user)
                return null;
            }
        } catch (error) {
            console.error("Error fetching vendor profile:", error);
            throw error;
        }
    },

    async updateVendorProfile(vendorId, updates) {
        try {
            const docRef = doc(db, "users", vendorId);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            });
            return { id: vendorId, ...updates };
        } catch (error) {
            console.error("Error updating vendor profile:", error);
            throw error;
        }
    },

    async uploadAvatar(vendorId, fileBlob) {
        try {
            let uploadRef;
            if (typeof fileBlob === 'string' && fileBlob.startsWith('data:')) {
                const response = await fetch(fileBlob);
                const blob = await response.blob();
                const storageRef = ref(storage, `avatars/${vendorId}_${Date.now()}.jpg`);
                const uploadResult = await uploadBytes(storageRef, blob);
                uploadRef = uploadResult.ref;
            } else {
                const storageRef = ref(storage, `avatars/${vendorId}_${fileBlob.name}`);
                const uploadResult = await uploadBytes(storageRef, fileBlob);
                uploadRef = uploadResult.ref;
            }

            const downloadURL = await getDownloadURL(uploadRef);
            await this.updateVendorProfile(vendorId, { avatar: downloadURL });
            return downloadURL;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            throw error;
        }
    },

    // --- Dashboard Stats ---

    async getDashboardStats(vendorId) {
        try {
            // 1. Orders Count (where sellerId == vendorId)
            const ordersRef = collection(db, "orders");
            const qOrders = query(ordersRef, where("sellerId", "==", vendorId));
            const ordersSnapshot = await getCountFromServer(qOrders);
            const ordersCount = ordersSnapshot.data().count;

            // 2. Listings Count (products where sellerId == vendorId)
            const productsRef = collection(db, "products");
            const qProducts = query(productsRef, where("sellerId", "==", vendorId));
            const productsSnapshot = await getCountFromServer(qProducts);
            const listingsCount = productsSnapshot.data().count;

            // 3. Payouts Total (payouts where sellerId == vendorId)
            const payoutsRef = collection(db, "payouts");
            const qPayouts = query(payoutsRef, where("sellerId", "==", vendorId));
            const payoutsSnapshot = await getDocs(qPayouts);
            let totalPayoutsAmount = 0;
            payoutsSnapshot.forEach(doc => {
                const data = doc.data();
                totalPayoutsAmount += Number(data.amount) || 0;
            });

            return {
                ordersCount,
                listingsCount,
                totalPayoutsAmount
            };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    },

    async getVendorReviews(vendorId) {
        try {
            const reviewsRef = collection(db, "reviews");
            const q = query(reviewsRef, where("vendorId", "==", vendorId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching vendor reviews:", error);
            return []; // Return empty array on error to safely fail
        }
    },

    async deleteVendor(vendorId) {
        try {
            // Delete user document
            await deleteDoc(doc(db, "users", vendorId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting vendor:", error);
            throw error;
        }
    }
};
