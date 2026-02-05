import { db } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc, addDoc, query, where, serverTimestamp, updateDoc } from "firebase/firestore";

export const ProjectService = {
    // Create a new project
    async createProject(projectData, userId) {
        try {
            const docRef = await addDoc(collection(db, "projects"), {
                ...projectData,
                clientId: userId,
                status: "open",
                createdAt: serverTimestamp(),
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error creating project:", error);
            return { success: false, error: error.message };
        }
    },

    // Get all projects (optional filter)
    async getProjects() {
        try {
            const q = query(collection(db, "projects")); // Add where clauses if needed
            const querySnapshot = await getDocs(q);
            const projects = [];
            querySnapshot.forEach((doc) => {
                projects.push({ id: doc.id, ...doc.data() });
            });
            return projects;
        } catch (error) {
            console.error("Error getting projects:", error);
            return [];
        }
    },

    // Get projects for a specific client
    async getClientProjects(clientId) {
        try {
            const q = query(collection(db, "projects"), where("clientId", "==", clientId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching client projects:", error);
            return [];
        }
    }
};
