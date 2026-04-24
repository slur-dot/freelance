import React from "react";
import { useTranslation } from "react-i18next";

function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}

export default function GamificationProfile({ gamificationData }) {
  const { t } = useTranslation();

  if (!gamificationData) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.gamification_title')}</h3>
        <div className="text-center text-gray-500">
          <p>{t('company_dashboard.gamification_loading')}</p>
        </div>
      </Card>
    );
  }

  const { trainingProgress, financialBreakdown, achievements, level, points } = gamificationData;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.gamification_title')}</h3>

      {/* Profile Completion Bar */}
      <div className="mb-6 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-blue-900">{t('company_dashboard.gamification_profile_completion', 'Profile Completion')}</h4>
          <span className="text-sm font-extrabold text-blue-700">{gamificationData.profileCompletion || 85}%</span>
        </div>
        <div className="w-full bg-blue-200/50 rounded-full h-2.5 mb-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" style={{ width: `${gamificationData.profileCompletion || 85}%` }}></div>
        </div>
        <p className="text-xs text-blue-800/70 font-medium">{t('company_dashboard.gamification_profile_hint', 'Complete your profile to unlock more achievements and trust badges.')}</p>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-green-600">{t('company_dashboard.gamification_training_progress')}</h4>
        <div className="space-y-3">
          {trainingProgress.completedCourses.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-600">{t('company_dashboard.gamification_completed')}</p>
              </div>
              <span className="text-green-600 font-semibold">100%</span>
            </div>
          ))}
          {trainingProgress.inProgressCourses.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-600">{course.cost.toLocaleString()} GNF - {course.status}</p>
              </div>
              <span className="text-yellow-600 font-semibold">{course.progress}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-blue-600">{t('company_dashboard.gamification_financial_breakdown')}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">{t('company_dashboard.gamification_total_spent')}</p>
            <p className="text-lg font-semibold">{financialBreakdown.totalSpent.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">{t('company_dashboard.gamification_freelance_spending')}</p>
            <p className="text-lg font-semibold">{financialBreakdown.freelanceSpending.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">{t('company_dashboard.gamification_seller_purchases')}</p>
            <p className="text-lg font-semibold">{financialBreakdown.sellerPurchases.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">{t('company_dashboard.gamification_training_costs')}</p>
            <p className="text-lg font-semibold">{financialBreakdown.trainingCosts.toLocaleString()} GNF</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-3 text-purple-600">{t('company_dashboard.gamification_achievements')}</h4>
        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{achievement.title}</p>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
              <span className="text-purple-600 font-semibold text-sm">+{achievement.points} pts</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">{t('company_dashboard.gamification_level')} {level}</span>
          <span className="text-sm font-semibold text-purple-600">{points} {t('company_dashboard.gamification_points')}</span>
        </div>
      </div>
    </Card>
  );
}


