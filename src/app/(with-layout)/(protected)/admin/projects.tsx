/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Define TypeScript interfaces for the API response structure
interface Course {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  courses: Course[];
}

const Projects: React.FC = () => {
  const [projectsList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch projects from the API
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://certfillapi.reckonio.com/api/programs/all-programs', {
          method: 'GET',
          headers: {
            'X-Api-Key': 'f171668084a1848bca2875372bf209c96232880dbbc6fa9541435ede3b6e1590',
          },
        });
        const data: Project[] = await response.json();
        setProjectList(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projectsList?.length) {
    return (
      <div className="w-full flex flex-col min-h-60 justify-between">
        <span className="py-8 text-center text-xl flex items-center mx-auto">
          You currently don&apos;t have any projects
        </span>
        <Link
          className="mainButton text-xl font-semibold h-[68px] capitalize"
          href="/admin/projects"
        >
          Create New Project
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col ">
      <div className="text-[#C2C2C2] flex flex-row justify-between items-center gap-8">
        <h2 className="text-md font-bold  tracking-[2px] uppercase shrink-0">Past Programs</h2>
        <div className="w-full flex-grow h-[1px] bg-[#C2C2C2]"></div>
      </div>

      <div className="flex flex-col gap-2 h-60 overflow-scroll no-scrollbar my-3">
        {projectsList?.map((project) => (
          <Link
            href={`/admin/projects/${project._id}/courses`}
            key={project._id}
            className="hover:text-blue-800 text-black"
          >
            <h3 className="text-lg font-medium">{project.name}</h3>
          </Link>
        ))}
      </div>

      <Link className="mainButton text-xl font-semibold h-[68px] capitalize" href="/admin/projects">
        Create New Project
      </Link>
    </div>
  );
};

export default Projects;
