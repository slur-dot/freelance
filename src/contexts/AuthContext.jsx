import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        let unsubProfile = null;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (unsubProfile) {
                unsubProfile();
                unsubProfile = null;
            }

            if (user) {
                unsubProfile = onSnapshot(
                    doc(db, "users", user.uid),
                    (userDoc) => {
                        if (userDoc.exists()) {
                            const data = userDoc.data();
                            setUserRole(data.role);
                            setUserData(data);
                        } else {
                            setUserRole(null);
                            setUserData(null);
                        }
                        setLoading(false);
                    },
                    (error) => {
                        console.error("Error listening to user profile:", error);
                        setUserRole(null);
                        setUserData(null);
                        setLoading(false);
                    }
                );
            } else {
                setUserRole(null);
                setUserData(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
            if (unsubProfile) unsubProfile();
        };
    }, []);

    const value = useMemo(
        () => ({
            currentUser,
            userRole,
            userData,
            loading,
            logout,
        }),
        [currentUser, userRole, userData, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
