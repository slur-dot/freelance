import { db, storage } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const ProductService = {
    // Fetch all products
    async getProducts() {
        try {
            const productsRef = collection(db, "products");
            const q = query(productsRef, orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },

    // Fetch a single product by ID
    async getProductById(productId) {
        try {
            if (!productId) return null;
            const docRef = doc(db, "products", productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error("Error fetching product:", error);
            return null;
        }
    },

    // Fetch products by category
    async getProductsByCategory(category) {
        try {
            const productsRef = collection(db, "products");
            const q = query(productsRef, where("category", "==", category));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching products by category:", error);
            return [];
        }
    },

    // Fetch products by seller
    async getSellerProducts(sellerId) {
        try {
            const productsRef = collection(db, "products");
            const q = query(productsRef, where("sellerId", "==", sellerId));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching seller products:", error);
            return [];
        }
    },

    // Create product with optional image
    async createProduct(productData, imageFile) {
        try {
            let imageUrl = "";
            if (imageFile) {
                const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
                const uploadResult = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            const productsRef = collection(db, "products");
            const newProduct = {
                ...productData,
                image: imageUrl || productData.image || "https://placehold.co/300x200", // Fallback or existing URL
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'Active', // Default status
                views: 0
            };

            const docRef = await addDoc(productsRef, newProduct);
            return { id: docRef.id, ...newProduct };
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    // Update product
    async updateProduct(productId, updates, newImageFile) {
        try {
            let imageUrl = updates.image;
            if (newImageFile) {
                const storageRef = ref(storage, `products/${Date.now()}_${newImageFile.name}`);
                const uploadResult = await uploadBytes(storageRef, newImageFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, {
                ...updates,
                image: imageUrl,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    // Delete product
    async deleteProduct(productId) {
        try {
            await deleteDoc(doc(db, "products", productId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }
};
