import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectMap from '../../components/maps/ProjectMap';
import Seo from '../../components/Seo';

const ProjectMapPage = () => {
  const { slug } = useParams();
  const effectiveSlug = slug || 'rural-school-support';

  return (
    <>
      <Seo
        title="Interactive Project Map | Field Tracker"
        description="Explore community schools, exact field coordinates, and verified construction milestones supported by Sa-Sewa Foundation across Nepal."
      />
      <main className="h-screen w-screen overflow-hidden bg-[#f6f3ee]">
        <ProjectMap projectSlug={effectiveSlug} />
      </main>
    </>
  );
};

export default ProjectMapPage;
