import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { OrderService } from "./orderService";

export const ClientService = {
    // Get Client Profile
    async getClientProfile(uid) {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting client profile:", error);
            throw error;
        }
    },

    // Update Client Profile
    async updateClientProfile(uid, data) {
        try {
            const docRef = doc(db, "users", uid);
            await updateDoc(docRef, data);
            return { success: true };
        } catch (error) {
            console.error("Error updating client profile:", error);
            throw error;
        }
    },

    // Upload Profile Avatar
    async uploadAvatar(uid, file) {
        try {
            const storageRef = ref(storage, `client-avatars/${uid}/avatar-${Date.now()}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Update profile with new avatar URL
            await this.updateClientProfile(uid, { avatar: downloadURL });

            return downloadURL;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            throw error;
        }
    },

    // Get Dashboard Stats (Aggregated)
    async getDashboardStats(uid) {
        try {
            // Fetch User's Orders
            const orders = await OrderService.getUserOrders(uid);

            // Calculate Total Spent
            // Assuming 'totalAmount' is a number or string like "1000 GNF"
            const totalSpent = orders.reduce((sum, order) => {
                let amount = 0;
                if (typeof order.totalAmount === 'number') {
                    amount = order.totalAmount;
                } else if (typeof order.totalAmount === 'string') {
                    // Parse "1,200 GNF" -> 1200
                    const numericPart = order.totalAmount.replace(/[^0-9.-]+/g, "");
                    amount = parseFloat(numericPart) || 0;
                }
                return sum + amount;
            }, 0);

            const totalOrders = orders.length;

            // Calculate "Freelancers Hired" (Placeholder logic: unique sellerIds or generic count)
            // For now, let's just count completed orders as a proxy or 0 if no data
            const freelancersHired = 0; // Logic for this depends on project structure (Contracts vs Orders)

            return {
                totalSpent,
                totalOrders,
                freelancersHired,
                recentOrders: orders.slice(0, 5) // Return top 5 recent orders
            };
        } catch (error) {
            console.error("Error getting dashboard stats:", error);
            return {
                totalSpent: 0,
                totalOrders: 0,
                freelancersHired: 0,
                recentOrders: []
            };
        }
    },

    // Get Projects (Orders treated as projects for now)
    async getProjects(uid) {
        return await OrderService.getUserOrders(uid);
    },

    // Get Hired Freelancers (Derived from Orders)
    async getHiredFreelancers(uid) {
        try {
            const orders = await OrderService.getUserOrders(uid);
            // Mocking freelancer extraction since we don't have a direct 'freelancerId' on orders yet for all types
            // In a real app, orders would link to a freelancer profile.
            // We will return empty or map orders if they have freelancer info
            return orders.map(order => ({
                id: order.id,
                name: order.sellerName || "Unknown Freelancer",
                project: order.items?.[0]?.name || "Project",
                status: order.status || "Pending",
                completionDate: order.updatedAt?.toDate().toLocaleDateString() || "N/A",
                amount: order.totalAmount
            })).filter(f => f.name !== "Unknown Freelancer"); // Basic filter
        } catch (error) {
            console.error("Error getting hired freelancers:", error);
            return [];
        }
    },

    // Get Payments (Derived from Orders)
    async getPayments(uid) {
        try {
            const orders = await OrderService.getUserOrders(uid);
            return orders.map(order => ({
                id: order.id,
                date: order.createdAt?.toDate().toLocaleDateString(),
                activity: "Payment for " + (order.items?.[0]?.name || "Service"),
                description: "Order #" + order.id.slice(0, 5),
                from: "N/A", // Client doesn't receive, they pay
                order: order.id.slice(0, 5),
                amount: order.totalAmount
            }));
        } catch (error) {
            console.error("Error getting payments:", error);
            return [];
        }
    },

    // Get Notifications (Mock for now, or link to NotificationService)
    async getNotifications(uid) {
        // Return empty array to verify dummy data removal
        return [];
    }
};
