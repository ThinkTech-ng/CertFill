'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  name: string;
}

interface FormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  courses: Course[];
}

function Form() {
  const router = useRouter();
  const [learningTracks, setLearningTracks] = useState<string[]>(['']);

  const handleAddTrack = () => {
    setLearningTracks([...learningTracks, '']);
  };

  const handleTrackChange = (index: number, value: string) => {
    const updatedTracks = [...learningTracks];
    updatedTracks[index] = value;
    setLearningTracks(updatedTracks);
  };

  const createProgram = async (formData: FormData) => {
    try {
      const response = await fetch('https://certfillapi.reckonio.com/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'f171668084a1848bca2875372bf209c96232880dbbc6fa9541435ede3b6e1590',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create program');
      }

      const data = await response.json();
      console.log('Program created successfully:', data);

      // Navigate to the appropriate route
      router.push(`/admin/projects/${data._id}/courses`);
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: FormData = {
      name: (e.currentTarget.elements.namedItem('programName') as HTMLInputElement).value,
      description: (e.currentTarget.elements.namedItem('description') as HTMLTextAreaElement).value,
      startDate: '2024-04-01T00:00:00.000Z',
      endDate: '2024-09-30T23:59:59.000Z',
      courses: learningTracks
        .filter((track) => track.trim() !== '')
        .map((track) => ({ name: track })),
    };
    console.log('Form submitted:', formData);
    createProgram(formData);

    // Clear the form after submission
    e.currentTarget.reset();
    setLearningTracks(['']);
  };

  return (
    <div className="mx-auto  flex w-full max-w-[700px] max-h-[500px] overflow-y-scroll">
      <form onSubmit={handleSubmit} className="space-y-5 w-full ">
        <div className="formField">
          <input
            type="text"
            name="programName"
            placeholder="Program Name"
            className="inputField  "
            required
          />
        </div>

        <div className="formField">
          <textarea
            name="description"
            placeholder="Description"
            className="inputField resize-none"
            rows={4}
            required
          ></textarea>
        </div>

        {learningTracks.map((track, index) => (
          <div key={index} className="formField">
            <input
              type="text"
              value={track}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleTrackChange(index, e.target.value)
              }
              placeholder="Learning Track / Course"
              className="inputField"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddTrack}
          className="inputField border-dashed text-center"
        >
          Add Learning Track / Course
        </button>

        <button className="mainButton text-xl font-semibold h-[68px] capitalize" type="submit">
          Create Project
        </button>
      </form>
    </div>
  );
}

export default Form;
