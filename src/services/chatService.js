import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs } from "firebase/firestore";

const ChatService = {
    // Start or get a chat session
    async startChat(userId, userInfo) {
        const sessionRef = collection(db, "chatSessions");
        
        // Check for an existing active session first
        const q = query(sessionRef, where("userId", "==", userId), where("status", "==", "active"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            return snapshot.docs[0].id;
        }

        const session = await addDoc(sessionRef, {
            userId,
            userInfo, // { name, email }
            status: 'active',
            createdAt: serverTimestamp(),
            lastMessageAt: serverTimestamp()
        });
        return session.id;
    },

    // Send a message
    async sendMessage(sessionId, senderId, text, senderRole = 'user') {
        const messagesRef = collection(db, "chatSessions", sessionId, "messages");
        await addDoc(messagesRef, {
            senderId,
            senderRole,
            text,
            timestamp: serverTimestamp()
        });

        // Update last message time on session
        // (Optional optimization: use a Cloud Function or batch write here)
    },

    // Subscribe to messages in a session
    subscribeToMessages(sessionId, callback) {
        const messagesRef = collection(db, "chatSessions", sessionId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    }
};

export default ChatService;
