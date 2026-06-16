import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NotificationService } from "./notificationService";
import { COMPANY_CONTACT } from "../config/companyContact";

export const RentalService = {
    async submitBooking(userId, bookingPayload) {
        if (!userId) throw new Error("User must be logged in to submit a booking");
        const docRef = await addDoc(collection(db, "rentals"), {
            userId,
            ...bookingPayload,
            notifyEmail: COMPANY_CONTACT.booking,
            status: "pending",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        await NotificationService.createNotification(
            userId,
            "Booking submitted",
            "Your computer rental request has been received. We will contact you shortly.",
            { type: "rental", sourceId: docRef.id, sourceType: "rental" }
        );
        const { SmsNotifications } = await import('./smsNotifications.js');
        SmsNotifications.notifyBookingConfirmed(userId).catch(() => {});
        return { id: docRef.id };
    },
};
