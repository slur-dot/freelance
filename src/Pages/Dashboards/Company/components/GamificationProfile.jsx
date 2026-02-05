import React from "react";

function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}

export default function GamificationProfile({ gamificationData }) {
  if (!gamificationData) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Gamification Profile</h3>
        <div className="text-center text-gray-500">
          <p>Loading gamification data...</p>
        </div>
      </Card>
    );
  }

  const { trainingProgress, financialBreakdown, achievements, level, points } = gamificationData;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Gamification Profile</h3>

      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-green-600">Training Progress</h4>
        <div className="space-y-3">
          {trainingProgress.completedCourses.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-600">Completed</p>
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
        <h4 className="text-md font-semibold mb-3 text-blue-600">Financial Breakdown</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-lg font-semibold">{financialBreakdown.totalSpent.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Freelance Spending</p>
            <p className="text-lg font-semibold">{financialBreakdown.freelanceSpending.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Seller Purchases</p>
            <p className="text-lg font-semibold">{financialBreakdown.sellerPurchases.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Training Costs</p>
            <p className="text-lg font-semibold">{financialBreakdown.trainingCosts.toLocaleString()} GNF</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-3 text-purple-600">Achievements</h4>
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
          <span className="text-sm text-gray-600">Level {level}</span>
          <span className="text-sm font-semibold text-purple-600">{points} points</span>
        </div>
      </div>
    </Card>
  );
}


