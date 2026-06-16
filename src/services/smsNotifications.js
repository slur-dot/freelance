import { SmsService } from './smsService';
import { UserService } from './userService';

/**
 * Transactional SMS templates (EN — platform default; extend with i18n server-side later).
 */
export const SmsNotifications = {
  async notifyOrderPlaced(userId, { orderId, totalAmount }) {
    const user = await UserService.getUserProfile(userId);
    return SmsService.sendToUser(user, `Freelance-224: Your order #${orderId?.slice(0, 8) || ''} was placed. Total: ${totalAmount} GNF.`);
  },

  async notifyPaymentSuccess(userId, { orderId, ref }) {
    const user = await UserService.getUserProfile(userId);
    return SmsService.sendToUser(user, `Freelance-224: Payment received for order ${orderId?.slice(0, 8) || ''}. Ref: ${ref || 'OK'}.`);
  },

  async notifyPaymentFailed(userId, { orderId }) {
    const user = await UserService.getUserProfile(userId);
    return SmsService.sendToUser(user, `Freelance-224: Payment failed for order ${orderId?.slice(0, 8) || ''}. Please try again.`);
  },

  async notifyBookingConfirmed(userId) {
    const user = await UserService.getUserProfile(userId);
    return SmsService.sendToUser(user, 'Freelance-224: Your booking request was received. We will contact you shortly.');
  },

  async notifyPayoutRequested(sellerId, { amount }) {
    const user = await UserService.getUserProfile(sellerId);
    return SmsService.sendToUser(user, `Freelance-224: Payout request of ${amount} GNF submitted. Status: pending.`);
  },

  async notifyPayoutStatus(sellerId, { amount, status }) {
    const user = await UserService.getUserProfile(sellerId);
    return SmsService.sendToUser(user, `Freelance-224: Your payout of ${amount} GNF is now: ${status}.`);
  },

  async notifyAccountBanned(userId) {
    const user = await UserService.getUserProfile(userId);
    return SmsService.sendToUser(user, 'Freelance-224: Your account has been suspended. Contact support for help.');
  },

  async notifyRoleChanged(userId, { role }) {
    const user = await UserService.getUserProfile(userId);
    return SmsService.sendToUser(user, `Freelance-224: Your account role was updated to ${role}.`);
  },
};
