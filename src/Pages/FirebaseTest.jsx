import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
    const [status, setStatus] = useState({
        auth: 'Checking...',
        firestore: 'Checking...',
        storage: 'Checking...'
    });

    useEffect(() => {
        const checkConnection = async () => {
            let newStatus = { ...status };

            // Check Auth
            if (auth) {
                newStatus.auth = 'Initialized';
            } else {
                newStatus.auth = 'Failed to Initialize';
            }

            // Check Firestore
            try {
                // Attempt to fetch a non-existent document just to check connectivity
                // If it fails with "permission-denied", it means we are connected!
                // If it fails with "unavailable" or network error, we are not.
                await getDocs(collection(db, 'test_connection_collection'));
                newStatus.firestore = 'Connected (Read Success)';
            } catch (error) {
                console.error("Firestore Error:", error);
                if (error.code === 'permission-denied') {
                    newStatus.firestore = 'Connected (Permission Denied - Config is Correct)';
                } else if (error.code === 'unavailable') {
                    newStatus.firestore = 'Failed: Network/Service Unavailable';
                } else {
                    newStatus.firestore = `Failed: ${error.message}`;
                }
            }

            // Check Storage
            if (storage) {
                newStatus.storage = 'Initialized';
            } else {
                newStatus.storage = 'Failed to Initialize';
            }

            setStatus(newStatus);
        };

        checkConnection();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Firebase Connection Test</h1>
            <div style={{ marginTop: '20px' }}>
                <h3>Auth Service: <span style={{ color: status.auth.includes('Failed') ? 'red' : 'green' }}>{status.auth}</span></h3>
                <h3>Firestore Database: <span style={{ color: status.firestore.includes('Failed') ? 'red' : 'green' }}>{status.firestore}</span></h3>
                <h3>Storage Service: <span style={{ color: status.storage.includes('Failed') ? 'red' : 'green' }}>{status.storage}</span></h3>
            </div>
            <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
                <h4>Debug Info:</h4>
                <pre>{JSON.stringify({
                    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
                    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
                    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
                }, null, 2)}</pre>
            </div>
        </div>
    );
};

export default FirebaseTest;
