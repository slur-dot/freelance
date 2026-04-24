import React, { useState } from 'react';
import { HelpCircle, MessagesSquare, Clock, Filter, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

const mockIssues = [
  { id: 'TKT-2431', subject: 'Laptop display flickering', reporter: 'Alex M.', priority: 'High', status: 'open', date: '2024-04-20' },
  { id: 'TKT-2428', subject: 'Cannot access internal VPN', reporter: 'Sarah S.', priority: 'Critical', status: 'in_progress', date: '2024-04-19' },
  { id: 'TKT-2410', subject: 'Requesting new keyboard', reporter: 'David L.', priority: 'Low', status: 'resolved', date: '2024-04-15' },
];

export default function IssueReporting() {
  const [filter, setFilter] = useState('all');

  const filteredIssues = mockIssues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issue Reporting</h1>
          <p className="text-gray-500 mt-1">Track and manage IT support tickets and facility problems.</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Report New Issue
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setFilter('all')} 
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${filter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          All Tickets
        </button>
        <button 
          onClick={() => setFilter('open')} 
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${filter === 'open' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Open
        </button>
        <button 
          onClick={() => setFilter('in_progress')} 
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${filter === 'in_progress' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => setFilter('resolved')} 
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${filter === 'resolved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Resolved
        </button>
      </div>

      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-500">
             No tickets found for this filter.
          </div>
        ) : (
          filteredIssues.map(issue => (
            <div key={issue.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div className="flex items-start gap-4">
                 <div className={`p-3 rounded-xl flex-shrink-0 ${
                   issue.status === 'open' ? 'bg-red-50 text-red-600' :
                   issue.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600' :
                   'bg-green-50 text-green-600'
                 }`}>
                   {issue.status === 'open' ? <AlertTriangle className="w-6 h-6" /> :
                    issue.status === 'in_progress' ? <Clock className="w-6 h-6" /> :
                    <CheckCircle2 className="w-6 h-6" />}
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm font-mono text-gray-500">{issue.id}</span>
                     <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                       issue.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                       issue.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                       'bg-gray-100 text-gray-700'
                     }`}>
                       {issue.priority}
                     </span>
                   </div>
                   <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{issue.subject}</h3>
                   <div className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                     <span>Reported by <span className="font-medium text-gray-700">{issue.reporter}</span></span>
                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                     <span>{issue.date}</span>
                   </div>
                 </div>
              </div>
              <div className="flex items-center gap-3 self-end md:self-auto">
                 <span className="text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">View Details</span>
                 <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
