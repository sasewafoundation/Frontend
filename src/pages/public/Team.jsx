import React from 'react';
import { FiMail, FiLinkedin, FiUsers } from 'react-icons/fi';
import Seo from '../../components/Seo';

const Team = () => {
  // FIX 18: Preserving commented-out team data for future administrative population
  const teamMembers = [/*
    {
      name: "Saurabh Sharma",
      role: "Executive Director",
      bio: "10+ years guiding strategic community operations and scaling NGO outreach across South Asia.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Dr. Anjali Khatri",
      role: "Head of Medical Outreach",
      bio: "Former WHO physician. Organizes rural mobile health clinics globally and pandemic response units.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Maya Lama",
      role: "Field Program Coordinator",
      bio: "Directs grassroot educational initiatives, focusing heavily on youth literacy in marginalized zones.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Rajesh Gurung",
      role: "Logistics Director",
      bio: "Extensive background in military supply chains. Ensures critical aid reaches difficult terrain safely.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }*/
  ];

  return (
    <div className="bg-white py-32 overflow-hidden w-full">
      <Seo title="Team" description="Meet the people supporting the work of Sa-Sewa Foundation." />
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-primary-600 tracking-widest uppercase mb-3 block">
            The People
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-6">
            Faces Behind The Impact
          </h1>
          <p className="text-lg leading-relaxed text-neutral-500 font-normal">
            Behind every initiative and community programme lies a dedicated network of operational leaders, volunteers, and advisors translating vision into sustainable local reality.
          </p>
        </div>
        
        {teamMembers.length === 0 ? (
          /* FIX 18: Presentable empty state fallback */
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-neutral-50 rounded-3xl border border-neutral-100 shadow-sm">
            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary-100">
              <FiUsers size={30} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Our team directory is being updated
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              We are currently revising our staff and advisory council profiles. Check back soon to meet our foundation members.
            </p>
            <a
              href="mailto:sasewafoundation@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <FiMail size={15} /> Contact our office
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {teamMembers.map((person) => (
              <div 
                key={person.name} 
                className="group flex flex-col md:flex-row items-center md:items-start gap-8 p-6 md:p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="shrink-0 relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-gray-100 shadow-sm relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <img 
                      className="w-full h-full object-cover" 
                      src={person.image} 
                      alt={person.name}
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">{person.name}</h3>
                  <p className="text-sm font-bold uppercase tracking-wider text-primary-600 mb-4">{person.role}</p>
                  <p className="text-gray-500 leading-relaxed font-light text-sm md:text-base mb-6">
                    {person.bio}
                  </p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <a href="mailto:sasewafoundation@gmail.com" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <FiMail size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <FiLinkedin size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Team;
