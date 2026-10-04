import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import ScrollToTop from './components/ScrollToTop';
import LogoLoader from './components/LogoLoader';
// FIX 8: Error boundary wrapper
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Blog = lazy(() => import('./pages/public/Blog'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Volunteer = lazy(() => import('./pages/public/Volunteer'));
const JoinUs = lazy(() => import('./pages/public/JoinUs'));
const Projects = lazy(() => import('./pages/public/Projects'));
const ProjectDetail = lazy(() => import('./pages/public/ProjectDetail'));
const Team = lazy(() => import('./pages/public/Team'));
const Donation = lazy(() => import('./pages/public/Donation'));
const Article = lazy(() => import('./pages/public/Article'));
// FIX 8: 404 page lazy load
const NotFound = lazy(() => import('./pages/public/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageVolunteers = lazy(() => import('./pages/admin/ManageVolunteers'));
const ManageBlogs = lazy(() => import('./pages/admin/ManageBlogs'));
// FIX 6: ManageDonations route
const ManageDonations = lazy(() => import('./pages/admin/ManageDonations'));
const ManageSponsors = lazy(() => import('./pages/admin/ManageSponsors'));
const ManageMessages = lazy(() => import('./pages/admin/ManageMessages'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* FIX 8: Wrap suspense with ErrorBoundary to prevent full white-screen crashes */}
      <ErrorBoundary>
        <Suspense fallback={<LogoLoader message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="volunteer" element={<Navigate to="/join-us" replace />} />
              <Route path="join-us" element={<JoinUs />} />
              <Route path="join-us/apply" element={<Volunteer />} />
              <Route path="team" element={<Team />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<Article />} />
              <Route path="contact" element={<Contact />} />
              <Route path="donation" element={<Donation />} />
              {/* FIX 7: Redirect legacy /donate URL directly to /donation */}
              <Route path="donate" element={<Navigate to="/donation" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="volunteers" element={<ManageVolunteers />} />
              <Route path="blogs" element={<ManageBlogs />} />
              {/* FIX 6: Admin route for ManageDonations */}
              <Route path="donations" element={<ManageDonations />} />
              <Route path="supporters" element={<ManageSponsors />} />
              <Route path="messages" element={<ManageMessages />} />
            </Route>

            {/* FIX 8: 404 Catch-All Route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
