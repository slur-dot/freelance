import { db, storage } from "../firebaseConfig";
import {
    doc, getDoc, updateDoc, deleteDoc, collection, query, where,
    getCountFromServer, getDocs, addDoc, serverTimestamp, orderBy,
} from "firebase/firestore";
import { NotificationService } from "./notificationService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMPANY_CONTACT } from "../config/companyContact";

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

    async getAllVendors() {
        try {
            const usersRef = collection(db, "users");
            const qVendor = query(usersRef, where("role", "==", "Vendor"));
            const qSeller = query(usersRef, where("role", "==", "Seller"));
            const [vendorSnap, sellerSnap] = await Promise.all([getDocs(qVendor), getDocs(qSeller)]);
            const allDocs = [...vendorSnap.docs, ...sellerSnap.docs];
            const seen = new Set();

            return allDocs.filter((d) => {
              if (seen.has(d.id)) return false;
              seen.add(d.id);
              const data = d.data();
              if (data.isBanned === true || data.status === 'inactive') return false;
              if (data.showOnVendorList === false) return false;
              return true;
            }).map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    businessName: data.businessName || data.fullName || data.displayName || data.name || "Vendor",
                    city: data.city || data.region || "Conakry, Guinea",
                    // Mock coordinates roughly around Conakry if not present
                    coordinates: data.coordinates || {
                        lat: 9.5092 + (Math.random() - 0.5) * 0.1,
                        lng: -13.7123 + (Math.random() - 0.5) * 0.1
                    }
                };
            });
        } catch (error) {
            console.error("Error fetching all vendors:", error);
            return [];
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
                const storageRef = ref(storage, `ads/avatars/${vendorId}_${Date.now()}.jpg`);
                const uploadResult = await uploadBytes(storageRef, blob);
                uploadRef = uploadResult.ref;
            } else {
                const storageRef = ref(storage, `ads/avatars/${vendorId}_${fileBlob.name}`);
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

    async postJob(vendorId, jobData) {
        try {
            let companyName = "Vendor";
            const userDoc = await getDoc(doc(db, "users", vendorId));
            if (userDoc.exists()) {
                const u = userDoc.data();
                companyName = u.businessName || u.fullName || u.name || u.displayName || "Vendor";
            }

            const docRef = await addDoc(collection(db, "projects"), {
                ...jobData,
                type: "job_posting",
                vendorId,
                companyId: vendorId,
                clientId: vendorId,
                companyName,
                posterRole: "Vendor",
                status: jobData.status || "open",
                applicants: jobData.applicants ?? 0,
                notifyEmail: COMPANY_CONTACT.vendor,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            await NotificationService.createNotification(
                vendorId,
                "Job posted",
                `Your job "${jobData.title}" is live on the job board.`,
                { type: "job_post", link: "/job-board", sourceId: docRef.id, sourceType: "job" }
            );

            return { id: docRef.id, companyId: vendorId, companyName, ...jobData };
        } catch (error) {
            console.error("Error posting vendor job:", error);
            throw error;
        }
    },

    async getVendorJobs(vendorId) {
        try {
            const jobsRef = collection(db, "projects");
            const q = query(
                jobsRef,
                where("type", "==", "job_posting"),
                where("vendorId", "==", vendorId)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.error("Error fetching vendor jobs:", error);
            return [];
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
