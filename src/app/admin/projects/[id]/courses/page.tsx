/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import logo from "@/public/certLogo.svg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import GradeForm from "./createGrade";
import Link from "next/link";
import { getSinglePrograms } from "@/service/programs";

interface ProgramDetails {
  name: string;
  description: string;
  courses: Array<Course>;
}

interface Course {
  name: string;
  _id: string;
}

function ProgramDetailsPage() {
  const { id } = useParams(); // Get the program ID from the URL
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const data = await getSinglePrograms(id)
        setProgram({
          name: data.name,
          description: data.description,
          courses: data.courses,
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const toggleCourse = (_id: string) => {
    setActiveIndex(_id === activeIndex ? null : _id);
  };

  return (
   <div className="h-full grow bg-white text-black flex flex-col justify-between">
        <h1 className="text-2xl font-bold mb-4">{program?.name}</h1>
        <div className="mx-auto max-w-[700px] w-full">
          {" "}
          {program && (
            <div className="w-full py-8">
              {program?.courses.map((course) => (
                <div className="flex flex-col gap-4" key={course._id}>
                  <div
                    className="text-2xl flex-row justify-between flex"
                    onClick={() => toggleCourse(course._id)}
                  >
                    <span>{course.name}</span>
                    <span className="text-xl">
                      {activeIndex === course._id ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronUp />
                      )}
                    </span>
                  </div>

                  {activeIndex === course._id && (
                    <div className="mt-2 text-gray-600 leading-6 w-full font-satoshi text-lg lg:max-w-[650px] slg:max-w-[590px]">
                      <GradeForm courseId={course._id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            className="inputField border-dashed text-center my-5 hidden"
          >
            Add Learning Track / Course
          </button>
          {/* <button className="mainButton   h-[68px] capitalize" type="submit">
            save
          </button> */}
        </div>
      </div>
  );
}

export default ProgramDetailsPage;
