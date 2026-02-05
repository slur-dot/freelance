import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { UserService } from "./userService";

export const FreelancerService = {
    // Get main dashboard stats
    async getDashboardStats(uid) {
        try {
            const profile = await UserService.getUserProfile(uid);
            // Aggregating locally for now, or fetch from a 'stats' subcollection if it existed
            return {
                totalEarned: profile?.totalEarned || 0,
                projectsPosted: 0, // Placeholder or fetch count from projects collection
                jdsApplied: 0, // Placeholder
                hires: 0 // Placeholder
            };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    },

    // --- Training Progress ---
    async getTrainingProgress(uid) {
        try {
            // Fetch from subcollection 'training_courses'
            const ref = collection(db, "users", uid, "training_courses");
            const q = query(ref, orderBy("lastAccessed", "desc"));
            const snapshot = await getDocs(q);

            const courses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
                // data should include: title, progress, status, lastAccessed, expectedCompletion
            }));

            return { success: true, data: { trainingProgress: { courses } } };
        } catch (error) {
            console.error("Error fetching training progress:", error);
            // Return empty structure on error (or if collection doesn't exist yet)
            return { success: true, data: { trainingProgress: { courses: [] } } };
        }
    },

    // --- Requested Courses ---
    async getRequestedCourses(uid) {
        try {
            const ref = collection(db, "users", uid, "requested_courses");
            const q = query(ref, orderBy("requestDate", "desc"));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching requested courses:", error);
            return [];
        }
    },

    async requestCourse(uid, courseData) {
        try {
            const ref = collection(db, "users", uid, "requested_courses");
            const docRef = await addDoc(ref, {
                ...courseData,
                status: 'pending',
                requestDate: new Date()
            });
            return { id: docRef.id, ...courseData, status: 'pending' };
        } catch (error) {
            console.error("Error requesting course:", error);
            throw error;
        }
    },

    async updateRequestedCourse(uid, courseId, data) {
        try {
            const ref = doc(db, "users", uid, "requested_courses", courseId);
            await updateDoc(ref, data);
            return { success: true };
        } catch (error) {
            console.error("Error updating requested course:", error);
            throw error;
        }
    },

    async deleteRequestedCourse(uid, courseId) {
        try {
            const ref = doc(db, "users", uid, "requested_courses", courseId);
            await deleteDoc(ref);
            return { success: true };
        } catch (error) {
            console.error("Error deleting requested course:", error);
            throw error;
        }
    },

    // --- Earnings ---
    async getEarningsHistory(uid) {
        try {
            const ref = collection(db, "users", uid, "earnings_history");
            const q = query(ref, orderBy("date", "desc"));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching earnings:", error);
            return [];
        }
    },

    // --- JD Applications ---
    async getJDApplications(uid) {
        try {
            const ref = collection(db, "users", uid, "jd_applications");
            const snapshot = await getDocs(ref);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching JD applications:", error);
            return [];
        }
    },

    async applyToJD(uid, jdData) {
        try {
            const ref = collection(db, "users", uid, "jd_applications");
            const docRef = await addDoc(ref, {
                ...jdData,
                appliedAt: new Date(),
                status: 'pending'
            });
            return { id: docRef.id, ...jdData, status: 'pending' };
        } catch (error) {
            console.error("Error applying to JD:", error);
            throw error;
        }
    },

    // --- Notifications ---
    async getNotifications(uid) {
        try {
            const ref = collection(db, "notifications");
            const q = query(ref, where("userId", "==", uid));
            const snapshot = await getDocs(q);

            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort manually to avoid composite index requirement for now
            return list.sort((a, b) => {
                const ta = a.createdAt?.seconds || 0;
                const tb = b.createdAt?.seconds || 0;
                return tb - ta;
            });
        } catch (error) {
            // Fallback if index missing or other error
            console.error("Error fetching notifications:", error);
            return [];
        }
    }
};
