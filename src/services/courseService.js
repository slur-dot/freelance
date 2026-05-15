import { db, storage } from "../firebaseConfig";
import {
    collection, query, where, getDocs, doc, getDoc,
    addDoc, updateDoc, deleteDoc, orderBy, serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const CourseService = {
    /**
     * Request trainer status for a freelancer.
     * Creates a training_request doc and flags the user profile.
     */
    async requestTrainerStatus(userId) {
        try {
            // 1. Update user profile
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                trainerStatus: "pending",
                trainerRequestedAt: serverTimestamp()
            });

            // 2. Create a training_request for admin review
            await addDoc(collection(db, "training_requests"), {
                userId,
                status: "pending",
                createdAt: serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error("Error requesting trainer status:", error);
            throw error;
        }
    },

    /**
     * Check if a user is an approved trainer.
     */
    async getTrainerStatus(userId) {
        try {
            const userRef = doc(db, "users", userId);
            const snap = await getDoc(userRef);
            if (!snap.exists()) return { isTrainer: false, status: "none" };

            const data = snap.data();
            return {
                isTrainer: data.isTrainer === true,
                status: data.trainerStatus || "none" // "none" | "pending" | "approved" | "rejected"
            };
        } catch (error) {
            console.error("Error checking trainer status:", error);
            return { isTrainer: false, status: "none" };
        }
    },

    /**
     * Upload a new course (trainers only).
     * Stores video in Firebase Storage and metadata in Firestore.
     */
    async uploadCourse(userId, courseData, videoFile = null) {
        try {
            let videoUrl = courseData.videoUrl || "";

            // Upload video if provided as a File
            if (videoFile && videoFile instanceof File) {
                const timestamp = Date.now();
                const storagePath = `courses/${userId}/${timestamp}_${videoFile.name}`;
                const storageRef = ref(storage, storagePath);
                const snapshot = await uploadBytes(storageRef, videoFile);
                videoUrl = await getDownloadURL(snapshot.ref);
            }

            const courseDoc = {
                title: courseData.title,
                category: courseData.category || "General",
                description: courseData.description || "",
                price: Number(courseData.price) || 0,
                videoUrl,
                trainerId: userId,
                status: "pending_review", // Admin must approve
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            // Store in root 'courses' collection for easier admin querying
            const docRef = await addDoc(collection(db, "courses"), courseDoc);

            // Also store reference in user subcollection for trainer's own view
            await addDoc(collection(db, "users", userId, "training_courses"), {
                courseId: docRef.id,
                ...courseDoc
            });

            return { id: docRef.id, ...courseDoc };
        } catch (error) {
            console.error("Error uploading course:", error);
            throw error;
        }
    },

    /**
     * Get all courses uploaded by a specific trainer.
     */
    async getTrainerCourses(userId) {
        try {
            const q = query(
                collection(db, "courses"),
                where("trainerId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            // Fallback without ordering if index missing
            console.warn("Falling back to unordered query for trainer courses:", error);
            try {
                const q = query(
                    collection(db, "courses"),
                    where("trainerId", "==", userId)
                );
                const snapshot = await getDocs(q);
                const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return courses.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            } catch (err) {
                console.error("Error fetching trainer courses:", err);
                return [];
            }
        }
    },

    /**
     * Get all approved/published courses (for public listing).
     */
    async getAllPublishedCourses() {
        try {
            const q = query(
                collection(db, "courses"),
                where("status", "==", "approved")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching published courses:", error);
            return [];
        }
    },

    /**
     * Update a course (e.g., edit title, description).
     */
    async updateCourse(courseId, updates) {
        try {
            const courseRef = doc(db, "courses", courseId);
            await updateDoc(courseRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating course:", error);
            throw error;
        }
    },

    /**
     * Delete a course.
     */
    async deleteCourse(courseId) {
        try {
            await deleteDoc(doc(db, "courses", courseId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    }
};
