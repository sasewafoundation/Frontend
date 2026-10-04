import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * FIX 7: Legacy Donate component redirected to unified Donation page
 */
const Donate = () => {
  return <Navigate to="/donation" replace />;
};

export default Donate;
