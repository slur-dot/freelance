import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const OrderService = {
    // Create a new order
    async createOrder(userId, orderData) {
        try {
            if (!userId) throw new Error("User ID is required");

            const orderRef = collection(db, "orders");
            const newOrder = {
                userId,
                items: orderData.items,
                totalAmount: orderData.totalAmount,
                shippingDetails: orderData.shippingDetails,
                paymentMethod: orderData.paymentMethod, // e.g., 'stripe', 'cod'
                status: 'pending', // pending, processing, shipped, delivered, cancelled
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(orderRef, newOrder);
            return { success: true, orderId: docRef.id };
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    // Get orders for a specific user (buyer)
    async getUserOrders(userId) {
        try {
            if (!userId) throw new Error("User ID is required");

            const ordersRef = collection(db, "orders");
            // Query orders where 'userId' matches the client's ID
            const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching user orders:", error);
            // Fallback for missing index error
            if (error.code === 'failed-precondition') {
                console.warn("Missing index for user orders query. Please create index in Firebase Console.");
            }
            return [];
        }
    },

    // Get orders for a specific seller (assuming items contain sellerId or similar structure. For MVP, we might just query all orders and filter, or cleaner: query orders where 'sellerId' is present if orders are per-seller)
    // IMPORTANT: If orders can contain items from multiple sellers, this logic needs to be more complex (e.g., separate orderItems collection).
    // For now, assuming simplifed model where an order belongs to a seller or we query by 'sellerId' field on order.
    async getSellerOrders(sellerId) {
        try {
            // Assuming 'sellerId' field exists on order. If not, we might need a composite index or changing schema.
            // For now, let's assume we filter by 'sellerId' if we store it.
            // If we don't store it, we might need to fetch all and filter client side (not scalable) or update createOrder to store it.
            // Let's assume createOrder will be updated or we use a temporary solution.

            const ordersRef = collection(db, "orders");
            const q = query(ordersRef, where("sellerId", "==", sellerId));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            // Fallback if index missing or error
            console.error("Error fetching seller orders:", error);
            return [];
        }
    },

    // Update order status
    async updateOrderStatus(orderId, status) {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: status,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    },

    // Generic update order
    async updateOrder(orderId, updates) {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    },

    // Delete order
    async deleteOrder(orderId) {
        try {
            // Note: In a real app, we might want to soft delete or check permissions
            await deleteDoc(doc(db, "orders", orderId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error;
        }
    }
};
