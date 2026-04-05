import React, { useEffect, useState } from 'react';
import { FiMail, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import LogoLoader from '../../components/LogoLoader';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await api.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert('Failed to delete message.');
    }
  };

  if (loading) {
    return <LogoLoader message="Loading messages..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Messages</h2>
            <p className="text-sm text-neutral-500 mt-1">Messages submitted from the public contact form.</p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-full">
            <FiMail size={14} />
            {messages.length} total
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500">Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500">Email</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500">Message</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500">Date</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-14 text-center text-sm text-neutral-400">
                    No messages yet.
                  </td>
                </tr>
              ) : (
                messages.map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-50/70">
                    <td className="px-5 py-4 text-sm font-medium text-neutral-900">{item.name}</td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{item.email}</td>
                    <td className="px-5 py-4 text-sm text-neutral-700 max-w-[420px] whitespace-pre-wrap">{item.message}</td>
                    <td className="px-5 py-4 text-sm text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center justify-center p-2.5 rounded-lg bg-neutral-100 text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete message"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;
