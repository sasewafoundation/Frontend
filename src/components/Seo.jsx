import React from 'react';
import { Helmet } from 'react-helmet-async';

const siteName = 'Sa-Sewa Foundation';
const defaultDescription = 'Sa-Sewa Foundation supports communities across Nepal through practical local action.';

const Seo = ({ title, description = defaultDescription }) => {
  const pageTitle = title ? (title.includes(siteName) ? title : `${title} | ${siteName}`) : siteName;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="icon" type="image/png" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />
    </Helmet>
  );
};

export default Seo;