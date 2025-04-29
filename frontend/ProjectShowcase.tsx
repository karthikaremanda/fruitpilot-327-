import React, { useState } from 'react';
import { ProjectInfo } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProjectShowcaseProps {
  projects: ProjectInfo[];
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextProject = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  const activeProject = projects[activeIndex];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Fruit Pilot Drone Project</h3>
      </div>

      <div className="relative">
        <div className="relative h-64 overflow-hidden">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h4 className="text-xl font-semibold text-white">{project.title}</h4>
                <p className="text-white/80 mt-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-white/30 backdrop-blur-sm rounded-full text-white hover:bg-white/50 transition-colors"
          onClick={prevProject}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-white/30 backdrop-blur-sm rounded-full text-white hover:bg-white/50 transition-colors"
          onClick={nextProject}
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-4 flex justify-center">
        <div className="flex space-x-2">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex 
                  ? 'w-6 bg-green-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setActiveIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;