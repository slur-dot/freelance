/**
 * ReferralService
 * Handles referral code generation and tracking.
 * This is a placeholder implementation that simulates API calls until backend is connected.
 */

export const ReferralService = {
  /**
   * Fetch referral statistics and history for a user
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getReferralData(userId) {
    if (!userId) throw new Error("User ID is required");

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock data for existing users, generate new data if missing
    return {
      referralCode: `F24-${userId.substring(0, 6).toUpperCase()}`,
      referralLink: `https://freelance24.com/register?ref=F24-${userId.substring(0, 6).toUpperCase()}`,
      totalReferrals: 3,
      totalEarned: 150000,
      currency: 'GNF',
      history: [
        { id: 1, date: '2024-04-10', user: 'alex_d***', status: 'completed', reward: 50000 },
        { id: 2, date: '2024-04-12', user: 'sarah_m***', status: 'completed', reward: 50000 },
        { id: 3, date: '2024-04-18', user: 'dev_guy***', status: 'pending', reward: 50000 }
      ]
    };
  },

  /**
   * Request a new custom referral code (optional feature)
   * @param {string} userId 
   * @param {string} customCode 
   */
  async createCustomCode(userId, customCode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check available logic would go here
    if (customCode.length < 4) {
      throw new Error("Custom code too short");
    }

    return {
      success: true,
      referralCode: customCode,
      referralLink: `https://freelance24.com/register?ref=${customCode}`
    };
  }
};

export default ReferralService;
