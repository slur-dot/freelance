import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { UserService } from "./userService";
import { NotificationService } from "./notificationService";

export const CompanyService = {
    // Get Company Profile (wraps UserService but ensures type safety or specific fields if needed)
    async getCompanyProfile(uid) {
        return await UserService.getUserProfile(uid);
    },

    // Update Company Profile
    async updateCompanyProfile(uid, data) {
        return await UserService.updateUserProfile(uid, data);
    },

    // --- Employee Management (Subcollection: users/{uid}/employees) ---

    async getEmployees(companyId) {
        try {
            const employeesRef = collection(db, "users", companyId, "employees");
            const snapshot = await getDocs(employeesRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching employees:", error);
            return [];
        }
    },

    async addEmployee(companyId, employeeData) {
        try {
            const employeesRef = collection(db, "users", companyId, "employees");
            const now = new Date();
            const docRef = await addDoc(employeesRef, {
                ...employeeData,
                createdAt: now,
                updatedAt: now
            });
            return { id: docRef.id, ...employeeData, createdAt: now };
        } catch (error) {
            console.error("Error adding employee:", error);
            throw error;
        }
    },

    async updateEmployee(companyId, employeeId, employeeData) {
        try {
            const employeeRef = doc(db, "users", companyId, "employees", employeeId);
            await updateDoc(employeeRef, {
                ...employeeData,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating employee:", error);
            throw error;
        }
    },

    async deleteEmployee(companyId, employeeId) {
        try {
            const employeeRef = doc(db, "users", companyId, "employees", employeeId);
            await deleteDoc(employeeRef);
            return { success: true };
        } catch (error) {
            console.error("Error deleting employee:", error);
            throw error;
        }
    },

    // --- Job Description / Job Posting CRUD ---

    async postJobDescription(companyId, jobData) {
        try {
            const jobsRef = collection(db, "jobDescriptions");
            const docRef = await addDoc(jobsRef, {
                ...jobData,
                companyId,
                status: "open",
                applicants: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            // Create a notification for the company
            await NotificationService.createNotification(
                companyId,
                "Job Posted Successfully",
                `Your job "${jobData.title}" has been published and is now visible to freelancers.`,
                "success"
            );

            return { id: docRef.id, ...jobData, companyId, status: "open", applicants: 0 };
        } catch (error) {
            console.error("Error posting job description:", error);
            throw error;
        }
    },

    async getCompanyJobs(companyId) {
        try {
            const jobsRef = collection(db, "jobDescriptions");
            const q = query(jobsRef, where("companyId", "==", companyId), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.error("Error fetching company jobs:", error);
            return [];
        }
    },

    async getJobApplications(jobId) {
        try {
            const appsRef = collection(db, "jobApplications");
            const q = query(appsRef, where("jobId", "==", jobId), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.error("Error fetching job applications:", error);
            return [];
        }
    },

    async updateJobStatus(jobId, status) {
        try {
            const jobRef = doc(db, "jobDescriptions", jobId);
            await updateDoc(jobRef, { status, updatedAt: serverTimestamp() });
            return { success: true };
        } catch (error) {
            console.error("Error updating job status:", error);
            throw error;
        }
    },

    // --- Dashboard Data Aggregation ---

    async getDashboardData(companyId) {
        try {
            // 1. Fetch Company Profile (User doc) for gamification and settings
            const userDoc = await getDoc(doc(db, "users", companyId));
            const userData = userDoc.exists() ? userDoc.data() : {};

            // Default gamification structure if missing
            const gamification = userData.gamification || {
                finance: {
                    spendingBreakdown: { leases: 0, purchases: 0, training: 0, hires: 0 },
                    mainStatistics: { totalSpent: 0, orders: 0, hires: 0, jdsPosted: 0 }
                },
                courses: {
                    trainingProgress: [],
                    requestedCourses: []
                },
            };

            // 2. Fetch Employees
            const employees = await this.getEmployees(companyId);

            // 3. Fetch Purchases (Orders where buyerId == companyId)
            const ordersRef = collection(db, "orders");
            const qOrders = query(ordersRef, where("buyerId", "==", companyId)); // Assuming buyerId field on orders
            const ordersSnapshot = await getDocs(qOrders);
            const purchases = ordersSnapshot.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    item: data.paymentMethod || "Order", // Fallback title
                    amount: data.totalAmount || 0,
                    status: data.status,
                    date: data.createdAt,
                    seller: data.sellerId // In real app, fetch seller name
                };
            });

            // 4. Other subcollections (mocked or empty for now if not existing)
            // Ideally these would be separate collections or subcollections
            const leaseContracts = userData.leaseContracts || [];
            const equipmentTracking = userData.equipmentTracking || [];
            const transactionHistory = userData.transactionHistory || [];
            const freelancerMarketplace = userData.freelancerMarketplace || [];
            const subscriptions = userData.subscriptions || [{
                currentPlan: 'growth',
                plans: {
                    starter: { name: 'Starter', price: 0, currency: 'GNF', features: ['Basic Access'] },
                    growth: { name: 'Growth', price: 500000, currency: 'GNF', features: ['All Access'] },
                    enterprise: { name: 'Enterprise', price: 2000000, currency: 'GNF', features: ['Custom'] }
                }
            }];
            let notifications = [];
            try {
                notifications = await NotificationService.getUserNotifications(companyId);
            } catch (e) {
                console.warn("Could not fetch notifications:", e);
            }

            // Fetch real job postings for the freelancer marketplace section
            let freelancerMarketplaceReal = [];
            try {
                freelancerMarketplaceReal = await this.getCompanyJobs(companyId);
            } catch (e) {
                console.warn("Could not fetch job postings:", e);
            }

            const messages = [];

            return {
                stats: { gamification }, // Structure to match component expectation
                leaseContracts,
                purchases, // Real from orders
                employees, // Real from subcollection
                equipmentTracking,
                notifications,
                transactionHistory,
                freelancerMarketplace: freelancerMarketplaceReal.length > 0 ? freelancerMarketplaceReal : freelancerMarketplace,
                subscriptions,
                messages
            };

        } catch (error) {
            console.error("Error getting dashboard data:", error);
            throw error;
        }
    },

    async updateCompanyGamification(companyId, gamificationData) {
        try {
            const userRef = doc(db, "users", companyId);
            await updateDoc(userRef, {
                gamification: gamificationData,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error("Error updating gamification:", error);
            throw error;
        }
    }
};
