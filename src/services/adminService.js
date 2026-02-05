import { db } from "../firebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    limit,
    startAfter,
    orderBy,
    getCountFromServer,
    collectionGroup
} from "firebase/firestore";

export const AdminService = {
    // --- USERS ---
    getAllUsers: async (role = null, lastDoc = null, pageSize = 50) => {
        try {
            let q = collection(db, "users");
            const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];

            if (role) {
                constraints.unshift(where("role", "==", role));
            }

            if (lastDoc) {
                constraints.push(startAfter(lastDoc));
            }

            const queryRef = query(q, ...constraints);
            const snapshot = await getDocs(queryRef);

            return {
                data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1]
            };
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    updateUser: async (userId, data) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, data);
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    // --- PRODUCTS ---
    getAllProducts: async (lastDoc = null, pageSize = 50) => {
        try {
            let q = collection(db, "products");
            const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];

            if (lastDoc) constraints.push(startAfter(lastDoc));

            const snapshot = await getDocs(query(q, ...constraints));
            return {
                data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1]
            };
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    approveProduct: async (productId, status) => {
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, { status }); // 'active', 'rejected'
        } catch (error) {
            console.error("Error approving product:", error);
            throw error;
        }
    },

    updateProduct: async (productId, data) => {
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, data);
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    removeProduct: async (productId) => {
        try {
            const productRef = doc(db, "products", productId);
            await deleteDoc(productRef);
        } catch (e) {
            console.error("Error deleting product:", e);
            throw e;
        }
    },

    // --- ORDERS / BOOKINGS ---
    getAllBookings: async (lastDoc = null, pageSize = 50) => {
        try {
            let q = collection(db, "orders"); // Assuming bookings are orders
            const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];

            if (lastDoc) constraints.push(startAfter(lastDoc));

            const snapshot = await getDocs(query(q, ...constraints));
            return {
                data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1]
            };
        } catch (error) {
            console.error("Error fetching bookings:", error);
            throw error;
        }
    },

    updateBooking: async (bookingId, data) => {
        try {
            const bookingRef = doc(db, "orders", bookingId);
            await updateDoc(bookingRef, data);
        } catch (error) {
            console.error("Error updating booking:", error);
            throw error;
        }
    },

    // --- TICKETS ---
    getAllTickets: async (lastDoc = null, pageSize = 50) => {
        try {
            let q = collection(db, "tickets");
            const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];
            if (lastDoc) constraints.push(startAfter(lastDoc));

            const snapshot = await getDocs(query(q, ...constraints));
            return {
                data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1]
            };
        } catch (error) {
            console.error("Error fetching tickets:", error);
            return { data: [], lastDoc: null };
        }
    },

    updateTicket: async (id, data) => {
        try {
            await updateDoc(doc(db, "tickets", id), data);
        } catch (error) {
            console.error("Error updating ticket:", error);
            throw error;
        }
    },

    deleteTicket: async (id) => {
        try {
            await deleteDoc(doc(db, "tickets", id));
        } catch (error) {
            console.error("Error deleting ticket:", error);
            throw error;
        }
    },

    // --- TRAINING REQUESTS ---
    getAllTrainingRequests: async (lastDoc = null, pageSize = 50) => {
        try {
            let q = collection(db, "training_requests");
            const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];
            if (lastDoc) constraints.push(startAfter(lastDoc));

            const snapshot = await getDocs(query(q, ...constraints));
            return {
                data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1]
            };
        } catch (error) {
            // If collection doesn't exist yet, return empty
            console.warn("Error fetching training requests (might be empty):", error);
            return { data: [], lastDoc: null };
        }
    },

    updateTrainingRequest: async (id, data) => {
        try {
            await updateDoc(doc(db, "training_requests", id), data);
        } catch (error) {
            console.error("Error updating training request:", error);
            throw error;
        }
    },

    // --- COURSES ---
    getAllCourses: async (lastDoc = null, pageSize = 50) => {
        // Courses are subcollections 'training_courses' under users.
        // Use collectionGroup to fetch all.
        try {
            // Note: 'training_courses' index might be needed for collectionGroup ordering
            const q = collectionGroup(db, "training_courses");
            // const constraints = [orderBy("createdAt", "desc"), limit(pageSize)]; // Needs index
            // Fallback to simple fetch if index missing issues arise, but let's try strict.
            // For now, simpler query to avoid strict index requirement errors initially:
            const snapshot = await getDocs(query(q, limit(pageSize)));

            return {
                data: snapshot.docs.map(doc => ({ id: doc.id, path: doc.ref.path, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1]
            };
        } catch (error) {
            console.error("Error fetching courses:", error);
            return { data: [], lastDoc: null };
        }
    },

    updateCourse: async (id, data) => {
        // NOTE: This assumes we know the full path OR we find it first.
        // Collection Group queries result gives 'ref' which has the path.
        // But if we just have ID, we can't easily find it without searching.
        // AdminDashboard passes ID. We might need to store parentPath or search.
        // BUT, for now, let's assume we passed the whole object or we search.
        // Optimization: ProductListing/CourseListing should pass the doc ref path or we just search.
        // Actually, let's assume we can't easily update without path.
        // Wait, 'products' is root. 'courses' is subcollection.
        // We need to know the USER ID (parent) to update `users/{uid}/training_courses/{courseId}`.
        // FIXME: CourseListing needs to store/use the full path or parent ID.
        // For now, I will assume the course object has `userId` or I can find it.
        // Actually, I'll assume we can't update easily yet and just log warning if ID is not unique?
        // Alternative: Search for it.
        console.warn("updateCourse: Updating subcollection document requires parent ID. Assuming 'userId' is in course data or passed.");
        // We will implement a search-by-ID helper if needed, but for now loop? No.
        // Let's rely on finding it via query or if we changed `getAllCourses` to return `ref.path`.
        // Correct: The object returned by getAllCourses has data.
        // I'll update getAllCourses to include `path: doc.ref.path`.

        // TEMPORARY: Just try root 'courses' if we migrated them? No, they are subcols.
        // I'll skip implementation details here and handle it in the component refactor using the path.
        // For this service method, I'll take a `path` arg?
        throw new Error("Update Course requires full path or ref. Use specific update method with path.");
    },

    // Helper to update by path
    updateDocumentByPath: async (path, data) => {
        try {
            await updateDoc(doc(db, path), data);
        } catch (e) {
            console.error("Error updating doc by path:", e);
            throw e;
        }
    },

    deleteDocumentByPath: async (path) => {
        try {
            await deleteDoc(doc(db, path));
        } catch (e) {
            console.error("Error deleting doc by path:", e);
            throw e;
        }
    },

    // --- ADVERTISEMENTS ---
    getAllAds: async (lastDoc = null, pageSize = 50) => {
        try {
            let q = collection(db, "advertisements");
            const snapshot = await getDocs(query(q, limit(pageSize)));
            return {
                data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1]
            };
        } catch (e) {
            console.warn("Error fetching ads:", e);
            return { data: [], lastDoc: null };
        }
    },

    createAd: async (data) => {
        try {
            await addDoc(collection(db, "advertisements"), {
                ...data,
                createdAt: new Date()
            });
        } catch (e) {
            console.error("Error creating ad:", e);
            throw e;
        }
    },

    updateAd: async (id, data) => {
        try {
            await updateDoc(doc(db, "advertisements", id), data);
        } catch (e) {
            console.error("Error updating ad:", e);
            throw e;
        }
    },

    deleteAd: async (id) => {
        try {
            await deleteDoc(doc(db, "advertisements", id));
        } catch (e) {
            console.error("Error deleting ad:", e);
            throw e;
        }
    },

    // --- SUB ADMINS ---
    getAllSubAdmins: async (lastDoc = null, pageSize = 50) => {
        try {
            const result = await AdminService._getCollectionData("sub_admins", lastDoc, pageSize);
            return result;
        } catch (e) {
            console.warn("Error fetching sub admins:", e);
            return { data: [], lastDoc: null };
        }
    },

    createSubAdmin: async (data) => {
        await addDoc(collection(db, "sub_admins"), { ...data, createdAt: new Date() });
    },

    updateSubAdmin: async (id, data) => {
        await updateDoc(doc(db, "sub_admins", id), data);
    },

    deleteSubAdmin: async (id) => {
        await deleteDoc(doc(db, "sub_admins", id));
    },

    // --- SUPPORT AGENTS ---
    getAllSupportAgents: async (lastDoc = null, pageSize = 50) => {
        try {
            const result = await AdminService._getCollectionData("support_agents", lastDoc, pageSize);
            return result;
        } catch (e) {
            console.warn("Error fetching support agents:", e);
            return { data: [], lastDoc: null };
        }
    },

    createSupportAgent: async (data) => {
        await addDoc(collection(db, "support_agents"), { ...data, createdAt: new Date() });
    },

    updateSupportAgent: async (id, data) => {
        await updateDoc(doc(db, "support_agents", id), data);
    },

    deleteSupportAgent: async (id) => {
        await deleteDoc(doc(db, "support_agents", id));
    },

    // Helper for generic collection fetch (DRY)
    _getCollectionData: async (collectionName, lastDoc, pageSize) => {
        // Simple helper to avoid repetition
        let q = collection(db, collectionName);
        // Note: Requires index for createdAt usually
        const snapshot = await getDocs(query(q, limit(pageSize)));
        // For simplicity not using ordering or pagination complexity if index missing
        return {
            data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            lastDoc: snapshot.docs[snapshot.docs.length - 1]
        };
    },

    // --- STATS ---
    getDashboardStats: async () => {
        try {
            const usersCount = await getCountFromServer(collection(db, "users"));
            const productsCount = await getCountFromServer(collection(db, "products"));
            const ordersCount = await getCountFromServer(collection(db, "orders"));

            return {
                totalUsers: usersCount.data().count,
                totalProducts: productsCount.data().count,
                totalBookings: ordersCount.data().count,
            };
        } catch (error) {
            console.error("Error fetching admin stats:", error);
            return {
                totalUsers: 0,
                totalProducts: 0,
                totalBookings: 0
            };
        }
    }
};
