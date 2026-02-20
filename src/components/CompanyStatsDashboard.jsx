import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  BookOpen,
  Bell,
  FileText,
  DollarSign,
  Laptop,
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CompanyService } from "../services/companyService";
import { auth } from "../firebaseConfig";
import { useTranslation } from "react-i18next";

// Card Component
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );
}

// Button Component
function Button({ children, className = "", variant = "default", disabled, ...props }) {
  const baseStyles =
    variant === "outline"
      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      : "bg-green-600 text-white hover:bg-green-700";

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${baseStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Progress Bar Component
function ProgressBar({ progress, className = "" }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-green-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

// Utility function to safely handle Firestore timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return new Date();

  // Handle Firestore timestamp with _seconds property (Firestore format)
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }

  // Handle regular Date object or timestamp
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Handle string or number timestamp
  return new Date(timestamp);
}

// Pie Chart Component (Simple CSS-based)
function PieChart({ data, className = "" }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`relative w-32 h-32 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {data.map((item, index) => {
          const percentage = total === 0 ? 0 : (item.value / total) * 100;
          const circumference = 2 * Math.PI * 45; // radius = 45
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = index === 0 || total === 0 ? 0 : -((data.slice(0, index).reduce((sum, d) => sum + d.value, 0) / total) * circumference);

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={item.color}
              strokeWidth="10"
              strokeDasharray={total === 0 ? "0 1000" : strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">{total.toLocaleString()} GNF</span>
      </div>
    </div>
  );
}

export default function CompanyStatsDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    stats: null,
    leaseContracts: [],
    purchases: [],
    employees: [],
    equipmentTracking: [],
    notifications: [],
    transactionHistory: [],
    freelancerMarketplace: [],
    subscriptions: [],
    messages: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await CompanyService.getDashboardData(user.uid);
      setData(dashboardData);
    } catch (err) {
      setError(`Failed to load company analytics: ${err.message}`);
      console.error('Error fetching company stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('company_dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-700 text-sm">
              ⚠️ {error}
            </p>
          </div>
        </div>
        <Button onClick={fetchAllData} className="mb-4">{t('company_dashboard.error_retry')}</Button>
      </div>
    );
  }

  const { stats, leaseContracts, purchases, employees, equipmentTracking, notifications, transactionHistory, freelancerMarketplace, subscriptions } = data;

  if (!stats || !stats.gamification) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">{t('company_dashboard.no_stats')}</p>
      </div>
    );
  }

  // Prepare pie chart data
  const pieChartData = [
    { label: t('company_dashboard.leases'), value: stats.gamification.finance.spendingBreakdown.leases || 0, color: '#10B981' },
    { label: t('company_dashboard.purchases'), value: stats.gamification.finance.spendingBreakdown.purchases || 0, color: '#3B82F6' },
    { label: t('company_dashboard.training'), value: stats.gamification.finance.spendingBreakdown.training || 0, color: '#F59E0B' },
    { label: t('company_dashboard.hires'), value: stats.gamification.finance.spendingBreakdown.hires || 0, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Gamification Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Progress */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.training_progress')}</h3>
          </div>

          {Array.isArray(stats.gamification.courses?.trainingProgress) && stats.gamification.courses.trainingProgress.length > 0 ? (
            stats.gamification.courses.trainingProgress.map((course, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{course.courseName}</span>
                  <span className="text-sm text-gray-600">{course.progress}% {t('company_dashboard.complete')}</span>
                </div>
                <ProgressBar progress={course.progress} className="mb-2" />

                <div className="text-sm text-gray-600">
                  {Array.isArray(course.employeeProgress) && course.employeeProgress.map((emp, empIndex) => (
                    <div key={empIndex} className="flex justify-between">
                      <span>{emp.employeeName}: {emp.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))) : (
            <p className="text-sm text-gray-500">{t('company_dashboard.no_active_training')}</p>
          )}

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">{t('company_dashboard.requested_courses')}</h4>
            {Array.isArray(stats.gamification.courses?.requestedCourses) && stats.gamification.courses.requestedCourses.length > 0 ? (
              stats.gamification.courses.requestedCourses.map((course, index) => (
                <div key={index} className="text-sm text-yellow-700">
                  {course.courseName} {t('company_dashboard.for_employees', { count: course.employeeCount })} - {(course.cost || 0).toLocaleString()} GNF
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${course.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                    }`}>
                    {course.status}
                  </span>
                </div>
              ))) : (
              <p className="text-sm text-yellow-700">{t('company_dashboard.no_pending_requests')}</p>
            )}
          </div>
        </Card>

        {/* Finance Analytics */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.finance_analytics')}</h3>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <PieChart data={pieChartData} />
            <div className="flex-1">
              <div className="space-y-2">
                {pieChartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.label}: {item.value.toLocaleString()} GNF</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">{t('company_dashboard.total_spent')}</span>
              <div className="font-semibold">{(stats.gamification.finance.mainStatistics.totalSpent || 0).toLocaleString()} GNF</div>
            </div>
            <div>
              <span className="text-gray-600">{t('company_dashboard.orders')}</span>
              <div className="font-semibold">{stats.gamification.finance.mainStatistics.orders || 0}</div>
            </div>
            <div>
              <span className="text-gray-600">{t('company_dashboard.hires')}</span>
              <div className="font-semibold">{stats.gamification.finance.mainStatistics.hires || 0}</div>
            </div>
            <div>
              <span className="text-gray-600">{t('company_dashboard.jds_posted')}</span>
              <div className="font-semibold">{stats.gamification.finance.mainStatistics.jdsPosted || 0}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Lease Contracts */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Laptop className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.active_contracts')}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm">{t('company_dashboard.view_all_contracts')}</Button>
            <Button className="text-sm">{t('company_dashboard.request_lease')}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {leaseContracts.length > 0 ? leaseContracts.map((contract) => (
            <div key={contract.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {contract.equipment.includes('Samsung') ? (
                  <Smartphone className="h-5 w-5 text-blue-600" />
                ) : (
                  <Laptop className="h-5 w-5 text-gray-600" />
                )}
                <div>
                  <div className="font-medium">{contract.equipment}</div>
                  <div className="text-sm text-gray-600">{t('company_dashboard.assigned')} {contract.assignedEmployee}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{contract.cost.toLocaleString()} GNF/month</div>
                <div className="text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs ${contract.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {contract.status}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-center text-gray-500 py-4">{t('company_dashboard.no_active_contracts')}</p>
          )}
        </div>
      </Card>

      {/* Recent Purchases */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.recent_purchases')}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm">{t('company_dashboard.view_all_purchases')}</Button>
            <Button variant="outline" className="text-sm">{t('company_dashboard.track_order')}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{purchase.item}</div>
                  <div className="text-sm text-gray-600">{t('company_dashboard.seller')} {purchase.seller || 'N/A'}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{purchase.amount.toLocaleString()} GNF</div>
                  <div className="text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${purchase.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      purchase.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {purchase.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{formatTimestamp(purchase.date).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>{t('company_dashboard.no_recent_purchases')}</p>
              <p className="text-sm">{t('company_dashboard.recent_purchases_placeholder')}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Equipment Tracking */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.equipment_tracking')}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm">{t('company_dashboard.view_tracking')}</Button>
            <Button variant="outline" className="text-sm">{t('company_dashboard.report_issue')}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {equipmentTracking.length > 0 ? (
            equipmentTracking.map((tracking) => (
              <div key={tracking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {tracking.equipment.includes('Samsung') ? (
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Laptop className="h-5 w-5 text-gray-600" />
                  )}
                  <div>
                    <div className="font-medium">{tracking.equipment}</div>
                    <div className="text-sm text-gray-600">{t('company_dashboard.assigned')} {tracking.assignedEmployee}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs ${tracking.status === 'in_use' ? 'bg-green-100 text-green-700' :
                    tracking.status === 'in_transit' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                    {tracking.status.replace('_', ' ')}
                  </div>
                  {tracking.eta && (
                    <div className="text-sm text-gray-600 mt-1">{t('company_dashboard.eta')} {formatTimestamp(tracking.eta).toLocaleDateString()}</div>
                  )}
                  <div className="text-sm text-gray-600">{t('company_dashboard.last_updated')} {formatTimestamp(tracking.lastUpdated).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>{t('company_dashboard.no_tracking_data')}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.notifications')}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm">{t('company_dashboard.settings')}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Bell className="h-4 w-4 text-blue-600 mt-1" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {notification.timestamp ? formatTimestamp(notification.timestamp).toLocaleString() : t('company_dashboard.just_now')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>{t('company_dashboard.no_notifications')}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Transaction History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.transaction_history')}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm">{t('company_dashboard.view_all_transactions')}</Button>
            <Button variant="outline" className="text-sm">{t('company_dashboard.export_pdf')}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {transactionHistory.length > 0 ? (
            transactionHistory.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{transaction.product || transaction.service}</div>
                  <div className="text-sm text-gray-600">
                    {transaction.freelancer ? `${t('company_dashboard.freelancer')} ${transaction.freelancer}` : `${t('company_dashboard.provider')} ${transaction.provider}`}
                  </div>
                  <div className="text-sm text-gray-600">{t('company_dashboard.payment')} {transaction.paymentMethod}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{transaction.amount.toLocaleString()} GNF</div>
                  <div className="text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{formatTimestamp(transaction.date).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>{t('company_dashboard.no_transactions')}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Freelancer Marketplace */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.freelancer_marketplace')}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm">{t('company_dashboard.post_jd')}</Button>
            <Button variant="outline" className="text-sm">{t('company_dashboard.view_applications')}</Button>
            <Button variant="outline" className="text-sm">{t('company_dashboard.bid_project')}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {freelancerMarketplace.length > 0 ? (
            freelancerMarketplace.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <div className="text-sm text-gray-600">
                    {item.applicants ? `${t('company_dashboard.applicants')} ${item.applicants}` : `${t('company_dashboard.posted_by')} ${item.postedBy}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.budget.toLocaleString()} GNF</div>
                  <div className="text-sm text-gray-600">
                    {item.deadline ? `${t('company_dashboard.deadline')} ${formatTimestamp(item.deadline).toLocaleDateString()}` : t('company_dashboard.no_deadline')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>{t('company_dashboard.no_marketplace_activity')}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Digital Growth Bundle - Subscription Plans */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">{t('company_dashboard.digital_growth_bundle')}</h3>
        </div>

        {subscriptions.length > 0 && subscriptions[0].plans && typeof subscriptions[0].plans === 'object' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(subscriptions[0].plans).map((plan, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${plan.name.toLowerCase().includes(subscriptions[0].currentPlan)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
                }`}>
                <div className="text-center mb-4">
                  <h4 className="font-semibold text-lg">{plan.name}</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {plan.price === 0 ? t('company_dashboard.free') : `${plan.price.toLocaleString()} ${plan.currency}`}
                  </div>
                  {plan.period && plan.period !== 'Free' && (
                    <div className="text-sm text-gray-600">/{plan.period}</div>
                  )}
                  {plan.discount && (
                    <div className="text-sm text-green-600 font-medium">{plan.discount}</div>
                  )}
                </div>

                <ul className="space-y-2 mb-4">
                  {Array.isArray(plan.features) && plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <Button
                    className="w-full"
                    variant={plan.name.toLowerCase().includes(subscriptions[0].currentPlan) ? "default" : "outline"}
                  >
                    {plan.name.toLowerCase().includes(subscriptions[0].currentPlan) ? t('company_dashboard.current_plan') : t('company_dashboard.upgrade')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>{t('company_dashboard.no_subscription_details')}</p>
          </div>
        )}
      </Card>

      {/* Employees */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t('company_dashboard.employees')}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm">{t('company_dashboard.add_employee')}</Button>
            <Button variant="outline" className="text-sm">{t('company_dashboard.assign_equipment')}</Button>
            <Button variant="outline" className="text-sm">{t('company_dashboard.request_training')}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {employees.length > 0 ? (
            employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-gray-600">{t('company_dashboard.role')} {employee.role}</div>
                  <div className="text-sm text-gray-600">{t('company_dashboard.equipment')} {employee.equipment} ({employee.equipmentSource})</div>
                </div>
                <div className="text-right">
                  {Array.isArray(employee.training) && employee.training.map((training, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{training.courseName}</div>
                      <div className="text-gray-600">{training.progress}% {t('company_dashboard.complete')}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>{t('company_dashboard.no_employees')}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
