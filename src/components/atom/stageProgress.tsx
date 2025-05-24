'use client';

import { Check } from 'lucide-react';

type StageProgressProps = {
  currentStage: number; // 1-based index
  stages: string[];
};

export default function StageProgress({ currentStage, stages }: StageProgressProps) {
  return (
    <div className="flex items-center justify-between w-full relative ">
      <div className="absolute top-3 left-0 right-0 w-[90%] mx-auto h-0.5 -translate-y-1/2 bg-gray-300">
        <div
          className={`h-full   bg-certFillBlue transition-all duration-300`}
          style={{ width: `${((currentStage - 1) / 3) * 100}%` }}
        />
      </div>
      {stages.map((stage, index) => {
        const isCompleted = currentStage > index + 1;
        const isActive = currentStage === index + 1;

        return (
          <div className="flex flex-col gap-1 items-center relative" key={index}>
            <div
              className={`h-6 w-6 z-10 rounded-full text-xs font-semibold flex items-center justify-center ${
                isCompleted
                  ? 'bg-certFillBlue text-white'
                  : isActive
                    ? 'bg-certFillBlue text-white'
                    : 'bg-gray-300 text-white'
              }`}
            >
              {isCompleted ? <Check size={16} /> : index + 1}
            </div>
            <p className={`text-sm ${isCompleted ? 'font-semibold text-certFillBlue' : ''}`}>
              {stage}
            </p>
          </div>
        );
      })}
    </div>
  );
}
