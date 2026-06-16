import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { COMPANY_CONTACT } from '../config/companyContact';

export const ContactService = {
  async submitInquiry({ fullName, company, jobTitle, email, message }) {
    await addDoc(collection(db, 'contact_inquiries'), {
      fullName: fullName || '',
      company: company || '',
      jobTitle: jobTitle || '',
      email,
      message,
      notifyEmail: COMPANY_CONTACT.general,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  },
};
