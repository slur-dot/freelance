import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle2, ChevronRight, Loader2, X } from 'lucide-react';
import { auth } from '../../../firebaseConfig';
import { TicketService } from '../../../services/ticketService';

export default function IssueReporting() {
  const [filter, setFilter] = useState('all');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newIssue, setNewIssue] = useState({
    subject: '', description: '', category: 'general', priority: 'medium'
  });

  const user = auth.currentUser;

  const fetchIssues = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const tickets = await TicketService.getUserTickets(user.uid);
      setIssues(tickets);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [user]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!user || !newIssue.subject) return;
    try {
      setCreating(true);
      await TicketService.createTicket(user.uid, {
        ...newIssue,
        createdBy: user.displayName || user.email || user.uid
      });
      setNewIssue({ subject: '', description: '', category: 'general', priority: 'medium' });
      setShowCreateModal(false);
      await fetchIssues();
    } catch (error) {
      console.error("Error creating issue:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  const formatDate = (dateVal) => {
    if (!dateVal) return '-';
    if (dateVal.seconds) return new Date(dateVal.seconds * 1000).toLocaleDateString();
    if (dateVal._seconds) return new Date(dateVal._seconds * 1000).toLocaleDateString();
    return new Date(dateVal).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issue Reporting</h1>
          <p className="text-gray-500 mt-1">Track and manage IT support tickets and facility problems.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Report New Issue
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        {['all', 'open', 'in_progress', 'resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${filter === f ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {f === 'all' ? 'All Tickets' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-500">
            {issues.length === 0
              ? "No tickets yet. Click 'Report New Issue' to create one."
              : "No tickets found for this filter."
            }
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
                    <span className="text-sm font-mono text-gray-500">{issue.id.slice(0, 10)}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                      issue.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      issue.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      issue.priority === 'low' ? 'bg-gray-100 text-gray-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {issue.priority}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${
                      issue.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                      issue.category === 'billing' ? 'bg-purple-100 text-purple-700' :
                      issue.category === 'dispute' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {issue.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{issue.subject}</h3>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                    <span>Reported by <span className="font-medium text-gray-700">{issue.createdBy || 'Unknown'}</span></span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{formatDate(issue.createdAt)}</span>
                  </div>
                  {issue.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{issue.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 self-end md:self-auto">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  issue.status === 'open' ? 'bg-red-100 text-red-700' :
                  issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {issue.status === 'in_progress' ? 'In Progress' : issue.status?.charAt(0).toUpperCase() + issue.status?.slice(1)}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Report New Issue</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateIssue} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={newIssue.subject}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newIssue.description}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Provide more details about the issue..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newIssue.category}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="dispute">Dispute</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newIssue.priority}
                      onChange={(e) => setNewIssue(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
                  >
                    {creating ? "Submitting..." : "Submit Ticket"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border border-gray-300 py-2 px-4 rounded-md font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
