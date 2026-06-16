import { db } from "../firebaseConfig";
import {
    collection, addDoc, serverTimestamp, query, where, getDocs,
    doc, updateDoc, deleteDoc, getDoc,
} from "firebase/firestore";

/** Canonical order statuses */
export const ORDER_STATUS = {
    PENDING_PAYMENT: 'pending_payment',
    PAID: 'paid',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    PAYMENT_FAILED: 'payment_failed',
};

export const OrderService = {
    generateSerialNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `F224-${year}${month}${day}-${randomStr}`;
    },

    extractSellerIds(items = []) {
        const ids = new Set();
        items.forEach((item) => {
            if (item.sellerId) ids.add(item.sellerId);
        });
        return Array.from(ids);
    },

    async createOrder(userId, orderData) {
        try {
            if (!userId) throw new Error("User ID is required");

            const items = (orderData.items || []).map((item) => {
                const serials = [];
                const quantity = item.quantity || 1;
                for (let i = 0; i < quantity; i++) {
                    serials.push(this.generateSerialNumber());
                }
                const price = Number(item.currentPrice ?? item.price ?? 0) || 0;
                return {
                    ...item,
                    price,
                    currentPrice: price,
                    quantity,
                    serials,
                    sellerId: item.sellerId || null,
                };
            });

            const sellerIds = this.extractSellerIds(items);
            const primarySellerId = sellerIds[0] || orderData.sellerId || null;
            const totalAmount = Number(orderData.totalAmount) || 0;
            const shippingCost = Number(orderData.shippingCost) || 0;

            const newOrder = {
                userId,
                buyerId: userId,
                sellerId: primarySellerId,
                sellerIds,
                items,
                totalAmount: totalAmount + shippingCost,
                subtotal: totalAmount,
                shippingCost,
                buyerName: orderData.buyerName || '',
                shippingDetails: orderData.shippingDetails || { method: 'Unknown', details: 'Not specified' },
                paymentMethod: orderData.paymentMethod || 'unknown',
                status: orderData.status || ORDER_STATUS.PENDING_PAYMENT,
                paymentRef: orderData.paymentRef || null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Deep clean undefined values to prevent Firestore errors
            const cleanUndefined = (obj) => {
                if (Array.isArray(obj)) {
                    return obj.filter(item => item !== undefined).map(item => {
                        if (item && typeof item === 'object' && !(item instanceof Date)) {
                            return cleanUndefined(item);
                        }
                        return item;
                    });
                }
                Object.keys(obj).forEach(key => {
                    if (obj[key] === undefined) {
                        delete obj[key];
                    } else if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof Date) && key !== 'createdAt' && key !== 'updatedAt') {
                        obj[key] = cleanUndefined(obj[key]);
                    }
                });
                return obj;
            };
            cleanUndefined(newOrder);

            const docRef = await addDoc(collection(db, "orders"), newOrder);

            import('./smsNotifications.js').then(({ SmsNotifications }) => {
                SmsNotifications.notifyOrderPlaced(userId, {
                    orderId: docRef.id,
                    totalAmount: newOrder.totalAmount,
                }).catch(() => {});
            });

            return { success: true, orderId: docRef.id };
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    async getOrderById(orderId) {
        try {
            const orderSnap = await getDoc(doc(db, "orders", orderId));
            if (orderSnap.exists()) {
                return { id: orderSnap.id, ...orderSnap.data() };
            }
            return null;
        } catch (error) {
            console.error("Error fetching order by ID:", error);
            return null;
        }
    },

    async getUserOrders(userId) {
        try {
            if (!userId) throw new Error("User ID is required");

            const ordersRef = collection(db, "orders");
            const qBuyer = query(ordersRef, where("buyerId", "==", userId));
            const qUser = query(ordersRef, where("userId", "==", userId));
            const [snapBuyer, snapUser] = await Promise.all([getDocs(qBuyer), getDocs(qUser)]);

            const byId = new Map();
            [...snapBuyer.docs, ...snapUser.docs].forEach((d) => {
                byId.set(d.id, { id: d.id, ...d.data() });
            });

            return Array.from(byId.values()).sort((a, b) => {
                const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return timeB - timeA;
            });
        } catch (error) {
            console.error("Error fetching user orders:", error);
            return [];
        }
    },

    async getSellerOrders(sellerId) {
        try {
            const ordersRef = collection(db, "orders");
            const qSeller = query(ordersRef, where("sellerId", "==", sellerId));
            const qIds = query(ordersRef, where("sellerIds", "array-contains", sellerId));
            const [snapSeller, snapIds] = await Promise.all([getDocs(qSeller), getDocs(qIds)]);

            const byId = new Map();
            [...snapSeller.docs, ...snapIds.docs].forEach((d) => {
                byId.set(d.id, { id: d.id, ...d.data() });
            });
            return Array.from(byId.values());
        } catch (error) {
            console.error("Error fetching seller orders:", error);
            return [];
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            await updateDoc(doc(db, "orders", orderId), {
                status,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    },

    async updateOrder(orderId, updates) {
        try {
            const blocked = ['buyerId', 'userId', 'sellerId', 'sellerIds', 'totalAmount', 'items'];
            const safe = { ...updates };
            blocked.forEach((k) => delete safe[k]);
            await updateDoc(doc(db, "orders", orderId), {
                ...safe,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    },

    async deleteOrder(orderId) {
        try {
            await deleteDoc(doc(db, "orders", orderId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error;
        }
    },

    async markOrderPaid(orderId, paymentRef) {
        const order = await this.getOrderById(orderId);
        await this.updateOrder(orderId, {
            status: ORDER_STATUS.PAID,
            paymentRef: paymentRef || null,
            paidAt: serverTimestamp(),
        });
        const buyerId = order?.buyerId || order?.userId;
        if (buyerId) {
            const { SmsNotifications } = await import('./smsNotifications.js');
            SmsNotifications.notifyPaymentSuccess(buyerId, { orderId, ref: paymentRef }).catch(() => {});
        }
    },
};
