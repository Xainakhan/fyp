// healthInterview/components/StepIndicator.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { STEPS } from "./Constants";

interface StepIndicatorProps {
  currentStepIndex: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStepIndex }) => {
  const { t } = useTranslation("healthInterview");

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isDone = index < currentStepIndex;
          return (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-1 ${
                isActive ? "border-green-600 bg-green-50"
                : isDone  ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white"
              }`}>
                <Icon size={18} className={isActive || isDone ? "text-green-600" : "text-gray-400"} />
              </div>
              <span className="text-[11px] text-gray-600 text-center">
                {t(`steps.${step.id}`)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;