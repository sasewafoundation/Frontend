import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiDollarSign, FiMail, FiCalendar, FiMessageSquare, FiArrowUpRight, FiMinusCircle } from 'react-icons/fi';
import LogoLoader from '../../components/LogoLoader';

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/donations');
        setDonations(res.data.data || []);
      } catch (err) {
        console.error("Failed to load donations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const totalFund = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading) return <LogoLoader message="Loading donations..." />;

  return (
    <div className="space-y-10">
      
      <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-gray-900 transition-all duration-500">
            <div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-green/10 text-accent-green rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 w-fit">
                    <FiDollarSign /> Financial Streams
                </div>
                <h2 className="text-4xl font-black tracking-tighter group-hover:text-accent-green transition-colors duration-500">Donation Inquiries</h2>
                <p className="text-gray-400 font-medium mt-2 max-w-md">Real-time ledger of philanthropic pledges and structural transfers.</p>
            </div>
            <div className="flex items-center gap-6 bg-accent-green text-white px-10 py-6 rounded-[2.5rem] shadow-xl shadow-accent-green/20 group hover:scale-[1.02] transition-all">
                <div className="flex flex-col">
                    <span className="text-3xl font-black leading-none">${totalFund.toLocaleString()}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">Gross Pledges</span>
                </div>
                <FiArrowUpRight size={28} className="opacity-40 group-hover:opacity-100 transition-all" />
            </div>
        </div>
        
        {/* Background abstract overlay */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent-green/5 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Donor Profile</th>
                <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Pledged Asset</th>
                <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Narrative</th>
                <th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-12 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                        <FiMinusCircle size={48} className="text-gray-400" />
                        <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">No financial records detected.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                donations.map(don => (
                  <tr key={don._id} className="group hover:bg-gray-50/40 transition-all duration-300">
                    <td className="px-12 py-8">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900 uppercase tracking-tighter group-hover:text-accent-green transition-colors">{don.name}</span>
                        <span className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1 uppercase tracking-tight"><FiMail size={12}/> {don.email}</span>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="inline-flex items-center gap-3 bg-gray-100/50 px-6 py-3 rounded-2xl border border-gray-100">
                        <span className="text-xl font-black text-accent-green leading-none">${don.amount.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-gray-300 border-l border-gray-200 pl-3 uppercase">USD</span>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex items-start gap-3 max-w-[400px]">
                        <FiMessageSquare className="text-gray-200 shrink-0 mt-1" size={16} />
                        <span className="text-sm font-bold text-gray-500 leading-relaxed italic">{don.message || 'No specific allocation requested.'}</span>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-gray-600 font-mono italic">{new Date(don.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span>
                            <span className="text-[10px] font-black text-gray-300 uppercase">Received</span>
                        </div>
                      </div>
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

export default ManageDonations;
