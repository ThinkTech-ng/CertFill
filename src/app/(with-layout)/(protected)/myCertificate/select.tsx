/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  _id: string;
  name: string;
}

interface Program {
  _id: string;
  name: string;
  description: string;
  courses: Course[];
}

interface FormData {
  programId: string;
  courseId: string;
  email: string;
}

function Form() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('https://certfillapi.reckonio.com/api/programs/all-programs', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }

      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleProgramChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const programId = e.target.value;
    setSelectedProgram(programId);
    setSelectedCourse(''); // Reset course when program changes
    if (programId) {
      const selectedProgram = programs.find((program) => program._id === programId);
      setCourses(selectedProgram ? selectedProgram.courses : []);
    }
  };

  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      programId: selectedProgram,
      courseId: selectedCourse,
      email: email,
    };

    // Navigate to the certificate page with the form data
    router.push(
      `/myCertificate/download?programId=${selectedProgram}&courseId=${selectedCourse}&email=${encodeURIComponent(
        email,
      )}`,
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[700px] max-h-[500px] overflow-y-scroll">
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* Program Select */}
        <div className="formField">
          <label htmlFor="program">Select Program</label>
          <select
            id="program"
            name="program"
            value={selectedProgram}
            onChange={handleProgramChange}
            className="inputField"
            required
          >
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program._id} value={program._id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Select */}
        {selectedProgram && (
          <div className="formField">
            <label htmlFor="course">Select Course</label>
            <select
              id="course"
              name="course"
              value={selectedCourse}
              onChange={handleCourseChange}
              className="inputField"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Email Input */}
        <div className="formField">
          <label htmlFor="email">Enter Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
            className="inputField"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="mainButton text-xl font-semibold h-[68px] capitalize">
          Get Certificate
        </button>
      </form>
    </div>
  );
}

export default Form;
