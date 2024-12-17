/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import Link from "next/link";

function Projects() {
  const [projectsList, setProjectList] = useState([]);

  if (projectsList.length === 0) {
    return (
      <div className="w-full flex flex-col min-h-60 justify-between">
        <span className="py-8 text-center text-xl flex items-center mx-auto ">
          You currently don&apos;t have any projects
        </span>
        <Link
          className="mainButton text-xl font-semibold h-[68px] capitalize"
          href="/admin/projects"
        >
          Create New project
        </Link>
      </div>
    );
  } else if (projectsList.length >= 1) {
    return <div>Old projects</div>;
  }
}

export default Projects;
