import { db, storage } from "../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const AdService = {
    // Get ads for a specific seller
    async getSellerAds(sellerId) {
        try {
            const adsRef = collection(db, "ads");
            const q = query(adsRef, where("sellerId", "==", sellerId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching ads:", error);
            throw error;
        }
    },

    // Create a new ad
    async createAd(adData, files) {
        try {
            const updates = { ...adData };

            // Handle file uploads
            if (files && files.length > 0) {
                const uploadPromises = files.map(async (file) => {
                    const storageRef = ref(storage, `ads/${Date.now()}_${file.name}`);
                    const uploadResult = await uploadBytes(storageRef, file);
                    return getDownloadURL(uploadResult.ref);
                });

                const urls = await Promise.all(uploadPromises);

                if (adData.type === 'banner') {
                    updates.image = urls[0];
                    updates.images = [urls[0]]; // Keep consistent structure
                } else if (adData.type === 'reel') {
                    updates.videoUrl = urls[0];
                } else if (adData.type === 'carousel') {
                    updates.images = urls;
                }
            }

            const adsRef = collection(db, "ads");
            const newAd = {
                ...updates,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'inactive', // Default to inactive
                clicks: 0,
                impressions: 0
            };

            const docRef = await addDoc(adsRef, newAd);
            return { id: docRef.id, ...newAd };
        } catch (error) {
            console.error("Error creating ad:", error);
            throw error;
        }
    },

    // Update an ad
    async updateAd(adId, updates, newImageFile) {
        try {
            let imageUrl = updates.image;

            if (newImageFile) {
                const storageRef = ref(storage, `ads/${Date.now()}_${newImageFile.name}`);
                const uploadResult = await uploadBytes(storageRef, newImageFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            const adRef = doc(db, "ads", adId);
            await updateDoc(adRef, {
                ...updates,
                image: imageUrl,
                updatedAt: serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error("Error updating ad:", error);
            throw error;
        }
    },

    // Delete an ad
    async deleteAd(adId) {
        try {
            const adRef = doc(db, "ads", adId);
            await deleteDoc(adRef);
            return { success: true };
        } catch (error) {
            console.error("Error deleting ad:", error);
            throw error;
        }
    },

    // Get ad stats
    async getAdStats(sellerId) {
        // Ideally this would be an aggregation query or a separate stats document
        // For now, calculating from client-side fetch (less efficient but works for MVP)
        const ads = await this.getSellerAds(sellerId);
        return {
            activeAds: ads.filter(a => a.status === 'active').length,
            totalClicks: ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0),
            totalImpressions: ads.reduce((acc, curr) => acc + (curr.impressions || 0), 0),
            totalSpent: ads.reduce((acc, curr) => acc + (curr.budgetSpent || 0), 0)
        };
    }
};
