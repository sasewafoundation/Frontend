import React, { useState } from 'react';
import api from '../../services/api';

const Donate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Processing Inquiry...' });
    try {
      // POST mapping according to your donations.js backend
      await api.post('/donations', { ...formData, amount: Number(formData.amount) });
      setStatus({ type: 'success', message: 'Thank you! Your donation inquiry has been received. We will send you instructions.' });
      setFormData({ name: '', email: '', amount: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.response?.data?.message || 'Something went wrong.' });
    }
  };

  return (
    <div className="donate-page">
      <div className="container donate-container">
        
        {/* Left Side: Information */}
        <div className="donate-info">
          <h2>Support Our Cause</h2>
          <p className="lead-text">
            Your contributions allow us to provide essential resources and drive high-impact projects globally.
          </p>
          <div className="impact-cards">
            <div className="impact-card">
              <h3>$25</h3>
              <p>Provides school supplies for a child for an entire year.</p>
            </div>
            <div className="impact-card">
              <h3>$100</h3>
              <p>Funds medical kits directly helping remote communities.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="donate-form-wrapper">
          {status.message && (
            <div className={`alert alert-${status.type}`}>
              {status.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="donate-form">
            <h3 className="form-title">Make a Donation Inquiry</h3>
            <p className="form-subtitle">Currently, we only accept bank transfers. Please fill out details below.</p>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Pledged Amount (USD)</label>
              <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} min="1" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="3"></textarea>
            </div>

            <button type="submit" className="btn-primary form-submit" disabled={status.type === 'loading'}>
              {status.type === 'loading' ? 'Processing...' : 'Pledge Donation'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .donate-page {
          padding: 80px 0;
          background-color: var(--bg-light);
          min-height: calc(100vh - 80px);
        }

        .donate-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }

        @media (min-width: 900px) {
          .donate-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .donate-info h2 {
          font-size: 2.5rem;
          color: var(--text-dark);
          margin-bottom: 16px;
        }

        .lead-text {
          font-size: 1.15rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .impact-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .impact-card {
          background: white;
          padding: 24px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .impact-card h3 {
          color: var(--primary-blue);
          font-size: 2rem;
          margin-bottom: 8px;
        }
        
        .impact-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .donate-form-wrapper {
          background: white;
          padding: 40px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .form-title {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .form-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 24px;
        }

        /* Shared Form Styles with Volunteer */
        .form-group { margin-bottom: 20px; }
        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--text-dark);
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #E5E7EB;
          border-radius: var(--radius-sm);
          font-family: inherit;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(30, 111, 184, 0.1);
        }
        .form-submit { width: 100%; margin-top: 10px; }
        
        .alert {
          padding: 12px;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
        }
        .alert-success { background-color: #D1FAE5; color: #065F46; }
        .alert-error { background-color: #FEE2E2; color: #991B1B; }
        .alert-loading { background-color: #DBEAFE; color: #1E40AF; }
      `}</style>
    </div>
  );
};

export default Donate;
